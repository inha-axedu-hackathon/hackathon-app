// backend/scripts/make-public-class.mjs — data/class-2-3.json에서 학생·교실 화면이 쓸 공개 필드만 뽑아 data/class-2-3.public.json을 만든다.
// 공개 필드: id, alias, team, path, start, progress, arrived (다리 계산과 내 진행에 필요한 것만)
// 빼는 필드: 가짜 실명(name), 번호, 참여 신호·말해보기 원문(signals), 정답 라벨, 8유형(type), 예외 사유 → 교사 화면 전용(lib/rules/roster.ts)
// npm run dev·build 전에 자동으로 돈다(package.json predev·prebuild). 김나희가 원본을 바꾸면 다시 만들어진다.
import { readFileSync, writeFileSync } from "node:fs";

const src = new URL("../data/class-2-3.json", import.meta.url);
const out = new URL("../data/class-2-3.public.json", import.meta.url);
const data = JSON.parse(readFileSync(src, "utf8"));
const KEEP = ["id", "alias", "team", "path", "start", "progress", "arrived"];
const pub = {
  _readme: "자동 생성(scripts/make-public-class.mjs). 직접 고치지 말고 data/class-2-3.json을 고친다. 학생·교실 화면용 공개 필드만 있다.",
  students: data.students.map((s) => Object.fromEntries(KEEP.filter((k) => k in s).map((k) => [k, s[k]]))),
};
const next = JSON.stringify(pub, null, 2) + "\n";
let prev = "";
try {
  prev = readFileSync(out, "utf8");
} catch {}
if (prev !== next) writeFileSync(out, next);
console.log(`공개 명단 ${pub.students.length}명 ${prev === next ? "(그대로)" : "→ data/class-2-3.public.json"}`);
