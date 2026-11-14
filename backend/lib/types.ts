// lib/types.ts — 징검다리 공용 타입 (docs/SPEC.md 7-3)
// 같이 쓰는 파일: 기존 이름은 지우거나 바꾸지 말고 추가만 한다.

export type Section = "상형" | "가획" | "병서";

export type Barrier =
  | "기기 없음"
  | "인터넷 없음"
  | "시간 부족"
  | "집에서 하기 어려워요"
  | "내용이 어려움";

export interface Student {
  id: string; // "s07"
  no: number; // 7
  name: string; // 교사 화면 전용 가짜 실명
  alias: string; // 학생·AI에 쓰는 가명 (예: "옛이응 ㆁ")
  team: 1 | 2 | 3 | 4 | 5; // 모둠 (화면에는 수업 시작 전까지 드러내지 않음)
  signals: {
    videoStarted: boolean;
    checkFirstTry: Record<string, boolean>; // 개념 ID → 영상 질문 첫 시도 정답
    explain1: string; // 말해보기 1차
    explainSubmitted: boolean;
    barriers: Barrier[];
  };
  label?: { misconceptions: string[] }; // AI 정확도 점검용 정답 라벨
  // 아래는 시연 데이터(data/class-2-3.json)용. 화면에서는 lib/rules/bridge.ts를 거쳐 읽는다
  type?: { participation: "있음" | "낮음"; readiness: "준비" | "보충"; environment: "양호" | "걸림돌" }; // 교사만
  path?: string[]; // 내 경로의 돌 ID (출발 돌 포함)
  start?: string[]; // 출발 돌 (처음부터 켜진 돌)
  progress?: Record<string, StoneProgress>; // 돌별 상태 (시연 시작 시점)
  arrived?: boolean; // 도착 관문 통과(깃발)
  exception?: string | null; // 교사 확인이 필요한 예외 사유 (교사만)
}

/** 돌 상태: 놓임 · 시도했지만 아직(젖은 돌) · 종이 돌로 놓음(교사 확인) */
export type StoneProgress = "placed" | "wet" | "paper";

export interface Analysis {
  studentId: string;
  conceptsHit: string[];
  misconceptions: string[];
  evidence: string;
  confidence: number;
  needsTeacher: boolean;
  source: "llm" | "keyword" | "saved";
}

export interface TypeResult {
  studentId: string;
  participation: "있음" | "낮음";
  readiness: "준비" | "보충";
  environment: "양호" | "걸림돌";
  reasons: string[]; // 교사에게 보여 줄 관찰 사건
}

export interface PathPlan {
  studentId: string;
  stones: { stoneId: string; start: boolean; why: string }[];
  approval: "rule" | "exception";
  approved: boolean;
}

export interface Question {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  explain: string;
}

export interface Stone {
  id: string; // 주소에 쓰므로 영문: "st-n", "st-d", "st-t", "st-kk"
  char: string; // "ㅌ"
  section: Section;
  kind: "lab" | "card" | "small";
  minutes: 1 | 2 | 4;
  concepts: string[];
  questions: Question[]; // 2개 + 변형 1개
}

export type DemoEvent =
  | { type: "stone_placed"; studentId: string; stoneId: string; at: string }
  | { type: "explain_passed"; studentId: string; at: string }
  | { type: "sos"; studentId: string; stoneId: string; at: string }
  // edited: 교사가 경로를 고친 건수, changes: 고친 경로(학생 글은 넣지 않음)
  | { type: "approved"; who: "teacher"; count: number; edited?: number; changes?: { studentId: string; path: string[] }[]; at: string }
  | { type: "checked_in"; studentId: string; method: "qr" | "barcode" | "face"; place: string; at: string }
  | { type: "class_started"; at: string }
  | { type: "together_done"; correctTeams: number; at: string }
  | { type: "opened"; at: string }
  // 학생 정보 잠금(SPEC 5-1 T7): 교사가 얼굴 1초·비밀번호로 열고, 무엇을 봤는지 기록한다(학생 글은 넣지 않음)
  | { type: "info_opened"; who: "teacher"; method: "face" | "password"; at: string }
  | { type: "info_viewed"; who: "teacher"; what: string; studentIds: string[]; at: string };

export interface DemoState {
  step: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  now: string;
  events: DemoEvent[];
}
