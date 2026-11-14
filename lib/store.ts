"use client";
// lib/store.ts — 학생·교실·교사·/demo 화면이 함께 쓰는 시연 상태 하나 (DB 없음)
// 저장: localStorage("jingum:v3") · 동기화: BroadcastChannel("jingum-sync") · SSR 안전(useSyncExternalStore)
// 같이 쓰는 파일: 기존 이름은 지우거나 바꾸지 말고 추가만 한다.
import { useSyncExternalStore } from "react";
import type { DemoEvent, DemoState } from "./types";

export type Step = DemoState["step"];
type NoAt<T> = T extends unknown ? Omit<T, "at"> : never; // 유니온 하나하나에서 at만 뺀다
export type NewEvent = NoAt<DemoEvent>;
export type Demo = DemoState & { offline: boolean };

const KEY = "jingum:v3";
const CHANNEL = "jingum-sync";
const LESSON_AT = "2026-11-14T10:50:00+09:00"; // 3교시 시작
// 단계별 가상 시각. Date.now()는 쓰지 않는다(발표가 오후라 수업이 이미 지난 것처럼 보임)
const STEP_TIME = ["10:38", "10:40", "10:42", "10:50", "10:52", "10:57", "10:58"] as const;
const timeOf = (s: Step) => `2026-11-14T${STEP_TIME[s]}:00+09:00`;

export const STEP_LABEL = ["초기", "ㅌ 첨벙", "말해보기 통과", "수업 시작", "함께 놓기", "개통", "제자표"] as const;

// 단계에 들어설 때 남는 대표 이벤트 → 실제 조작이든 N 키든 화면 결과가 같다
const STEP_EVENT: readonly (NewEvent | null)[] = [
  null,
  { type: "stone_placed", studentId: "s07", stoneId: "st-t" },
  { type: "explain_passed", studentId: "s07" },
  { type: "class_started" },
  { type: "together_done", correctTeams: 4 },
  { type: "opened" },
  null,
];
export const INITIAL: Demo = { step: 0, now: timeOf(0), events: [], offline: false };

let state: Demo = INITIAL;
let loaded = false;
let channel: BroadcastChannel | null = null;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((fn) => fn());

function readSaved(): Demo {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...INITIAL, ...(JSON.parse(raw) as Partial<Demo>) } : INITIAL;
  } catch {
    return INITIAL; // 저장 공간을 못 쓰면 초기값
  }
}
function getChannel(): BroadcastChannel | null {
  if (channel || typeof BroadcastChannel === "undefined") return channel;
  channel = new BroadcastChannel(CHANNEL);
  channel.onmessage = (e: MessageEvent<Demo | "reload">) => {
    if (e.data === "reload") return location.reload();
    state = e.data; // 다른 탭이 보낸 최신 상태
    notify();
  };
  return channel;
}
function subscribe(fn: () => void) {
  listeners.add(fn);
  getChannel();
  return () => void listeners.delete(fn);
}
function getSnapshot(): Demo {
  if (!loaded) {
    loaded = true;
    state = readSaved(); // 브라우저에서 처음 한 번만 읽는다
  }
  return state;
}
const getServerSnapshot = () => INITIAL; // 서버 렌더와 하이드레이션은 항상 초기값

function commit(next: Demo) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* 저장 실패해도 화면은 진행 */
  }
  getChannel()?.postMessage(next); // 다른 탭·iframe으로 (보낸 탭 자신은 받지 않음)
  notify();
}
// 늘 저장본을 다시 읽고 고친다 → 두 탭이 서로의 변경을 덮어쓰지 않게
const update = (fn: (s: Demo) => Demo) => commit(fn(readSaved()));

function reach(s: Demo, target: Step): Demo {
  if (target <= s.step) return s; // 뒤로는 가지 않는다
  let events = s.events;
  for (let i = s.step + 1; i <= target; i++) {
    const e = STEP_EVENT[i];
    if (e && !events.some((x) => x.type === e.type)) events = [...events, { ...e, at: timeOf(i as Step) }];
  }
  return { ...s, step: target, now: timeOf(target), events };
}

export const demo = {
  next: () => update((s) => reach(s, Math.min(6, s.step + 1) as Step)),
  // 실제 성공 시: ㅌ 완성 → reach(1), 말해보기 통과 → reach(2), 함께 놓기 → reach(4)
  reach: (step: Step) => update((s) => reach(s, step)),
  // 단계와 무관한 일: sos, approved, checked_in
  add: (e: NewEvent) => update((s) => ({ ...s, events: [...s.events, { ...e, at: s.now }] })),
  toggleOffline: () => update((s) => ({ ...s, offline: !s.offline })),
  reset: () => {
    try {
      Object.keys(localStorage)
        .filter((k) => k === KEY || k.startsWith("hg-"))
        .forEach((k) => localStorage.removeItem(k));
    } catch {
      /* 무시 */
    }
    getChannel()?.postMessage("reload"); // 다른 탭과 실험실 iframe도 처음부터
    setTimeout(() => location.reload(), 50);
  },
};

export function useDemo() {
  const s = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const minutesToLesson = Math.round((Date.parse(LESSON_AT) - Date.parse(s.now)) / 60000);
  return { ...s, minutesToLesson, ...demo };
}
