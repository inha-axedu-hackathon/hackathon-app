"use client";
// 시연 컨트롤 (담당: 신재우) — 학생과 교실 화면을 나란히. 단축키는 components/DemoKeys.tsx
import { StepBadge } from "@/components/StepBadge";

export default function DemoPage() {
  return (
    <main className="flex h-screen flex-col gap-2 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <StepBadge />
        <p className="text-xs text-neutral-500">
          N 다음 · T 수업 시작 · A 승인 · O 오프라인 · Shift+R 처음부터 · 1 학생 · 2 교실 · 3 교사
        </p>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-[390px_1fr] gap-3">
        <iframe src="/student" title="학생 화면" className="h-full w-full rounded-lg border border-neutral-200" />
        <iframe src="/class" title="교실 화면" className="h-full w-full rounded-lg border border-neutral-200" />
      </div>
    </main>
  );
}
