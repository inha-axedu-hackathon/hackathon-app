// lib/llm.ts — AI(안뇽GPT, BAZE 게이트웨이) 호출은 이 파일 한 곳에서만 한다.
// 서버(app/api)에서만 import한다. 키는 process.env에서만 읽는다(NEXT_PUBLIC_ 금지).
// 게이트웨이는 OpenAI 방식(/chat/completions)이라 fetch로 부른다. 학교 도입 때는 여기만 바꾸면 다른 AI로 갈아 끼울 수 있다.

export class LLMError extends Error {}

/** 위기 낱말: 이런 말이 보이면 AI에 보내지 않고 교사 화면에 "확인 필요"만 띄운다 */
export const CRISIS_WORDS = ["죽고 싶", "자해", "자살"];

/** AI에 보내기 전에 메일·전화번호처럼 보이는 것을 가린다 */
export function maskPII(text: string): string {
  return text
    .replace(/[^\s@]+@[^\s@]+\.[^\s@]+/g, "[메일]")
    .replace(/[0-9][0-9-]{6,}[0-9]/g, "[번호]");
}

/** 키가 다 들어 있는지 (없으면 부른 쪽이 키워드·저장본으로 대체) */
export function llmReady(): boolean {
  return Boolean(process.env.LLM_BASE_URL && process.env.LLM_API_KEY && process.env.LLM_MODEL);
}

/**
 * AI에 질문하고 JSON 답을 받는다.
 * - 시간 초과(기본 4초)면 다시 시도하지 않고 LLMError를 던진다 → 부른 쪽이 대체 결과를 쓴다.
 * - 답에 JSON이 없거나 깨졌으면 한 번만 다시 시도한다.
 * - 토큰을 아끼려고 짧은 프롬프트만 보내고, 모델마다 거부할 수 있는 옵션(temperature 등)은 넣지 않는다.
 */
export async function callLLM<T>(system: string, user: string, timeoutMs = 4000): Promise<T> {
  const base = process.env.LLM_BASE_URL;
  const key = process.env.LLM_API_KEY;
  const model = process.env.LLM_MODEL;
  if (!base || !key || !model) throw new LLMError("no-key");

  const url = `${base.replace(/\/+$/, "")}/chat/completions`;
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) throw new LLMError(`http-${res.status}`);
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const text = data.choices?.[0]?.message?.content ?? "";
    const a = text.indexOf("{");
    const b = text.lastIndexOf("}");
    if (a >= 0 && b > a) {
      try {
        return JSON.parse(text.slice(a, b + 1)) as T; // 코드블록·설명이 섞여도 { … }만 읽는다
      } catch {
        /* 한 번 더 */
      }
    }
  }
  throw new LLMError("bad-json");
}
