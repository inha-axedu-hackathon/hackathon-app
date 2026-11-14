"use client";
// components/FitStage.tsx — 고정 크기 디자인(예: 1440×810)을 화면 크기에 맞춰 비율 그대로 확대·축소 (담당: 신재우)
import { useLayoutEffect, useRef, useState } from "react";

/** maxCrop: 화면 비율이 조금 다를 때 가장자리를 이 비율(한쪽 기준)까지 잘라 꽉 채운다. 0이면 항상 전부 보이게(여백 생김) */
export function FitStage({ width, height, children, maxCrop = 0 }: { width: number; height: number; children: React.ReactNode; maxCrop?: number }) {
  const box = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => {
      const contain = Math.min(el.clientWidth / width, el.clientHeight / height);
      const cover = Math.max(el.clientWidth / width, el.clientHeight / height);
      // cover로 했을 때 한쪽에서 잘리는 비율
      const cropX = (width * cover - el.clientWidth) / 2 / (width * cover);
      const cropY = (height * cover - el.clientHeight) / 2 / (height * cover);
      setScale(Math.max(cropX, cropY) <= maxCrop ? cover : contain);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width, height, maxCrop]);
  return (
    <div ref={box} className="relative h-full w-full" style={{ overflow: "clip" }}>
      <div
        style={{ width, height, position: "absolute", left: "50%", top: "50%", transform: `translate(-50%, -50%) scale(${scale})`, transformOrigin: "center", overflow: "clip" }}
      >
        {children}
      </div>
    </div>
  );
}
