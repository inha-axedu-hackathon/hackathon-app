// scripts/check-api.mjs — 시연 전 API 점검(서버가 떠 있어야 함: npm run dev 또는 npm run demo:local)
// 사용: npm run check:api            (기본 http://localhost:3000)
//       BASE=http://localhost:3123 npm run check:api
//       AI=1 npm run check:api       (AI를 실제로 부르는 경우까지, 약 700토큰)
// 기본 검사는 키워드·입력 검사·위기 낱말만 써서 AI 토큰을 쓰지 않는다. 학생 글·키는 출력하지 않는다.
const BASE = (process.env.BASE ?? "http://localhost:3000").replace(/\/+$/, "");
const withAI = process.env.AI === "1";
let fail = 0;

async function post(path, body, headers = {}) {
  const res = await fetch(BASE + path, { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body), signal: AbortSignal.timeout(20000) });
  let json = null;
  try {
    json = await res.json();
  } catch {}
  return { status: res.status, json };
}
function check(name, ok, detail = "") {
  console.log(`${ok ? "✓" : "✗"} ${name}${ok ? "" : ` — ${detail}`}`);
  if (!ok) fail = 1;
}

const ex = (text, id = "s07") => post("/api/explain", { studentId: id, stoneId: "st-t", text });

try {
  // 시연 대본(SPEC 9-2): 낱말 상자 [세게]·[획을] → 키워드로 바로 통과
  let r = await ex("ㅌ은 ㄷ보다 소리가 세게 나서 획을 하나 더했다.");
  check("관문: 시연 문장 틀 정답 → 키워드 통과", r.status === 200 && r.json?.passed === true && r.json?.source === "keyword", JSON.stringify(r.json));
  check("관문: 통과 문구", r.json?.feedback === "집현전 학자들이랑 같은 답 씀", r.json?.feedback);

  r = await ex("ㅌ은 ㄷ보다 소리가 크게 나서 획을 하나 더했다.");
  check("관문: '크게' → M2 피드백(AI 없이)", r.json?.passed === false && r.json?.misconception === "M2" && r.json?.source === "keyword", JSON.stringify(r.json));

  r = await ex("크게가 아닌 세게 나서 ㄷ에 획을 하나 더했어요");
  check("관문: 고쳐 쓴 정답('크게가 아닌 세게') → 통과", r.json?.passed === true && r.json?.source === "keyword", JSON.stringify(r.json));

  r = await ex("세게가 아니라 크게 나서 획을 하나 더했어요");
  check("관문: '세게가 아니라 크게' → M2", r.json?.passed === false && r.json?.misconception === "M2", JSON.stringify(r.json));

  r = await ex("제자해에 따르면 ㄷ에 획을 더해 ㅌ이 되고 소리가 세진다");
  check("관문: 수업 용어 '제자해'는 위기 낱말 아님", r.json?.passed === true, JSON.stringify(r.json));

  r = await ex("그냥 죽고싶다 진짜");
  check("관문: 위기 낱말 → AI 없이 교사 확인", r.json?.passed === false && r.json?.needsTeacher === true && r.json?.source === "saved", JSON.stringify(r.json));

  r = await post("/api/explain", { studentId: "x", text: "ㅌ" });
  check("관문: 잘못된 입력 → 400", r.status === 400, String(r.status));

  r = await post("/api/explain", { studentId: "s07", text: "ㄷ에 획을 더해 세진다" }, { "sec-fetch-site": "cross-site" });
  check("관문: 다른 사이트 요청 막힘", r.status === 403 || r.status === 400, String(r.status));

  r = await post("/api/analyze", { answers: [{ studentId: "s01", text: "ㄲ도 가획" }] }, { "sec-fetch-site": "cross-site" });
  check("분석: 다른 사이트 요청 막힘", r.status === 403 || r.status === 400, String(r.status));

  if (withAI) {
    r = await ex("ㄷ 위에 가로줄을 한 번 더 그었더니 숨이 확 터지는 거친 소리가 됐어요", "s08");
    check("관문(AI): 바꿔 쓴 정답 → 통과", r.json?.passed === true && r.json?.source === "llm", JSON.stringify(r.json));
    r = await ex("ㅌ은 ㄷ에 획을 더한 게 아니고 소리가 세진 것도 아니에요", "s09");
    check("관문(AI): 부정문 오답 → 불통과", r.json?.passed === false, JSON.stringify(r.json));
  }
} catch (e) {
  check(`서버 연결(${BASE})`, false, `${e instanceof Error ? e.name : e} — 서버를 먼저 켜세요`);
}
console.log(fail ? "✗ API 점검 실패" : `✓ API 점검 통과${withAI ? " (AI 포함)" : " (AI 토큰 0)"}`);
process.exit(fail);
