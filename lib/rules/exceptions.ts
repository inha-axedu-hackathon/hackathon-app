// lib/rules/exceptions.ts — 규칙 밖 예외와 규칙 제안 (docs/SPEC.md 5-1 T3, 8-1)
// AI는 경로를 정하지 않는다: 규칙이 제안하고 교사가 정한다(SPEC 6-1, 인공지능기본법 고영향 AI의 사람 감독).
import { STONES } from "@/lib/content";
import type { Student } from "@/lib/types";

/** 유형별 돌 세트: 단원 시작 때 교사가 한 번 승인한 규칙 (SPEC 8-1) */
export const RULE_SETS = [
  { key: "있음/준비/양호", stones: "돌 1개 (심화)" },
  { key: "있음/보충/양호", stones: "돌 3개" },
  { key: "있음/준비/걸림돌", stones: "돌 1개" },
  { key: "있음/보충/걸림돌", stones: "돌 2~3개" },
  { key: "낮음/준비/양호", stones: "작은 돌 2개" },
  { key: "낮음/보충/양호", stones: "작은 돌 2개" },
  { key: "낮음/준비/걸림돌", stones: "작은 돌 1개" },
  { key: "낮음/보충/걸림돌", stones: "작은 돌 1개" },
] as const;

/**
 * 예비교사 8유형(팀 자료 student_types_3d_octant_regions.html). ID와 지원 문구는 원안 그대로 둔다.
 * 원안의 "의욕" 축은 관찰한 참여 신호(제출·시도·SOS)로 옮겨 표기한다. 의욕을 판정하지 않고(AI도 추측하지 않음),
 * 학생에게 보이지 않고, 다음 단원에 새로 계산한다. 환경이 걸림돌이면 "환경 먼저"(원안의 "낮아 보임" → 환경 해소 뒤 다시 판단).
 * 학생 카드에는 꼬리표(이름·ID) 대신 지원 문구만 붙이고, ID는 표에서만 쓴다.
 */
// 이름·지원 문구는 docs/SPEC.md 8-1-1(팀 확정 표기)과 같게 둔다. ID는 예비교사 3D 시안의 영역 번호
export const TYPE_DEFS: Record<string, { id: string; name: string; support: string }> = {
  "있음/준비/양호": { id: "C1", name: "참여 신호 있음 · 선수 개념 준비 · 환경 양호", support: "심화 돌, 또래 설명 역할(희망자)" },
  "있음/보충/양호": { id: "A1", name: "참여 신호 있음 · 선수 개념 보충 · 환경 양호", support: "선수 개념 돌 추가, 소그룹 지도" },
  "있음/준비/걸림돌": { id: "C2", name: "참여 신호 있음 · 선수 개념 준비 · 환경 걸림돌", support: "종이 돌·교내 시간대(아침 태블릿)로 기회 보장" },
  "있음/보충/걸림돌": { id: "A2", name: "참여 신호 있음 · 선수 개념 보충 · 환경 걸림돌", support: "환경 지원(기기 대여, 교내 학습 공간)을 먼저 하고 보충" },
  "낮음/준비/양호": { id: "E1", name: "참여 신호 낮음 · 선수 개념 준비 · 환경 양호", support: "선택권 주기, 도전 돌, 동기 탐색 대화(안부 묻기)" },
  "낮음/보충/양호": { id: "B1", name: "참여 신호 낮음 · 선수 개념 보충 · 환경 양호", support: "짧은 목표(작은 돌), 흥미 연결, 1:1 대화" },
  "낮음/준비/걸림돌": { id: "E2", name: "참여 신호 낮아 보임 · 선수 개념 준비 · 환경 걸림돌", support: "환경을 먼저 해소한 뒤 참여를 다시 판단, 그다음 도전 돌" },
  "낮음/보충/걸림돌": { id: "B2", name: "참여 신호 낮아 보임 · 선수 개념 보충 · 환경 걸림돌", support: "환경 때문일 수 있음. 환경을 해소한 뒤 참여 문제인지 다시 판단" },
};
export const typeKey = (t: NonNullable<Student["type"]>) => `${t.participation}/${t.readiness}/${t.environment}`;
export const typeOf = (s: Student) => (s.type ? TYPE_DEFS[typeKey(s.type)] : undefined);

/**
 * 예외 사유별 규칙 제안 (교사가 바꿀 수 있다). why = 근거 한 줄, plan = 오늘 할 일.
 * 근거에는 "누가 안 했는지"가 아니라 "어느 개념(돌)이 끊겼는지"를 넣는다 — 슈퍼스쿨은 누가 냈는지, 징검다리는 무엇을 모르는지.
 */
export function proposalFor(s: Student): { why: string; plan: string[] } {
  const ex = s.exception ?? "";
  const barrier = s.signals.barriers[0];
  const chose = barrier ? ` · 학생이 고른 걸림돌 "${barrier}"` : "";
  const stoneName = (id?: string) => {
    const st = STONES.find((x) => x.id === id);
    return st ? `「${st.char}」(${st.section})` : "";
  };
  const stuckId = Object.entries(s.progress ?? {}).find(([, v]) => v === "wet")?.[0] ?? s.path?.[0];
  const stuck = stoneName(stuckId);
  const atStart = STONES.find((x) => x.id === stuckId)?.section === "병서" ? " · 오늘 수업 시작점(병서)과 같은 자리" : "";
  if (ex.includes("기기")) {
    return {
      why: `${stoneName(s.path?.[0])} 돌을 종이 징검돌로 놓았어요${chose}`,
      plan: ["종이 돌을 확인하면 다리에 놓인 것으로 쳐요", "아침 교실 태블릿(07:50~08:40)을 안내해요"],
    };
  }
  if (ex.includes("영상")) {
    return {
      why: `사전학습 영상을 2번 시작하지 않아 ${stuck} 돌이 비어 있어요${chose}`,
      plan: ["아침 교실 태블릿을 안내해요", `수업 전에 먼저 말 걸기${atStart}`],
    };
  }
  if (ex.includes("SOS")) {
    return {
      why: `${stuck} 돌에서 2번 막혀 구조 신호를 보냈어요${chose}`,
      plan: [`${stuck} 돌에 구조 카드를 붙여요${atStart}`, "필요하면 그 돌을 수업 뒤로 미뤄요"],
    };
  }
  return { why: ex, plan: ["선생님이 정해요"] };
}

/** 같은 모둠 줄(소리 갈래)에서 경로에 더할 수 있는 다음 돌 */
export function nextStone(s: Student, path: string[]) {
  return STONES.find((st) => st.team === s.team && !path.includes(st.id));
}

export const charOf = (id: string) => STONES.find((s) => s.id === id)?.char ?? id;
