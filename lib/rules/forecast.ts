// lib/rules/forecast.ts — 교사 수업 예보 계산 (docs/SPEC.md 5-1 T1·T2·T4)
// 숫자는 교사 화면에서만 쓴다(SPEC 5-0). 여기서는 판단하지 않고 모으기만 한다(판단은 규칙과 교사, AI는 읽기만).
import { MISCONCEPTIONS, keywordMisconceptions } from "@/lib/content";
import type { Analysis, DemoEvent, Section, Student } from "@/lib/types";
import { STUDENTS, type BridgeState } from "./bridge";

export type Agreement = { matched: number; total: number; missed: number; wrong: number };
/** AI 분석 한 번의 결과 (저장본 data/analysis.saved.json 또는 방금 실행) */
export type AnalysisRun = {
  results: Analysis[];
  agreement?: Agreement; // AI vs 예비교사 라벨
  keywordAgreement?: Agreement; // 키워드만 vs 예비교사 라벨 (비교 기준선)
  createdAt: string;
  model?: string;
  llmCount?: number; // AI가 실제로 읽은 학생 수(나머지는 키워드 대체)
  live?: boolean; // 방금 교사가 [AI 분석]으로 실행
  seconds?: number;
  tokens?: { used: number; calls: number };
};

const BY_ID = new Map(STUDENTS.map((s) => [s.id, s]));
export const studentOf = (id: string) => BY_ID.get(id);

/** 오개념이 걸리는 다리 구간 (그 구간 돌을 굳힐 때 막힌다) */
export const MISCONCEPTION_SECTION: Record<string, Section> = {
  M1: "병서",
  M2: "가획",
  M3: "병서",
  M4: "상형",
  M5: "가획",
  M6: "상형",
  M7: "상형",
};

/** 교사 화면용 짧은 이름 (긴 설명은 lib/content.ts) */
export const MISCONCEPTION_SHORT: Record<string, string> = {
  M1: "ㄲ도 획을 더한 글자다",
  M2: "센 소리 = 큰 소리",
  M3: "ㅋ과 ㄲ은 같은 원리다",
  M4: "ㄷ도 기본자다",
  M5: "ㅏ→ㅑ도 가획이다",
  M6: "자음도 자연물을 본떴다",
  M7: "ㅇ은 소리가 없어 기본자가 아니다",
};
const LONG = new Map<string, string>(MISCONCEPTIONS.map((m) => [m.id, m.text]));

export type Blocked = {
  id: string;
  short: string;
  text: string;
  section: Section;
  count: number; // 교사가 뺀 판단을 제외한 인원
  students: { student: Student; evidence: string; text: string; dismissed: boolean }[];
};

/** 막힌 지점: 오개념별 인원. 많은 순, 같으면 오개념 번호 순. dismissed = 교사가 뺀 판단("M1:s02") */
export function blockedPoints(results: Analysis[], dismissed: ReadonlySet<string> = new Set()): Blocked[] {
  const map = new Map<string, Blocked>();
  for (const r of results) {
    const student = studentOf(r.studentId);
    if (!student) continue;
    for (const id of r.misconceptions) {
      if (!map.has(id)) {
        map.set(id, { id, short: MISCONCEPTION_SHORT[id] ?? id, text: LONG.get(id) ?? "", section: MISCONCEPTION_SECTION[id] ?? "가획", count: 0, students: [] });
      }
      const m = map.get(id)!;
      const off = dismissed.has(`${id}:${student.id}`);
      m.students.push({ student, evidence: r.evidence, text: student.signals.explain1, dismissed: off });
      if (!off) m.count++;
    }
  }
  return [...map.values()].filter((m) => m.count > 0 || m.students.length > 0).sort((a, b) => b.count - a.count || a.id.localeCompare(b.id));
}

export type AiWin = { student: Student; text: string; evidence: string; ai: string[]; keyword: string[] };

const sameSet = (a: string[], b: string[]) => a.length === b.length && a.every((x) => b.includes(x));

/** 키워드만으로는 틀렸는데 AI가 예비교사 라벨대로 바로잡은 답 전부. 오개념이 있는 답을 앞에 둔다(예시용) */
export function aiWins(results: Analysis[]): AiWin[] {
  const out: AiWin[] = [];
  for (const r of results) {
    const student = studentOf(r.studentId);
    const label = student?.label?.misconceptions;
    if (!student || !label || r.source !== "llm") continue;
    const text = student.signals.explain1;
    const keyword = keywordMisconceptions(text);
    if (sameSet(r.misconceptions, label) && !sameSet(keyword, label)) {
      out.push({ student, text, evidence: r.evidence, ai: r.misconceptions, keyword });
    }
  }
  return out.sort((a, b) => Number(b.ai.length > 0) - Number(a.ai.length > 0));
}

/** AI가 교사 확인을 요청한 답 (확신 낮음, 근거 없음, 위기 낱말) */
export function needsTeacher(results: Analysis[]) {
  return results
    .filter((r) => r.needsTeacher)
    .map((r) => ({ student: studentOf(r.studentId), result: r }))
    .filter((x): x is { student: Student; result: Analysis } => Boolean(x.student));
}

/** 8유형 = 참여(있음·낮음) × 능력(준비·보충) × 환경(양호·걸림돌). 교사만 본다 */
export const TYPE_ROWS = ["있음", "낮음"] as const;
export const TYPE_COLS = [
  ["준비", "양호"],
  ["보충", "양호"],
  ["준비", "걸림돌"],
  ["보충", "걸림돌"],
] as const;
export function typeCounts(): Map<string, number> {
  const m = new Map<string, number>();
  for (const s of STUDENTS) {
    if (!s.type) continue;
    const k = `${s.type.participation}/${s.type.readiness}/${s.type.environment}`;
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return m;
}

/** 규칙 밖 예외: 아침에 교사가 결재한다 */
export function exceptions() {
  return STUDENTS.filter((s) => s.exception).map((s) => ({ student: s, reason: s.exception as string }));
}

export type CheckIn = Extract<DemoEvent, { type: "checked_in" }>;
export const METHOD_LABEL: Record<CheckIn["method"], string> = { qr: "QR", barcode: "바코드", face: "얼굴" };

/** 수업 예보 한 줄. 단계(수업 전 → 수업 시작 → 함께 놓기 → 개통)에 따라 바뀐다 */
export function headline(b: BridgeState, top: Blocked | undefined, correctTeams: number | undefined) {
  const weak = b.sections.filter((s) => s.placed / Math.max(s.total, 1) < 0.8);
  const names = (list: { name: string }[]) => list.map((s) => s.name).join("·");
  if (b.opened) {
    return {
      tone: "clear" as const,
      title: "다리 개통 · 본시 수업 시작",
      sub: top ? `가장 많이 막힌 "${top.short}"를 짚고 시작해요` : "모두 같은 수업에 도착했어요",
    };
  }
  if (b.together) {
    const rope = b.sections.filter((s) => s.rope > 0);
    return {
      tone: "cloud" as const,
      // 정답 모둠 수는 교사 화면에만 (SPEC 5-3 C3)
      title: `함께 놓기 끝 · 5모둠 중 ${correctTeams ?? "-"}모둠 정답`,
      sub: rope.length ? `${names(rope)} 밧줄 돌 ${rope.reduce((n, s) => n + s.rope, 0)}칸은 수업 뒤 주인이 굳혀요` : "잠긴 구간이 모두 이어졌어요",
    };
  }
  // AI가 찾은 막힌 곳 1위가 끊긴 구간과 같으면 "그래서 수업은 여기서 시작"으로 잇는다(각인 문장)
  const linked = (list: { name: string }[]) => (top && list.some((s) => s.name === top.section) ? top : undefined);
  if (b.lessonStarted) {
    const locked = b.sections.filter((s) => s.locked);
    const t = linked(locked);
    return locked.length
      ? {
          tone: "locked" as const,
          title: `${names(locked)} 소나기 · 첫 8분은 함께 놓기`,
          sub: t ? `함께 놓기 O/X: "${t.short}" — AI가 말해보기에서 찾은 ${t.count}명의 오개념` : "잠긴 구간을 반 전체가 O/X로 함께 놓아요",
        }
      : { tone: "clear" as const, title: "잠긴 구간 없음 · 바로 본시 수업", sub: "함께 놓기는 건너뛰어요" };
  }
  if (weak.length) {
    const left = weak.reduce((n, s) => n + s.total - s.placed, 0);
    const t = linked(weak);
    return {
      tone: "storm" as const,
      title: `${names(weak)}에 먹구름 · ${left}칸 남음`,
      sub: t
        ? `AI가 말해보기를 읽어 보니 "${t.short}" ${t.count}명 · 오늘 수업은 ${t.section}에서 시작해요`
        : `이대로 수업이 시작되면 첫 8분은 ${names(weak)} 함께 놓기예요`,
    };
  }
  return { tone: "clear" as const, title: "대체로 맑음", sub: "함께 놓기 없이 바로 본시 수업을 시작해요" };
}

/** ISO 시각 → 한국 시간 "HH:MM" */
export function hhmm(iso: string) {
  return new Date(iso).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Seoul" });
}
