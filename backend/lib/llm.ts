// lib/llm.ts — AI(안뇽GPT, BAZE 게이트웨이) 호출은 이 파일 한 곳에서만 한다.
// 서버(app/api)에서만 import한다. 키는 process.env에서만 읽는다(NEXT_PUBLIC_ 금지).
// 게이트웨이의 Claude 전용 주소(/claude/v1/messages)를 fetch로 부른다. 여기서만 생각(thinking)을 끄고 답 길이 상한을 정할 수 있다.
// (OpenAI 방식 주소 /chat/completions는 생각을 끌 수 없어 같은 채점에 출력 토큰이 6~8배 들었다. 측정: docs/notes/token-fit.md)
// 학교 도입 때는 이 파일만 바꾸면 다른 AI로 갈아 끼울 수 있다.
import "server-only"; // 클라이언트 컴포넌트가 이 파일을 import하면 빌드가 멈춘다(키 유출 입구 차단, Next 내장)
import { createHash } from "node:crypto";

export class LLMError extends Error {}

/** 위기 낱말: 이런 말이 보이면 AI에 보내지 않고 교사 화면에 "확인 필요"만 띄운다 */
export const CRISIS_WORDS = ["죽고싶", "자해", "자살"];
// 이 단원의 수업 용어 "제자해(制字解)"에 "자해"가 들어 있어서 먼저 지우고 본다
const CRISIS_SAFE = ["제자해"];

/** 위기 낱말이 있는지. 띄어쓰기를 지우고 본다("죽고 싶다", "죽고싶다" 둘 다) */
export function isCrisis(text: string): boolean {
  let t = text.replace(/\s+/g, "");
  for (const w of CRISIS_SAFE) t = t.replaceAll(w, "");
  return CRISIS_WORDS.some((w) => t.includes(w));
}

/** AI에 보내기 전에 메일·전화번호처럼 보이는 것을 가린다(띄어 쓰거나 점 찍은 번호 포함) */
export function maskPII(text: string): string {
  return text
    .replace(/[^\s@]+@[^\s@]+\.[^\s@]+/g, "[메일]")
    .replace(/(?:\+?82[-.\s]?)?0?1[016789][-.\s]?\d{3,4}[-.\s]?\d{4}/g, "[번호]")
    .replace(/[0-9][0-9-]{6,}[0-9]/g, "[번호]");
}

/** 다른 사이트의 브라우저가 보낸 요청인지(Fetch Metadata). 우리 화면에서 온 요청만 받는다 */
export function crossSite(req: Request): boolean {
  return req.headers.get("sec-fetch-site") === "cross-site";
}

/** 키가 다 들어 있고 비상 스위치(LLM_DISABLED=1)가 꺼져 있는지. false면 부른 쪽이 키워드·저장본으로 대체 */
export function llmReady(): boolean {
  return (
    process.env.LLM_DISABLED !== "1" &&
    Boolean(process.env.LLM_BASE_URL && process.env.LLM_API_KEY && process.env.LLM_MODEL)
  );
}

/** AI가 든 근거가 학생 글에 실제로 있는지(띄어쓰기 차이는 무시). AI가 지어낸 근거를 막는다 */
export function quoted(text: string, quote: string): boolean {
  const squash = (s: string) => s.replace(/\s+/g, "");
  return squash(quote) !== "" && squash(text).includes(squash(quote));
}

// ── 하루 토큰 예산 ───────────────────────────────────────────────
// AI에 쓰는 토큰(입력+출력)의 하루 상한. 넘으면 AI를 부르지 않고 대체 결과로 간다(크레딧 보호).
// 서버 메모리에서 세므로 서버를 다시 켜면 0부터 센다(Vercel은 인스턴스마다 따로). 실제 도입 땐 DB·KV로 옮긴다.
const DAILY_TOKENS = Number(process.env.LLM_DAILY_TOKENS) || 100_000;
const spent = { date: "", tokens: 0, calls: 0, cached: 0 };
// 분석 몫·문제 만들기 몫은 따로 센다: 여러 번 돌려도 학생 채점(explain) 몫(하루 상한 - 두 몫)은 늘 남게
const POOL_CAP = {
  analyze: Number(process.env.LLM_ANALYZE_TOKENS) || 40_000,
  generate: Number(process.env.LLM_GENERATE_TOKENS) || 20_000, // 교사가 학습 내용으로 징검돌 초안을 만들 때(/api/generate)
  guide: Number(process.env.LLM_GUIDE_TOKENS) || 20_000, // 학생 유형 모달의 "제시 방향" 조언(/api/guide)
} as const;
const poolSpent: Record<keyof typeof POOL_CAP, number> = { analyze: 0, generate: 0, guide: 0 };

/** 오늘(한국 시간) 쓴 토큰·호출 수. 학생 글은 들어 있지 않다 */
export function usageToday() {
  const date = new Date(Date.now() + 9 * 3_600_000).toISOString().slice(0, 10);
  if (spent.date !== date) {
    Object.assign(spent, { date, tokens: 0, calls: 0, cached: 0 });
    poolSpent.analyze = 0;
    poolSpent.generate = 0;
    poolSpent.guide = 0;
  }
  return { ...spent, limit: DAILY_TOKENS };
}

// ── 같은 질문은 다시 묻지 않는다 ─────────────────────────────────
// 열쇠는 (모델+지시문+학생 답)의 해시라 학생 글 원문은 열쇠로 남지 않는다. 3시간 뒤 버리고, 500개를 넘으면 오래된 것부터 지운다.
const CACHE_MS = 3 * 3_600_000;
const CACHE_MAX = 500;
const cache = new Map<string, { at: number; value: unknown }>();

type Options = {
  label: string; // 로그 이름(예: "explain")
  maxTokens: number; // 답 길이 상한. 넘으면 잘린 답이라 버린다(다시 묻지 않음)
  timeoutMs?: number; // 기다리는 시간 전체 상한(다시 묻기 포함). 기본 6초
  allow?: () => boolean; // 실제로 AI를 부르기 직전에 확인(예: 학생별 횟수 제한). 저장된 답으로 끝나면 부르지 않는다
  effort?: "low"; // 생각을 조금 켠다. 한 번만 돌리고 정확도가 중요한 일(30명 분석)에만. 비우면 생각 끔
  pool?: keyof typeof POOL_CAP; // 따로 세는 몫(분석·문제 만들기)
};

type Reply = {
  content?: { type: string; text?: string }[];
  stop_reason?: string;
  usage?: { input_tokens?: number; output_tokens?: number };
};

/**
 * AI에 질문하고 JSON 답을 받는다.
 * - 생각(thinking)을 끈다. 짧은 분류 일이라 정확도는 같고(측정 4/4·5/5) 출력 토큰은 85% 줄었다.
 *   생각을 끌 수 없는 모델(예: Opus 5.5)로 바꾸면 400이 나서 대체 결과로 간다.
 * - temperature 같은 옵션은 넣지 않는다(Haiku 5.5는 기본값이 아닌 값을 거부한다).
 * - 답이 잘렸거나(max_tokens) 거절(refusal)이면 다시 묻지 않는다. 같은 결과에 토큰만 또 쓴다.
 * - JSON이 깨졌을 때만, 남은 시간이 1.5초 이상이면 한 번 더 묻는다.
 */
export async function callLLM<T>(system: string, user: string, opt: Options): Promise<T> {
  if (!llmReady()) throw new LLMError("no-key");
  const base = process.env.LLM_BASE_URL!.trim().replace(/\/+$/, "");
  const key = process.env.LLM_API_KEY!.trim();
  const model = process.env.LLM_MODEL!.trim();

  const think = opt.effort ? { output_config: { effort: opt.effort } } : { thinking: { type: "disabled" } };
  const id = createHash("sha256").update(`${model}\0${opt.effort ?? "off"}\0${system}\0${user}`).digest("hex");
  const hit = cache.get(id);
  const today = usageToday();
  if (hit && Date.now() - hit.at < CACHE_MS) {
    spent.cached++;
    console.info(`[llm] ${opt.label} 같은 질문 → 저장된 답(토큰 0)`);
    return hit.value as T;
  }
  if (today.tokens >= DAILY_TOKENS) throw new LLMError("budget");
  if (opt.pool && poolSpent[opt.pool] >= POOL_CAP[opt.pool]) throw new LLMError("budget");
  if (opt.allow && !opt.allow()) throw new LLMError("rate");

  const deadline = Date.now() + (opt.timeoutMs ?? 6000);
  for (let attempt = 0; attempt < 2; attempt++) {
    const left = deadline - Date.now();
    if (attempt > 0 && left < 1500) break;
    const started = Date.now();
    const res = await fetch(`${base}/claude/v1/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}`, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model,
        max_tokens: opt.maxTokens + (opt.effort ? 4000 : 0), // 생각을 켜면 생각 토큰 자리를 더 준다
        ...think,
        system,
        messages: [{ role: "user", content: user }],
      }),
      signal: AbortSignal.timeout(left),
    });
    if (!res.ok) throw new LLMError(`http-${res.status}`);
    const data = (await res.json()) as Reply;
    const inTok = data.usage?.input_tokens ?? 0;
    const outTok = data.usage?.output_tokens ?? 0;
    spent.tokens += inTok + outTok;
    spent.calls++;
    if (opt.pool) poolSpent[opt.pool] += inTok + outTok;
    console.info(
      `[llm] ${opt.label} 입력 ${inTok} · 출력 ${outTok} 토큰 · ${Date.now() - started}ms · 오늘 ${spent.tokens}/${DAILY_TOKENS}`,
    );
    if (data.stop_reason === "max_tokens" || data.stop_reason === "refusal") throw new LLMError(data.stop_reason);

    const text = (data.content ?? []).map((c) => (c.type === "text" ? (c.text ?? "") : "")).join("");
    const a = text.indexOf("{");
    const b = text.lastIndexOf("}");
    if (a >= 0 && b > a) {
      try {
        const value = JSON.parse(text.slice(a, b + 1)) as T; // 설명이 섞여도 { … }만 읽는다
        if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value as string);
        cache.set(id, { at: Date.now(), value });
        return value;
      } catch {
        /* 한 번 더 */
      }
    }
  }
  throw new LLMError("bad-json");
}
