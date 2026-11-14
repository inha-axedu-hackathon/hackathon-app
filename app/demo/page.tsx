"use client";
// 시연 컨트롤 (담당: 신재우) — 학생(아침 교실 태블릿)과 교실 프로젝터 화면을 나란히. 단축키는 components/DemoKeys.tsx
import { STEP_LABEL, useDemo } from "@/lib/store";

export default function DemoPage() {
  const d = useDemo();
  return (
    <main className="flex h-dvh flex-col gap-2 bg-paper-2 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <p className="text-sm font-semibold">
          징검다리 시연 · <span className="text-water">{STEP_LABEL[d.step]}</span>
          {d.offline && <span className="ml-2 rounded bg-seal-soft px-2 text-seal">오프라인</span>}
        </p>
        <p className="text-xs text-mute">N 다음 · T 수업 시작 · A 승인 · O 오프라인 · Shift+R 처음부터 · K 실험실 완성 · 1 학생 · 2 교실 · 3 교사</p>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,44fr)_minmax(0,56fr)] gap-3">
        <iframe src="/student" title="학생 화면 (아침 교실 태블릿)" className="h-full w-full rounded-2xl border border-line bg-paper" />
        <iframe src="/class" title="교실 화면" className="h-full w-full rounded-2xl border border-line bg-paper" />
      </div>
    </main>
  );
}
