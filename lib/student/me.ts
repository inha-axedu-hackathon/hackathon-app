// lib/student/me.ts — 학생 화면에서 쓰는 "나"(시연 학생 s07, 옛이응 ㆁ)
// 학생 화면은 반 전체 명단(data/class-2-3.json)을 불러오지 않는다: 친구 정보가 학생 브라우저로 내려가지 않게.
// 값은 data/class-2-3.json의 s07과 같게 둔다(김나희가 s07을 바꾸면 여기도 같이 고친다). 실제 도입 땐 로그인한 학생 것만 서버에서 받는다.
import type { StoneProgress } from "@/lib/types";

export const ME = {
  id: "s07",
  alias: "옛이응 ㆁ",
  path: ["st-n", "st-d", "st-t"],
  progress: { "st-n": "placed", "st-d": "placed", "st-t": "wet" } as Record<string, StoneProgress>,
  start: ["st-n"], // 출발 돌(처음부터 켜짐)
  arrived: false, // 도착 관문 통과(깃발) — 시연 시작 시점
} as const;
