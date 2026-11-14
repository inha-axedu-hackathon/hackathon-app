"use client";
// 교실 화면 · 우리 반 다리 (담당: 신재우) — 지금은 뼈대. docs/SPEC.md 5-3 C1~C4를 보고 채운다.
import { StepBadge } from "@/components/StepBadge";
import { useDemo } from "@/lib/store";

export default function ClassPage() {
  const d = useDemo();
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-8">
      <h1 className="text-3xl font-bold">2학년 3반 징검런 · 국어의 문자 체계</h1>
      <StepBadge />
      <p className="text-2xl">
        {d.step < 3 && `수업까지 ${d.minutesToLesson}분`}
        {d.step === 3 && "수업 시작 · 병서 구간이 잠겼어요"}
        {d.step === 4 && "함께 놓기 · 다섯 모둠 중 넷 정답"}
        {d.step === 5 && "우리 반 다리가 수업에 닿았어요"}
        {d.step === 6 && "위에서 보면 · 세종이 만든 자음 설계도"}
      </p>
    </main>
  );
}
