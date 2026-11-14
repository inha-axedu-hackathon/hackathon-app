// components/student/stones.ts — data/stones.json(돌 카드·문항·함께 놓기·도착 관문)을 화면에서 쓰기 좋게 꺼낸다 (담당: 신재우)
import raw from "@backend/data/stones.json";
import type { Question, Section } from "@backend/lib/types";

export interface StoneCard {
  id: string;
  char: string;
  section: Section;
  kind: "lab" | "card" | "small";
  minutes: 1 | 2 | 4;
  concepts: string[];
  card: string;
  lab?: { target: string; seed?: string };
  questions: Question[]; // [0], [1] = 굳히기 2문항, [2] = 틀렸을 때 변형 문항
}

export interface TogetherQuiz {
  prompt: string;
  answer: "O" | "X";
  explain: string;
}

export interface ExplainGate {
  stoneId: string;
  question: string;
  frame: [string, string, string];
  prepared: string;
  haerye: { han: string; ko: string }[];
  source: string;
}

export const STONE_CARDS = raw.stones as StoneCard[];
export const TOGETHER = raw.together as Record<Section, TogetherQuiz>;
export const EXPLAIN = raw.explain as ExplainGate;

export const stoneCard = (id: string) => STONE_CARDS.find((s) => s.id === id);

/** 시연 학생 (docs/SPEC.md 3장 페르소나) */
export const DEMO_STUDENT = "s07";
