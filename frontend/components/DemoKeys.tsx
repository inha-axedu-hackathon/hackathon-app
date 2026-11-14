"use client";
// components/DemoKeys.tsx — app/layout.tsx의 <body> 안에 한 번. 모든 화면에서 같은 시연 단축키
// N 다음 단계 · T 수업 시작 · A 교사 승인 · O 오프라인 전환 · Shift+R 처음부터 · 1/2/3 학생/교실/교사 화면
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { demo } from "@/lib/store";

const SCREENS: Record<string, string> = { Digit1: "/student", Digit2: "/class", Digit3: "/teacher" };

export function handleDemoKey(e: KeyboardEvent, go: (path: string) => void) {
  const el = e.target as HTMLElement | null;
  if (e.isComposing || e.metaKey || e.ctrlKey || e.altKey) return; // 한글 조합 중·브라우저 단축키는 무시
  if (el?.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el?.tagName ?? "")) return; // 글 쓰는 중
  const k = e.code; // e.key는 한글 자판일 때 'ㅜ'가 된다 → 자판과 무관한 e.code를 쓴다
  if (k === "KeyN") demo.next();
  else if (k === "KeyT") demo.reach(3); // 수업 시작
  else if (k === "KeyA") demo.add({ type: "approved", who: "teacher", count: 3 });
  else if (k === "KeyO") demo.toggleOffline();
  else if (k === "KeyR" && e.shiftKey) demo.reset(); // 실수로 지우지 않게 Shift+R
  else if (SCREENS[k] && window.self === window.top) go(SCREENS[k]); // 분할 화면의 iframe 안에서는 화면 전환 안 함
}

export function DemoKeys() {
  const router = useRouter();
  useEffect(() => {
    const on = (e: KeyboardEvent) => handleDemoKey(e, (p) => router.push(p));
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [router]);
  return null;
}
