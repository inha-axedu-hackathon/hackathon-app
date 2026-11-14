> 검토 에이전트가 목업 게이트웨이로 확인한 백엔드 첫 코드예요(11/14 새벽). BAZE 실제 모델 이름과 JSON 모드 지원은 아직 확인 전이에요.


### 검증 결과
TypeScript 5.9 strict 검사를 통과했어요. 목업 OpenAI 호환 서버로 10가지 경우를 확인했어요.
- 키워드 통과: LLM을 부르지 않아요.
- 키워드가 놓친 표현: LLM이 통과시켜요.
- M2 오개념: 찾아내요.
- 4초 시간 초과: 'saved'로 처리돼요(4,004ms).
- 형식이 깨진 응답: 1회 다시 시도해서 성공해요.
- HTTP 500: saved로 처리돼요.
- 키 없음: 바로 saved로 처리돼요.
- 위기 낱말: LLM을 부르지 않고 needsTeacher로 표시해요.
- 잘못된 요청: 400을 돌려줘요.
- 전화·메일: [번호]·[메일]로 가린 뒤에 보내요.

실제 BAZE 게이트웨이로는 시험하지 못했어요.

### 백엔드 처음이면 이 순서로 읽기
1. 들어온 값 검사(400)
2. 위기 낱말 확인(AI에 보내지 않음)
3. 키워드 판정(바로 끝)
4. LLM 보조(4초)
5. 실패하면 통과시키지 않고 '선생님이 확인할게요'

API 하나 = route.ts의 export async function POST 하나예요.

### lib/llm.ts
```ts
// lib/llm.ts — 서버(app/api)에서만 import한다. 키는 process.env에서만 읽는다(NEXT_PUBLIC_ 금지)
export class LLMError extends Error {}

export async function callLLM<T>(system: string, user: string, timeoutMs = 4000): Promise<T> {
  const base = process.env.LLM_BASE_URL, key = process.env.LLM_API_KEY, model = process.env.LLM_MODEL;
  if (!base || !key || !model) throw new LLMError("no-key"); // 키가 없으면 부른 쪽이 키워드·저장본으로 대체
  for (let attempt = 0; attempt < 2; attempt++) { // 형식이 틀리면 한 번만 다시 (시간 초과는 다시 안 함)
    const res = await fetch(`${base.endsWith("/") ? base.slice(0, -1) : base}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model, temperature: 0, messages: [{ role: "system", content: system }, { role: "user", content: user }] }),
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) throw new LLMError(`http-${res.status}`);
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const text = data.choices?.[0]?.message?.content ?? "";
    const a = text.indexOf("{"), b = text.lastIndexOf("}"); // 코드블록·설명이 섞여도 { … }만
    if (a >= 0 && b > a) {
      try { return JSON.parse(text.slice(a, b + 1)) as T; } catch { /* 한 번 더 */ }
    }
  }
  throw new LLMError("bad-json");
}
```

### app/api/explain/route.ts
IDEAS 키워드와 SYSTEM 문구는 진선우의 8-3 도착 관문 기준으로 바꿔 끼워요.

```ts
// app/api/explain/route.ts — AI-2 도착 관문: ① 키워드(즉시) → ② 애매하면 LLM(4초) → ③ 실패하면 통과시키지 않고 교사 확인
import { callLLM } from "@/lib/llm";

type Idea = { id: string; hit: boolean; quote: string };
type Judge = { passed: boolean; ideas: Idea[]; misconception: string | null; feedback: string; source: "keyword" | "llm" | "saved"; needsTeacher?: boolean };

const IDEAS = [
  { id: "I1", words: ["획", "그었", "긋", "더했", "더해", "추가"] }, // 획을 더함
  { id: "I2", words: ["세게", "세서", "세다", "세진", "센 소리", "거세", "강하게"] }, // 소리가 셈(聲出稍厲)
];
const M2 = ["크게", "커서", "큰 소리", "커지", "볼륨"]; // 세기 = 크기 오개념
const CRISIS = ["죽고 싶", "자해", "맞았"]; // 위기 낱말이면 AI에 보내지 않는다
const mask = (t: string) => t.replace(/[^ ]+@[^ ]+[.][^ ]+/g, "[메일]").replace(/[0-9][0-9-]{6,}[0-9]/g, "[번호]");
const SYSTEM = `너는 중학교 국어 교사를 돕는 채점 도우미다. 질문: "ㅌ은 ㄷ에 무엇을 더한 글자이고, 왜 그렇게 만들었을까?"
핵심 생각 I1 = 획을 더했다. I2 = 소리가 더 세게 난다(해례본: 聲出稍厲). 오개념 M2 = 소리의 세기를 크기(볼륨)로 생각함.
학생 답에 각 핵심 생각이 드러났는지만 판단하고, quote는 학생 답에서 그대로 인용한다. 성격·태도는 추측하지 않는다.
feedback은 칭찬으로 시작하는 한 문장. 다음 JSON만 답한다: {"ideas":[{"id":"I1","hit":true,"quote":""},{"id":"I2","hit":false,"quote":""}],"misconception":null,"feedback":""}`;
const reply = (j: Judge) => Response.json(j);

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { studentId?: unknown; text?: unknown } | null;
  const text = typeof body?.text === "string" ? body.text.trim().slice(0, 300) : "";
  if (!/^s[0-9]{2}$/.test(String(body?.studentId)) || text.length < 5) return Response.json({ error: "studentId(s07 형식)와 5자 이상의 text가 필요해요" }, { status: 400 });
  if (CRISIS.some((w) => text.includes(w))) return reply({ passed: false, ideas: [], misconception: null, feedback: "선생님이 확인할게요", source: "saved", needsTeacher: true });

  const ideas: Idea[] = IDEAS.map((i) => { const w = i.words.find((x) => text.includes(x)); return { id: i.id, hit: !!w, quote: w ?? "" }; });
  const m2 = M2.some((w) => text.includes(w)) ? "M2" : null;
  if (ideas.every((i) => i.hit) && !m2) return reply({ passed: true, ideas, misconception: null, feedback: "획을 더한 까닭까지 정확해요!", source: "keyword" });

  try {
    const r = await callLLM<{ ideas?: Idea[]; misconception?: string | null; feedback?: string }>(SYSTEM, `학생 답: ${mask(text)}`);
    if (Array.isArray(r.ideas)) {
      const passed = ["I1", "I2"].every((id) => r.ideas!.some((x) => x.id === id && x.hit === true)) && !r.misconception;
      return reply({ passed, ideas: r.ideas, misconception: r.misconception ?? null, feedback: String(r.feedback ?? ""), source: "llm" });
    }
  } catch { /* 키 없음·시간 초과·형식 오류 → 아래로 */ }
  return reply({ passed: false, ideas, misconception: m2, feedback: m2 ? "'크게'가 아니라 '세게'예요. 숨이 거세게 나오는 정도랍니다." : "선생님이 확인할게요", source: "saved" });
}
```

### 터미널에서 확인 (npm run dev를 켜 둔 상태)
```bash
# 키워드로 통과 → source: keyword
curl -s -X POST localhost:3000/api/explain -H "Content-Type: application/json" -d '{"studentId":"s07","stoneId":"st-t","text":"ㅌ은 ㄷ보다 소리가 세게 나서 획을 하나 더 그었다"}'
# 키워드가 놓친 표현 → source: llm (키가 없으면 saved)
curl -s -X POST localhost:3000/api/explain -H "Content-Type: application/json" -d '{"studentId":"s07","stoneId":"st-t","text":"ㄷ에 줄 하나 긋고 숨이 팍 나와서"}'
# 잘못된 요청 → 400
curl -s -X POST localhost:3000/api/explain -H "Content-Type: application/json" -d '{"text":"ㄷ"}'
```

### 30명 분석과 일치율 (09:30, 내 노트북에서만)
- **/api/analyze는 같은 구조로 만들어요:**
  - 6-2 프롬프트를 써요.
  - callLLM(SYSTEM, `학생 답: ${mask(text)}`, 8000)으로, 5명씩 묶어 Promise.all로 보내요.
  - 실패한 학생은 키워드 결과(source:"keyword")로 채워요.
- **저장:** 파일은 터미널에서만 만들어요.
  - curl -s -X POST localhost:3000/api/analyze -H "Content-Type: application/json" -d @data/answers.json > data/analysis.saved.json
  - 그다음 커밋해요.
- **일치율 정의:**
  - matched: 정답 라벨의 오개념을 모두 찾고, 라벨에 없는 오개념은 만들지 않은 경우. 라벨이 비어 있으면 AI도 '없음'이어야 일치예요.
  - missed: 라벨에는 있는데 AI가 못 찾은 수
  - wrong: 라벨에는 없는데 AI가 찾은 수
  - 화면 표시: "오개념 탐지 일치 N/30 · 놓친 것 k · 잘못 찾은 것 j"