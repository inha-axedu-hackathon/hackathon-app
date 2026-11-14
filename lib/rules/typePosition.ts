// lib/rules/typePosition.ts — 8유형 공간 안에서 학생 한 명의 자리 (교사 화면 전용, docs/SPEC.md 8-1-1·8-1-2)
// 유형은 둘로 딱 나뉘지 않는다. 칸(있음/낮음 · 준비/보충 · 양호/걸림돌)은 규칙이 정한 유형을 따르고,
// 칸 안에서 가운데 면으로부터의 거리는 "관찰한 근거가 그 칸을 얼마나 뒷받침하나"(0~1)를 뜻한다.
//   가운데 면에 가까움 = 경계 · 단정 안 함 (기준 4),  바깥쪽 = 근거가 뚜렷함.
// 쓰는 근거는 관찰한 사건뿐이다(기준 1): 영상 시작, 말해보기 제출·길이, 놓은 돌, AI가 읽은 개념·오개념·확신, 학생이 고른 걸림돌.
// 학생·교실 화면에서는 import하지 않는다(교사 전용 명단과 함께 쓴다).
import type { Analysis, Barrier, Student } from "@/lib/types";

export type AxisName = "참여" | "선수 개념" | "환경";

export interface AxisReading {
  axis: AxisName;
  /** 칸 이름 (있음/낮음 · 준비/보충 · 양호/걸림돌, 걸림돌이 있는 낮음은 "낮아 보임") */
  side: string;
  /** 0~1 스펙트럼 값. 1 = 있음·준비·양호 끝, 0 = 낮음·보충·걸림돌 끝, 0.5 = 가운데(경계) */
  value: number;
  /** 가운데에서 떨어진 정도 0~1 */
  strength: number;
  word: "뚜렷해요" | "중간이에요" | "경계 가까움 · 단정 안 함";
  /** 그 자리에 놓은 관찰 근거 */
  why: string[];
  /** 왼쪽(0)·오른쪽(1) 끝 이름 */
  ends: [string, string];
}

export interface TypePosition {
  studentId: string;
  /** 3D 좌표 -1~1 (x 참여, y 선수 개념, z 환경) */
  x: number;
  y: number;
  z: number;
  axes: [AxisReading, AxisReading, AxisReading];
}

const BARRIER_WEIGHT: Record<Barrier, number> = {
  "기기 없음": 0.9,
  "인터넷 없음": 0.9,
  "집에서 하기 어려워요": 0.75,
  "시간 부족": 0.5,
  "내용이 어려움": 0.2, // 환경보다는 내용 문제에 가깝다
};
const SURE = 0.65; // typeRules.ts와 같은 경계 기준

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
// 같은 근거를 가진 학생 점이 한 점에 겹치지 않게 아주 조금 흩는다(학생 ID로 고정)
function jitter(id: string, salt: number) {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  return (((h >>> 0) % 1000) / 1000 - 0.5) * 0.08;
}
function word(m: number): AxisReading["word"] {
  return m >= 0.6 ? "뚜렷해요" : m >= 0.3 ? "중간이에요" : "경계 가까움 · 단정 안 함";
}
/** agree(0~1, 근거가 칸을 뒷받침하는 정도) → 가운데에서의 거리 */
const reach = (agree: number) => 0.06 + 0.88 * clamp(agree, 0, 1);

export function typePosition(s: Student, a: Analysis | undefined): TypePosition {
  const t = s.type ?? { participation: "있음", readiness: "준비", environment: "양호" };
  const sig = s.signals;

  // 1) 참여: 영상 시작 · 말해보기 제출 · 글 길이 · 놓은 돌 비율
  const path = s.path ?? [];
  const done = path.filter((id) => s.progress?.[id] === "placed" || s.progress?.[id] === "paper").length;
  const len = sig.explain1.trim().length;
  const raw = (sig.videoStarted ? 0.3 : 0) + (sig.explainSubmitted ? 0.2 : 0) + 0.25 * Math.min(len / 35, 1) + 0.25 * (path.length ? done / path.length : 0);
  const pSide = t.participation === "있음" ? 1 : -1;
  let pm = reach(pSide > 0 ? raw : 1 - raw);
  const deferred = pSide < 0 && sig.barriers.length > 0;
  if (deferred) pm = Math.min(pm, 0.45); // 기준 2: 걸림돌이 있으면 참여 판단을 미룬다 → 가운데 쪽
  const pWhy = [
    sig.videoStarted ? "영상을 시작했어요" : "영상을 시작하지 않았어요",
    sig.explainSubmitted ? `말해보기를 냈어요(${len}자)` : "말해보기를 내지 않았어요",
    path.length ? `내 경로 돌 ${done}/${path.length}개 놓음(시연 시작 시점)` : "경로 돌 없음",
  ];
  if (deferred) pWhy.push("걸림돌을 골라서 참여 판단은 미뤄요");

  // 2) 선수 개념: AI가 읽은 맞는 개념·오개념과 확신
  const hit = a?.conceptsHit.length ?? 0;
  const mis = a?.misconceptions.length ?? 0;
  const conf = a?.confidence ?? 0;
  let r = 0.5;
  if (a) {
    if (hit > 0 && mis === 0) r = 0.55 + 0.4 * conf;
    else if (mis > 0 && hit === 0) r = 0.45 - 0.4 * conf;
    else if (hit > 0 && mis > 0) r = 0.5 + 0.06 * (hit - mis);
    else r = 0.3; // 맞는 개념도 오개념도 없음 = 결손(아직 모름)
  }
  const rSide = t.readiness === "준비" ? 1 : -1;
  let rm = a ? reach(rSide > 0 ? r : 1 - r) : 0.06;
  const unsure = !a || a.needsTeacher || conf < SURE || (hit > 0 && mis > 0);
  if (unsure) rm = Math.min(rm, 0.28); // 기준 4: 경계는 단정하지 않는다
  const rWhy = !a
    ? ["분석된 답이 없어요"]
    : [
        hit ? `답에 맞는 개념 ${a.conceptsHit.join("·")}` : "답에 맞는 개념이 아직 없어요",
        mis ? `답에 오개념 ${a.misconceptions.join("·")}` : "오개념은 보이지 않아요",
        `AI가 답을 읽은 확신 ${conf.toFixed(2)}${conf < SURE ? " (0.65 미만 · 경계)" : ""}`,
      ];
  if (a && hit > 0 && mis > 0) rWhy.push("맞는 개념과 오개념이 함께 있어 경계로 둬요");

  // 3) 환경: 학생이 고른 걸림돌 (서비스 신호는 쓰지 않는다)
  const b = sig.barriers.reduce((m, x) => Math.max(m, BARRIER_WEIGHT[x] ?? 0.5), 0);
  const eSide = t.environment === "양호" ? 1 : -1;
  const em = reach(eSide > 0 ? (b === 0 ? 0.8 : 1 - b) : b);
  const eWhy = sig.barriers.length ? sig.barriers.map((x) => `학생이 고른 걸림돌: ${x}`) : ["학생이 고른 걸림돌이 없어요"];

  const pmj = clamp(pm + jitter(s.id, 1), 0.04, 0.96);
  const rmj = clamp(rm + jitter(s.id, 2), 0.04, 0.96);
  const emj = clamp(em + jitter(s.id, 3), 0.04, 0.96);
  const val = (side: number, m: number) => 0.5 + (side * m) / 2;

  return {
    studentId: s.id,
    x: pSide * pmj,
    y: rSide * rmj,
    z: eSide * emj,
    axes: [
      { axis: "참여", side: deferred ? "낮아 보임" : t.participation, value: val(pSide, pmj), strength: pmj, word: word(pmj), why: pWhy, ends: ["낮음", "있음"] },
      { axis: "선수 개념", side: t.readiness, value: val(rSide, rmj), strength: rmj, word: word(rmj), why: rWhy, ends: ["보충", "준비"] },
      { axis: "환경", side: t.environment, value: val(eSide, emj), strength: emj, word: word(emj), why: eWhy, ends: ["걸림돌", "양호"] },
    ],
  };
}
