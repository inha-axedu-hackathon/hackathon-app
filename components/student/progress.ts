// components/student/progress.ts — 시연 학생 한 명의 내 경로 상태 (본인 것만 계산한다)
import { ME } from "@/lib/student/me";
import type { DemoEvent, StoneProgress } from "@/lib/types";
import { stoneCard } from "./stones";

export type MyStone = {
  id: string;
  char: string;
  title: string;
  minutes: number;
  state: StoneProgress | "todo";
  start: boolean; // 출발 돌 (처음부터 켜짐)
};

export function myProgress(studentId: string, events: readonly DemoEvent[]) {
  // 학생 화면은 반 전체 명단을 불러오지 않는다(handoff-screens 원칙 8): 나(ME)만 본다
  const me = studentId === ME.id ? ME : undefined;
  const placedNow = new Set(
    events.filter((e) => e.type === "stone_placed" && e.studentId === studentId).map((e) => (e.type === "stone_placed" ? e.stoneId : "")),
  );
  const stones: MyStone[] = (me?.path ?? []).map((id) => {
    const card = stoneCard(id);
    const saved = me?.progress?.[id];
    return {
      id,
      char: card?.char ?? "?",
      title: card ? `${card.char} ${card.section}` : id,
      minutes: card?.minutes ?? 2,
      state: placedNow.has(id) ? "placed" : (saved ?? "todo"),
      start: (me?.start as readonly string[] | undefined)?.includes(id) ?? false,
    };
  });
  const placed = stones.filter((s) => s.state === "placed" || s.state === "paper").length;
  const remaining = stones.filter((s) => s.state !== "placed" && s.state !== "paper");
  const arrived = Boolean(me?.arrived) || events.some((e) => e.type === "explain_passed" && e.studentId === studentId);
  return {
    alias: me?.alias ?? "학생",
    stones,
    placed,
    total: stones.length,
    next: remaining[0],
    minutesLeft: remaining.reduce((n, s) => n + s.minutes, 0),
    allPlaced: remaining.length === 0,
    arrived,
  };
}
