"use client";
// components/class/ClassStage.tsx — 교실 화면(우리 반 다리)을 한 화면에 한 구간(날씨 하나)씩 넘겨 보는 틀 (담당: 신재우, 11/14 피드백 반영)
// 0 상형(출발 둑 → 가획 앞) → 1 가획(→ 병서 앞) → 2 병서(→ 도착 관문). 넘기기: 좌우로 밀기 · ←/→ 키 · 양옆 화살표 · 아래 점.
// 시연 단계가 바뀌면 저절로 넘긴다(autoPage): ㅌ 첨벙은 가획, 수업 시작(물때·함께 놓기)부터는 잠긴 구간(병서).
// viewer="student"는 학생이 보는 교실 화면: 보기만(정답 공개·밧줄 버튼 없음, 시연 숨은 키 K 전달 안 함). 숫자는 어디에도 없다.
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { StageView } from "@/components/class/StageView";
import { WeatherIcon } from "@/components/class/WeatherIcon";
import { autoPage, PAGE_NAMES, sceneOf, stageVals } from "@/components/class/stageModel";
import { FitStage } from "@/components/FitStage";
import { isLabKey, postLabDone } from "@/components/student/labSignal";
import { bridgeState } from "@/lib/rules/bridge";
import { useDemo } from "@/lib/store";

export function ClassStage({ viewer = "class" }: { viewer?: "class" | "student" }) {
  const d = useDemo();
  const bridge = useMemo(() => bridgeState(d.events), [d.events]);
  const student = viewer === "student";

  // 3단계(수업 시작): 물때를 3.5초 보여 준 뒤 함께 놓기 문항으로
  const [togetherReady, setTogetherReady] = useState(false);
  const [pick, setPick] = useState<"O" | "X" | null>(null);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    if (d.step !== 3) return;
    const t = setTimeout(() => setTogetherReady(true), 3500);
    return () => clearTimeout(t);
  }, [d.step]);

  // 지금 보이는 구간. 시연 단계가 바뀔 때만 저절로 넘기고, 그 사이에는 손으로 넘긴 쪽을 그대로 둔다
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [seenStep, setSeenStep] = useState<number | null>(null);
  if (seenStep !== d.step) {
    setSeenStep(d.step);
    const to = autoPage(d.step, bridge);
    if (to !== null && to !== page) {
      setDir(to > page ? 1 : -1);
      setPage(to);
    }
    if (d.step < 3) {
      // 처음부터 다시(Shift+R) 하면 함께 놓기도 처음 상태로
      setTogetherReady(false);
      setPick(null);
      setRevealed(false);
    }
  }
  const go = (to: number) => {
    const n = Math.min(PAGE_NAMES.length - 1, Math.max(0, to));
    if (n === page) return;
    setDir(n > page ? 1 : -1);
    setPage(n);
  };
  const goRef = useRef(go);
  const pageRef = useRef(page);
  useEffect(() => {
    goRef.current = go;
    pageRef.current = page;
  });

  const scene = sceneOf(d.step, d.step === 3 && togetherReady);
  const paging = scene !== "together" && scene !== "jejapyo"; // 함께 놓기·제자표는 화면 전체를 쓰는 장면

  // ←/→ 키로 넘기기(시연 단축키 N·T·A·O·1/2/3·Shift+R·K와 겹치지 않음). 교실 창에서 누른 K는 학생 화면 실험실 완성으로 전달
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (e.isComposing || e.metaKey || e.ctrlKey || e.altKey) return;
      if (el?.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el?.tagName ?? "")) return;
      if (e.code === "ArrowRight") goRef.current(pageRef.current + 1);
      else if (e.code === "ArrowLeft") goRef.current(pageRef.current - 1);
      else if (!student && isLabKey(e)) postLabDone();
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [student]);

  // 좌우로 밀어 넘기기(터치·마우스). 짧게 누른 건 클릭으로 둔다
  const down = useRef<{ x: number; y: number } | null>(null);
  const onDown = (e: React.PointerEvent) => {
    down.current = { x: e.clientX, y: e.clientY };
  };
  const onUp = (e: React.PointerEvent) => {
    const s = down.current;
    down.current = null;
    if (!s || !paging) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(e.clientY - s.y) * 1.5) go(page + (dx < 0 ? 1 : -1));
  };

  const v = stageVals({
    bridge,
    scene,
    step: d.step,
    minutesToLesson: d.minutesToLesson,
    minutesToDeadline: d.minutesToDeadline,
    pick,
    revealed,
    onPick: setPick,
    onReveal: () => setRevealed(true),
    onRope: () => d.reach(4),
    page,
    viewer,
  });

  return (
    <main className="h-dvh w-full" style={{ background: "#12171A", overflow: "clip", position: "relative" }}>
      <FitStage width={1440} height={810} maxCrop={0.05} ambient>
        <div
          className={`paged ${dir > 0 ? "pg-r" : "pg-l"}`}
          style={{ position: "relative", width: 1440, height: 810, touchAction: "pan-y" }}
          onPointerDown={onDown}
          onPointerUp={onUp}
          onPointerCancel={() => (down.current = null)}
        >
          <StageView {...v} />
          {paging && (
            <>
              {page > 0 && (
                <button type="button" className="pgarrow l" onClick={() => go(page - 1)} aria-label={`이전 구간 ${PAGE_NAMES[page - 1]}`}>
                  <span aria-hidden="true">‹</span>
                  <b>{PAGE_NAMES[page - 1]}</b>
                </button>
              )}
              {page < PAGE_NAMES.length - 1 && (
                <button type="button" className="pgarrow r" onClick={() => go(page + 1)} aria-label={`다음 구간 ${PAGE_NAMES[page + 1]}`}>
                  <b>{PAGE_NAMES[page + 1]}</b>
                  <span aria-hidden="true">›</span>
                </button>
              )}
              <nav className="pgdots" aria-label="구간 넘기기">
                {PAGE_NAMES.map((name, i) => (
                  <button key={name} type="button" className={i === page ? "on" : ""} aria-current={i === page ? "page" : undefined} onClick={() => go(i)}>
                    <WeatherIcon weather={v.pageWx[i]} size={30} />
                    {name}
                  </button>
                ))}
              </nav>
            </>
          )}
        </div>
      </FitStage>
      {student && (
        <Link href="/student" className="stu-back">
          ← 내 징검런
        </Link>
      )}
    </main>
  );
}
