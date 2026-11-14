"use client";
// components/student/labSignal.ts — 숨은 키 K(실험실 완성 처리)를 /demo의 어느 창에서 눌러도 학생 화면에 전달한다
// (시연 실패 대비. DemoKeys.tsx는 공용 파일이라 건드리지 않고, 화면별로 이 함수를 붙인다)
const CHANNEL = "jingum-lab";

export function postLabDone() {
  if (typeof BroadcastChannel === "undefined") return;
  const c = new BroadcastChannel(CHANNEL);
  c.postMessage("done");
  c.close();
}

export function onLabDone(fn: () => void) {
  if (typeof BroadcastChannel === "undefined") return () => {};
  const c = new BroadcastChannel(CHANNEL);
  c.onmessage = () => fn();
  return () => c.close();
}

/** 글 쓰는 중이 아닐 때 누른 K인지 */
export function isLabKey(e: KeyboardEvent) {
  const el = e.target as HTMLElement | null;
  if (e.isComposing || e.metaKey || e.ctrlKey || e.altKey) return false;
  if (el?.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el?.tagName ?? "")) return false;
  return e.code === "KeyK";
}
