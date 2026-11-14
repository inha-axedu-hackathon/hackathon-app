// lib/rules/sectionRoster.ts — 구간(상형·가획·병서)별 학생 명단 (교사 화면 전용, 「오늘 현황」 구간 카드 → 명단)
// 학생·교실 화면에서는 import하지 않는다(교사 전용 명단을 쓴다).
import { STONES } from "@backend/lib/content";
import { bridgeState } from "@backend/lib/rules/bridge";
import { STUDENTS } from "@backend/lib/rules/roster";
import type { DemoEvent, Section, Student } from "@backend/lib/types";

/** placed 놓음 · paper 종이 돌(교사 확인) · wet 해 봤지만 아직 · rope 함께 놓기 밧줄 돌(오늘 안에 굳힘) · todo 아직 */
export type StoneState = "placed" | "paper" | "wet" | "rope" | "todo";

export interface SectionRow {
  student: Student;
  stones: { id: string; char: string; state: StoneState }[];
  done: boolean;
}

const STONE = new Map<string, { char: string; section: string }>(STONES.map((s) => [s.id, s]));

export function sectionRoster(section: Section, events: readonly DemoEvent[]): SectionRow[] {
  const placed = new Set<string>();
  for (const e of events) if (e.type === "stone_placed") placed.add(`${e.studentId}:${e.stoneId}`);
  const rope = (bridgeState(events).sections.find((x) => x.name === section)?.rope ?? 0) > 0;
  const rows: SectionRow[] = [];
  for (const s of STUDENTS) {
    const ids = (s.path ?? []).filter((id) => STONE.get(id)?.section === section);
    if (!ids.length) continue;
    const stones = ids.map((id) => {
      const p = placed.has(`${s.id}:${id}`) ? "placed" : s.progress?.[id];
      const state: StoneState = p === "placed" || p === "paper" ? p : rope ? "rope" : p === "wet" ? "wet" : "todo";
      return { id, char: STONE.get(id)?.char ?? "?", state };
    });
    rows.push({ student: s, stones, done: stones.every((x) => x.state === "placed" || x.state === "paper") });
  }
  // 아직 남은 학생을 위로, 그다음 번호순
  return rows.sort((a, b) => Number(a.done) - Number(b.done) || a.student.no - b.student.no);
}
