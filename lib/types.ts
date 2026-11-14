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
}

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
  | { type: "approved"; who: "teacher"; count: number; at: string }
  | { type: "checked_in"; studentId: string; method: "qr" | "barcode" | "face"; place: string; at: string }
  | { type: "class_started"; at: string }
  | { type: "together_done"; correctTeams: number; at: string }
  | { type: "opened"; at: string };

export interface DemoState {
  step: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  now: string;
  events: DemoEvent[];
}
