// lib/rules/bridge.ts — 우리 반 다리 계산 (docs/SPEC.md 5-0, 5-3, 7-5)
// 입력: data/class-2-3.public.json(공개 필드만, scripts/make-public-class.mjs가 만듦) + 시연 이벤트(useDemo().events)
// 출력: 구간별 놓인 돌·날씨·잠김. 숫자(placed/total 등)는 교사 화면에서만 쓰고,
//       학생·교실 화면은 weather·locked·opened만 쓴다(반·모둠 숫자를 보여 주지 않음).
// 이 파일은 교사 전용 명단(실명·원문·라벨·유형·예외)을 import하지 않는다 → 학생·교실 번들에 실리지 않게.
import publicData from "@backend/data/class-2-3.public.json";
import { STONES } from "@backend/lib/content";
import type { DemoEvent, Section, Student, StoneProgress } from "@backend/lib/types";

/** 학생·교실 화면용 공개 명단(다리 계산과 내 진행에 필요한 필드만) */
export type PublicStudent = Pick<Student, "id" | "alias" | "team" | "path" | "start" | "progress" | "arrived">;
export const PUBLIC_STUDENTS = publicData.students as unknown as PublicStudent[];

export type Weather = "맑음" | "구름" | "먹구름" | "소나기";

export interface SectionState {
  name: Section;
  placed: number; // 놓인 돌 (교사만)
  total: number; // 전체 돌 (교사만)
  rope: number; // 함께 놓기로 밧줄에 묶여 떠오른 돌 (교사만)
  weather: Weather; // 학생·교실 화면은 이것만
  locked: boolean; // 수업 시작 때 80% 미만이라 잠긴 구간
}

export interface BridgeState {
  sections: SectionState[];
  placed: number;
  total: number;
  arrived: number; // 깃발(도착 관문 통과) 수 (교사만)
  students: number;
  lessonStarted: boolean;
  together: boolean; // 함께 놓기 끝남
  opened: boolean; // 개통
}

export const SECTIONS: Section[] = ["상형", "가획", "병서"];
const SECTION_OF = new Map<string, Section>(STONES.map((s) => [s.id, s.section as Section]));
// 전체 명단(STUDENTS)은 여기서 내보내지 않는다. 교사 화면만 lib/rules/roster.ts에서 직접 import한다
const ROSTER = PUBLIC_STUDENTS;

/** 날씨 기준(화면에는 쓰지 않음): 100% 맑음 · 80~99% 구름 · 80% 미만은 수업 전 먹구름, 수업 시작 후 소나기 */
export function weatherOf(placed: number, total: number, lessonStarted: boolean): Weather {
  const ratio = total === 0 ? 1 : placed / total;
  if (ratio >= 1) return "맑음";
  if (ratio >= 0.8) return "구름";
  return lessonStarted ? "소나기" : "먹구름";
}

/** 시연 이벤트를 반영한 반 전체 다리 상태 */
export function bridgeState(events: readonly DemoEvent[]): BridgeState {
  // 1) 시연 시작 상태를 복사
  const progress = new Map<string, Map<string, StoneProgress>>();
  const arrived = new Set<string>();
  for (const s of ROSTER) {
    progress.set(s.id, new Map(Object.entries(s.progress ?? {})));
    if (s.arrived) arrived.add(s.id);
  }
  // 2) 이벤트 반영
  let lessonStarted = false;
  let together = false;
  let opened = false;
  for (const e of events) {
    if (e.type === "stone_placed") progress.get(e.studentId)?.set(e.stoneId, "placed");
    else if (e.type === "explain_passed") arrived.add(e.studentId);
    else if (e.type === "class_started") lessonStarted = true;
    else if (e.type === "together_done") together = true;
    else if (e.type === "opened") opened = true;
  }
  // 3) 구간별로 세기 (수업 시작 순간의 비율로 잠김 판단)
  const sections = SECTIONS.map((name): SectionState => {
    let placed = 0;
    let total = 0;
    for (const s of ROSTER) {
      for (const sid of s.path ?? []) {
        if (SECTION_OF.get(sid) !== name) continue;
        total++;
        const p = progress.get(s.id)?.get(sid);
        if (p === "placed" || p === "paper") placed++;
      }
    }
    const lockedAtLesson = lessonStarted && placed / Math.max(total, 1) < 0.8;
    // 함께 놓기가 끝나면 잠긴 구간의 남은 돌이 밧줄 돌로 떠오른다(그날 안에 주인이 굳힘)
    const rope = together && lockedAtLesson ? total - placed : 0;
    const shown = placed + rope;
    return {
      name,
      placed,
      total,
      rope,
      weather: opened || rope > 0 ? weatherOf(total, total, lessonStarted) : weatherOf(shown, total, lessonStarted),
      locked: lockedAtLesson && !together,
    };
  });
  const placed = sections.reduce((n, s) => n + s.placed + s.rope, 0);
  const total = sections.reduce((n, s) => n + s.total, 0);
  return { sections, placed, total, arrived: arrived.size, students: ROSTER.length, lessonStarted, together, opened };
}

// 예시 (시연 숫자 확인용):
// bridgeState([])                                  → 상형 맑음(14/14) · 가획 구름(37/38) · 병서 먹구름(17/26), 68/78, 깃발 20
// + stone_placed(s07, st-t)                         → 가획 맑음(38/38), 69/78
// + explain_passed(s07)                             → 깃발 21
// + class_started                                   → 병서 소나기, locked
// + together_done                                   → 병서 밧줄 9 → 78/78, 맑음
