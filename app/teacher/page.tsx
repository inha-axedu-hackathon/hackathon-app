"use client";
// 교사 · 수업 예보 (담당: 정환희) — 지금은 뼈대. docs/SPEC.md 5-1 T1~T3을 보고 채운다.
import { StepBadge } from "@/components/StepBadge";
import { useDemo } from "@/lib/store";

export default function TeacherPage() {
  const d = useDemo();
  const approved = d.events.some((e) => e.type === "approved");
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-8">
      <h1 className="text-2xl font-bold">오늘의 수업 예보 · 3교시 10:50</h1>
      <StepBadge />
      <p className="text-xl">{d.step >= 3 ? "병서 구간에 소나기 · 첫 8분은 함께 놓기" : "대체로 구름 조금"}</p>
      <p className="text-neutral-500">예외 3건 · {approved ? "승인됨" : "승인 전"}</p>
      <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
        AI가 제안한 내용이에요. 꼭 교사 본인이 직접 확인하시길 바랍니다.
      </p>
    </main>
  );
}
