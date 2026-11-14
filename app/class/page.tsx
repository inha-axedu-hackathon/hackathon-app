"use client";
// 교실 화면 · 우리 반 다리 (담당: 신재우) — docs/SPEC.md 5-0, 5-3 C1~C4, 7-5
// 디자인: 캔버스 "징검다리 · 디자인"의 Stage(1440×810). 화면 크기에 맞춰 통째로 확대·축소한다.
// 반·모둠·친구의 숫자는 쓰지 않고 날씨로만 말한다. 숫자는 교사 화면에만.
import { useEffect, useMemo, useState } from "react";
import { StageView } from "@/components/class/StageView";
import { sceneOf, stageVals } from "@/components/class/stageModel";
import { FitStage } from "@/components/FitStage";
import { isLabKey, postLabDone } from "@/components/student/labSignal";
import { bridgeState } from "@/lib/rules/bridge";
import { useDemo } from "@/lib/store";

export default function ClassPage() {
  const d = useDemo();
  const bridge = useMemo(() => bridgeState(d.events), [d.events]);

  // 3단계(수업 시작): 물때를 3.5초 보여 준 뒤 함께 놓기 문항으로
  const [togetherReady, setTogetherReady] = useState(false);
  const [pick, setPick] = useState<"O" | "X" | null>(null);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    if (d.step !== 3) return;
    const t = setTimeout(() => setTogetherReady(true), 3500);
    return () => clearTimeout(t);
  }, [d.step]);
  const scene = sceneOf(d.step, d.step === 3 && togetherReady);

  // 숨은 키 K: 교실 창에 포커스가 있어도 학생 화면의 실험실 완성 처리로 전달
  useEffect(() => {
    const on = (e: KeyboardEvent) => isLabKey(e) && postLabDone();
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, []);

  const v = stageVals({
    bridge,
    scene,
    step: d.step,
    minutesToLesson: d.minutesToLesson,
    pick,
    revealed,
    onPick: setPick,
    onReveal: () => setRevealed(true),
    onRope: () => d.reach(4),
  });

  // 화면 비율이 16:9가 아닐 때 남는 여백을 장면 색으로 채워 '틀'이 보이지 않게
  const SKY = { 맑음: "#AFDAEC", 구름: "#C3CCD1", 먹구름: "#3A4752", 소나기: "#2F3F4A" } as const;
  const dark = scene === "together" || scene === "jejapyo";
  const left = SKY[bridge.sections[0].weather];
  const right = SKY[bridge.sections[2].weather];
  const backdrop = dark
    ? "#12171A"
    : `linear-gradient(180deg, transparent 0 58%, #22AE91 58%, #0A6659 100%), linear-gradient(90deg, ${left} 0 50%, ${right} 50% 100%)`;

  return (
    <main className="h-dvh w-full" style={{ background: backdrop, overflow: "clip", transition: "background 900ms" }}>
      <FitStage width={1440} height={810} maxCrop={0.05}>
        <StageView {...v} />
      </FitStage>
    </main>
  );
}
