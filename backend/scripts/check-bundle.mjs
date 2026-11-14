// scripts/check-bundle.mjs — 교사 화면이 아닌 모든 화면의 브라우저 번들에 교사 전용 정보가 실렸는지 본다(npm run build 뒤).
// 교사 전용 값: 가짜 실명, 말해보기 원문, 예외 사유(data/class-2-3.json). 값 자체는 출력하지 않고 화면 이름과 개수만 알린다.
// 화면 목록을 손으로 적지 않고 빌드 결과에서 전부 찾는다(teacher/로 시작하는 화면과 api만 뺀다). 실패하면 종료 코드 1.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../..", import.meta.url)); // 저장소 루트(한글 경로도 되게)
const NEXT = join(ROOT, "frontend/.next");
const APP = join(NEXT, "server/app");
const students = JSON.parse(readFileSync(join(ROOT, "backend/data/class-2-3.json"), "utf8")).students;
const publicText = readFileSync(join(ROOT, "backend/data/class-2-3.public.json"), "utf8");
const secrets = [...students.map((s) => s.name), ...students.map((s) => s.signals?.explain1), ...students.map((s) => s.exception)]
  .filter((s) => typeof s === "string" && s.trim().length >= 2) // 빈 값·한 글자는 오탐이라 뺀다
  .filter((s) => !publicText.includes(s)); // 공개 명단에 원래 있는 값은 뺀다

if (!existsSync(APP)) {
  console.log("… 빌드 결과가 없어 번들 검사는 건너뛰었어요(npm run build 뒤에 다시)");
  process.exit(0);
}
const manifests = [];
(function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === "page_client-reference-manifest.js") manifests.push(p);
  }
})(APP);
const pages = manifests
  .map((m) => ({ m, route: "/" + relative(APP, m).split(sep).slice(0, -1).join("/") }))
  .filter(({ route }) => !route.startsWith("/teacher") && !route.startsWith("/api") && !route.startsWith("/_"));
if (pages.length === 0) {
  console.log("✗ 검사할 화면을 하나도 못 찾았어요(빌드 결과 구조가 바뀌었는지 확인)");
  process.exit(1);
}
let fail = 0;
for (const { m, route } of pages) {
  const chunks = [...new Set(readFileSync(m, "utf8").match(/static\/chunks\/[^"]+\.js/g) ?? [])];
  let text = "";
  for (const c of chunks) {
    try {
      text += readFileSync(join(NEXT, c), "utf8");
    } catch {}
  }
  const base = route === "/" ? "index" : route.slice(1);
  for (const ext of ["html", "rsc"]) {
    const f = join(APP, `${base}.${ext}`);
    if (existsSync(f)) text += readFileSync(f, "utf8");
  }
  const n = secrets.filter((s) => text.includes(s)).length;
  if (n) {
    console.log(`✗ ${route} 화면에 교사 전용 정보 ${n}개가 실려 있어요. 학생·교실 화면은 lib/rules/roster.ts를 import하지 마세요`);
    fail = 1;
  }
}
if (!fail) console.log(`✓ 교사 화면이 아닌 ${pages.length}개 화면에 교사 전용 정보 없음`);
process.exit(fail);
