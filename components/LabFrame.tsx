"use client";
// components/LabFrame.tsx — public/lab 실험실(팀원 사이트 사본, 수정 없음)을 같은 출처 iframe으로 띄우고 목표 글자 완성을 감지
// 연동 방법: docs/notes/lab-integration.md (완성 판정은 c.cur === 목표, 승급 팝업은 hg-cons-ach=["first"]로 막음)
import { useEffect, useRef, useState } from "react";

// 겉 틀 맞추기(실험실 파일은 그대로): 실험실을 넉넉한 데스크톱 크기로 그리게 한 뒤 카드에 맞게 통째로 줄이고,
// 실험실 위쪽 큰 제목·탭(우리 화면에 이미 있는 내용)은 넘기고 작업 영역(#consonant .work)이 카드 맨 위에 오게 실험실 창 안을 스크롤한다.
// 1000px보다 좁으면 실험실이 모바일 배치로 바뀌므로 폭은 최소 1000으로 둔다
const LAB_MIN_W = 1000;
const LAB_MIN_H = 640;

type LabSnap = { tab: string; c: { cur: string | null; made: string[]; ach: number; tier: number } };
type LabWin = Window & { __lab?: { snapshot(): LabSnap } };
type Props = { target: string; seed?: string; onDone: () => void; onKey?: (e: KeyboardEvent) => void };

export function LabFrame({ target, seed, onDone, onKey }: Props) {
  const ref = useRef<HTMLIFrameElement | null>(null);
  const done = useRef(false);
  const loaded = useRef(false); // 시작 글자를 올린 뒤부터만 완성 판정(지난 리허설 기록으로 바로 통과하지 않게)
  const doneRef = useRef(onDone);
  const keyRef = useRef(onKey);
  const box = useRef<HTMLDivElement | null>(null);
  const [fit, setFit] = useState<{ s: number; w: number; h: number; top: number } | null>(null);
  const [workH, setWorkH] = useState(LAB_MIN_H); // 실험실 작업 영역의 실제 높이(불러온 뒤 잼)
  const [labBg, setLabBg] = useState<string | undefined>(undefined); // 남는 공간을 실험실 바탕색으로(흰 띠 없이 한 장처럼)

  useEffect(() => {
    doneRef.current = onDone;
    keyRef.current = onKey;
  });

  // 작업 영역이 실험실 창 맨 위에 오게(같은 출처라 스크롤 위치를 정할 수 있음, 실험실 파일은 그대로)
  const workY = useRef<number | null>(null);
  const toWork = () => {
    const win = ref.current?.contentWindow;
    const work = ref.current?.contentDocument?.querySelector("#consonant .work");
    if (!win || !work) return;
    workY.current = Math.max(0, work.getBoundingClientRect().top + win.scrollY - 8);
    win.scrollTo(0, workY.current);
  };

  // 카드 크기(창 크기·분할 화면)나 작업 영역 높이가 바뀔 때마다 배율을 다시 정한다.
  // 보이는 높이는 작업 영역까지만(그 아래 실험실 자체의 도전 과제·칭호는 우리 칭호와 겹쳐서 잘라 냄), 남는 공간은 위아래 가운데로
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => {
      const cw = el.clientWidth;
      const ch = el.clientHeight;
      if (!cw || !ch) return;
      const h = workH + 16;
      const s = Math.min(1, cw / LAB_MIN_W, ch / h);
      setFit({ s, w: cw / s, h, top: Math.max(0, (ch - h * s) / 2) });
      requestAnimationFrame(toWork);
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [workH]);

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
    // 작업 영역 높이를 재서 배율에 쓰고, 실험실이 처음에 스스로 맨 위로 돌아가는 일이 있어 몇 번 더 맞춘다
    const bg = [doc.body, doc.documentElement].map((el) => win.getComputedStyle(el).backgroundColor).find((c) => c && c !== "rgba(0, 0, 0, 0)" && c !== "transparent");
    if (bg) setLabBg(bg);
    const work = doc.querySelector("#consonant .work");
    const readH = () => work && setWorkH(Math.ceil(work.getBoundingClientRect().height));
    readH();
    if (work && typeof ResizeObserver !== "undefined") new ResizeObserver(readH).observe(work);
    for (const ms of [0, 300, 800, 1500]) setTimeout(toWork, ms);
    // 학생이 휠로 내려도 작업 영역에 고정(아래쪽 실험실 칭호가 다시 보이지 않게). 작업 영역은 이미 전부 보이므로 스크롤할 필요가 없다
    win.addEventListener("scroll", () => {
      const y = workY.current;
      if (y !== null && Math.abs(win.scrollY - y) > 1) win.scrollTo(0, y);
    });
  };

  return (
    <div ref={box} className="relative min-h-[50vh] w-full flex-1 overflow-hidden" style={{ background: labBg }}>
      <iframe
        ref={ref}
        onLoad={onLoad}
        title="한글 창제 원리 실험실 (팀원 제작)"
        className="absolute top-0 left-0 block border-0 bg-transparent"
        style={
          fit
            ? { top: fit.top, width: fit.w, height: fit.h, transform: `scale(${fit.s})`, transformOrigin: "top left" }
            : { width: "100%", height: "100%" }
        }
      />
    </div>
  );
}
