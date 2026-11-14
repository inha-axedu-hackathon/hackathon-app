"use client";
// components/StepBadge.tsx — 지금 시연 단계와 가상 시각을 보여 주는 임시 표시 (화면을 만들면서 지워도 됨)
import { STEP_LABEL, useDemo } from "@/lib/store";

export function StepBadge() {
  const d = useDemo();
  return (
    <p className="text-sm text-neutral-500">
      단계 {d.step} · {STEP_LABEL[d.step]} · 가상 시각 {d.now.slice(11, 16)} · 마감까지 {d.minutesToDeadline}분 · 수업까지 {d.minutesToLesson}분
      {d.offline ? " · 오프라인" : ""} · 이벤트 {d.events.length}개
    </p>
  );
}
