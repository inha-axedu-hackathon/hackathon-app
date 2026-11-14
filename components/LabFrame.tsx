"use client";
// components/LabFrame.tsx — public/lab 실험실(팀원 사이트 사본, 수정 없음)을 같은 출처 iframe으로 띄우고 목표 글자 완성을 감지
// 연동 방법: docs/notes/lab-integration.md (완성 판정은 c.cur === 목표, 승급 팝업은 hg-cons-ach=["first"]로 막음)
import { useEffect, useRef } from "react";

type LabSnap = { tab: string; c: { cur: string | null; made: string[]; ach: number; tier: number } };
type LabWin = Window & { __lab?: { snapshot(): LabSnap } };
type Props = { target: string; seed?: string; onDone: () => void; onKey?: (e: KeyboardEvent) => void };

export function LabFrame({ target, seed, onDone, onKey }: Props) {
  const ref = useRef<HTMLIFrameElement | null>(null);
  const done = useRef(false);
  const loaded = useRef(false); // 시작 글자를 올린 뒤부터만 완성 판정(지난 리허설 기록으로 바로 통과하지 않게)
  const doneRef = useRef(onDone);
  const keyRef = useRef(onKey);

  useEffect(() => {
    doneRef.current = onDone;
    keyRef.current = onKey;
  });

  useEffect(() => {
    try {
      sessionStorage.setItem("hg-class", JSON.stringify({ role: "solo" })); // 참여 화면 없이 '혼자 해 보기'
      localStorage.setItem("hg-cons-ach", JSON.stringify(["first"])); // 첫 가획 승급 팝업이 뜨지 않게
    } catch {
      /* 저장 공간을 못 써도 실험실은 열린다 */
    }
    if (ref.current) ref.current.src = "/lab/index.html#consonant"; // 두 값을 쓴 뒤에 실험실을 연다
    const timer = setInterval(() => {
      if (!loaded.current) return;
      try {
        const snap = (ref.current?.contentWindow as LabWin | null | undefined)?.__lab?.snapshot();
        if (snap && !done.current && snap.c.cur === target) {
          done.current = true;
          doneRef.current();
        }
      } catch {
        /* 실험실이 아직 준비 전 */
      }
    }, 500);
    return () => clearInterval(timer);
  }, [target]);

  const onLoad = () => {
    const doc = ref.current?.contentDocument;
    const win = ref.current?.contentWindow;
    if (!doc || !win || !win.location.pathname.startsWith("/lab/")) return; // 빈 iframe의 load는 무시
    const st = doc.createElement("style");
    st.textContent = "#solo-pill,#rankup,#toast{display:none!important}"; // '수업에 참여하기'·승급·알림 숨김
    doc.head.appendChild(st);
    if (seed) {
      doc
        .querySelector(`#c-bases .tool[data-val="${seed}"]`)
        ?.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    }
    win.addEventListener("keydown", (e) => keyRef.current?.(e)); // 포커스가 실험실 안에 있어도 K·N 키가 먹게
    setTimeout(() => (loaded.current = true), 300);
  };

  return (
    <iframe
      ref={ref}
      onLoad={onLoad}
      title="한글 창제 원리 실험실 (팀원 제작)"
      className="h-[62vh] w-full rounded-2xl border border-line bg-paper-2"
    />
  );
}
