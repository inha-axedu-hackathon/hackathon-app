// lib/rules/typeRules.ts — 8유형을 나눌 때 지키는 기준 5가지 (예비교사 제안, docs/SPEC.md 8-1-2)
// 1. 관찰한 근거만 쓴다.  2. 이유를 확인하기 전에는 의욕 부족으로 판정하지 않는다.
// 3. 정답과 확신을 함께 보고 결손과 오개념을 구분한다.  4. 경계에 있는 학생은 단정하지 않는다.
// 5. 유형은 이번 사이클의 가설이며 낙인이 되지 않게 쓴다.
// 교사 화면 전용(교사 전용 명단과 함께 쓴다). 학생·교실 화면에서는 import하지 않는다.
import type { Analysis, Student } from "@backend/lib/types";

export const TYPE_PRINCIPLES = [
  "관찰한 근거만 써요",
  "이유를 확인하기 전에는 의욕 부족으로 판정하지 않아요",
  "정답과 확신을 함께 보고 결손과 오개념을 구분해요",
  "경계에 있는 학생은 단정하지 않아요",
  "유형은 이번 단원의 가설이에요 · 낙인이 되지 않게 써요",
] as const;

/** 선수 개념 상태: 준비 / 결손(아직 모름) / 오개념(틀린 생각을 확신) / 경계(단정하지 않음) */
export type Readiness = "준비" | "결손" | "오개념" | "경계";

export interface TypeHypothesis {
  studentId: string;
  /** 1. 관찰한 사건만 (성향·태도 단어 없음) */
  evidence: string[];
  /** 2. 참여 표기: '의욕'이라는 말을 쓰지 않고, 이유 확인 전이면 그렇게 적는다 */
  participation: "있음" | "낮음 · 이유 확인 전" | "낮아 보임 · 환경 먼저";
  /** 3·4. 결손과 오개념을 나누고, 경계는 단정하지 않는다 */
  readiness: Readiness;
  /** 4. 경계인 까닭 (교사가 직접 확인할 것) */
  borderline?: string;
  /** 5. 이번 단원 가설 */
  hypothesis: true;
}

// 경계 기준: AI가 답을 읽은 확신이 이보다 낮으면 단정하지 않는다
const SURE = 0.65;

export function typeHypothesis(s: Student, a: Analysis | undefined): TypeHypothesis {
  const sig = s.signals;
  const evidence: string[] = [];
  if (!sig.videoStarted) evidence.push("영상을 시작하지 않음");
  if (!sig.explainSubmitted) evidence.push("말해보기를 내지 않음");
  for (const b of sig.barriers) evidence.push(`학생이 고른 걸림돌: ${b}`);
  if (a?.misconceptions.length) evidence.push(`답에 오개념 ${a.misconceptions.join("·")}`);
  if (a?.conceptsHit.length) evidence.push(`답에 맞는 개념 ${a.conceptsHit.join("·")}`);

  const low = s.type?.participation === "낮음";
  const participation = !low ? "있음" : sig.barriers.length ? "낮아 보임 · 환경 먼저" : "낮음 · 이유 확인 전";

  // 정답(맞는 개념)과 확신(AI 판독 확신)을 함께 본다
  let readiness: Readiness;
  let borderline: string | undefined;
  const hit = a?.conceptsHit.length ?? 0;
  const mis = a?.misconceptions.length ?? 0;
  if (!a) {
    readiness = "경계";
    borderline = "분석된 답이 없어요";
  } else if (a.needsTeacher || a.confidence < SURE) {
    readiness = "경계";
    borderline = `AI가 답을 확실히 읽지 못했어요(확신 ${a.confidence.toFixed(2)})`;
  } else if (hit > 0 && mis > 0) {
    readiness = "경계";
    borderline = "맞는 개념과 오개념이 함께 있어요";
  } else if (mis > 0) {
    readiness = "오개념";
  } else if (hit > 0) {
    readiness = "준비";
  } else {
    readiness = "결손";
  }
  return { studentId: s.id, evidence, participation, readiness, borderline, hypothesis: true };
}

/** 반 단위 집계 (교사 화면 숫자) */
export function readinessCounts(list: TypeHypothesis[]): Record<Readiness, number> {
  const c: Record<Readiness, number> = { 준비: 0, 결손: 0, 오개념: 0, 경계: 0 };
  for (const h of list) c[h.readiness]++;
  return c;
}
