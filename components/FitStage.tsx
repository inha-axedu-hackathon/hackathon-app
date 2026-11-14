"use client";
// components/FitStage.tsx — 고정 크기 디자인(예: 1440×810)을 화면 크기에 맞춰 비율 그대로 확대·축소 (담당: 신재우)
import { useEffect, useRef, useState } from "react";

export function FitStage({ width, height, children }: { width: number; height: number; children: React.ReactNode }) {
  const box = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => setScale(Math.min(el.clientWidth / width, el.clientHeight / height));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width, height]);
  return (
    <div ref={box} className="relative grid h-full w-full place-items-center" style={{ overflow: "clip" }}>
      <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: "center", flex: "none", overflow: "clip" }} className="relative">
        {children}
      </div>
    </div>
  );
}
