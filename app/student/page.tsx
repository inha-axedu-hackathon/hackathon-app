"use client";
// 학생 · 징검런 홈 (담당: 신재우) — 지금은 뼈대. docs/SPEC.md 5-2 S1~S3를 보고 채운다.
import { StepBadge } from "@/components/StepBadge";
import { useDemo } from "@/lib/store";

export default function StudentPage() {
  const d = useDemo();
  const placed = d.step >= 1;
  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 px-4 py-8">
      <h1 className="text-2xl font-bold">오늘의 징검런</h1>
      <StepBadge />
      <p className="text-4xl font-bold">{placed ? "도착 관문이 열렸어요" : "1칸 남음 · 4분이면 완주 🏁"}</p>
      <p className="text-neutral-500">돌 3개 중 {placed ? 3 : 2}개 · 성적·학생부에 들어가지 않아요</p>
    </main>
  );
}
