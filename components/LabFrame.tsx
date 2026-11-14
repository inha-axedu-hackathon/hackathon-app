"use client";
// components/LabFrame.tsx — public/lab 실험실(팀원 사이트 사본, 수정 없음)을 같은 출처 iframe으로 띄우고 목표 글자 완성을 감지
// 연동 방법: docs/notes/lab-integration.md (완성 판정은 c.cur === 목표, 승급 팝업은 hg-cons-ach=["first"]로 막음)
import { useEffect, useRef, useState } from "react";

// 겉 틀 맞추기(실험실 파일은 그대로): 실험실을 넉넉한 데스크톱 크기로 그리게 한 뒤 카드에 맞게 통째로 줄이고,
// 실험실 위쪽 큰 제목·탭(우리 화면에 이미 있는 내용)은 넘기고 작업 영역(#consonant .work)이 카드 맨 위에 오게 실험실 창 안을 스크롤한다.
// 1000px보다 좁으면 실험실이 모바일 배치로 바뀌므로 폭은 최소 1000으로 둔다
const LAB_MIN_W = 1000;
const LAB_MIN_H = 640;

// 실험실 안쪽을 우리 화면 말투로(실험실 파일은 그대로, 불러온 뒤 스타일만 덧씌움 · 원작자 팀원 동의).
// 바탕·선·회색·글꼴은 우리 토큰(app/globals.css)으로, 버튼·작업판은 우리 카드처럼 먹 테두리+눌린 그림자로.
// 자음 주홍(--cons, 우리 인주와 같은 색)·모음 쪽빛(--vow)·명조 글자 모양은 뜻이 있는 색·모양이라 그대로 둔다
const PRETENDARD = "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css";
const LAB_SKIN = `
#solo-pill,#rankup,#toast{display:none!important}
:root{--paper:#fafaf7;--panel:#ffffff;--line:#e3e0d6;--muted:#6b665f;
  --font-body:"Pretendard Variable",Pretendard,-apple-system,"Apple SD Gothic Neo","Noto Sans KR",sans-serif}
:focus-visible{outline-color:#9b3a51}
.btn{font-weight:600;border:1.5px solid #1c1a18;padding:6px 16px;transition:background-color .2s}
.btn:hover{background:#f9ecef;color:#1c1a18}
.btn.primary{background:#9b3a51;color:#fff;box-shadow:0 2px 0 #1c1a18}
.btn.primary:hover{background:#833044;color:#fff}
.btn:disabled:hover{background:transparent;color:#1c1a18}
.mission,.tool{border-radius:14px}
.tool{transition:border-color .2s,box-shadow .2s}
.tool:hover{border-color:#c9798a}
.tool.active{border-color:#9b3a51;box-shadow:inset 0 0 0 1px #9b3a51;background:#fcf5f6}
.board{border-radius:14px;box-shadow:0 3px 0 #1c1a18}
.explain{border-radius:16px;box-shadow:0 1px 2px rgb(28 26 24/.06),0 2px 8px rgb(28 26 24/.06)}
.ex-glyph{border-radius:12px}
.jg-hint{position:relative;border-radius:16px;box-shadow:0 0 0 2px #9b3a51;animation:jgpulse 1.6s ease-in-out infinite}
.jg-hint>.lab{color:#9b3a51;font-weight:700}
@keyframes jgpulse{0%,100%{box-shadow:0 0 0 2px #9b3a51}50%{box-shadow:0 0 0 6px rgba(155,58,81,.18)}}
`;

type LabSnap = { tab: string; c: { cur: string | null; made: string[]; ach: number; tier: number } };
type LabWin = Window & { __lab?: { snapshot(): LabSnap } };
type Props = {
  target: string;
  seed?: string;
  onDone: () => void;
  onKey?: (e: KeyboardEvent) => void;
  onChange?: (cur: string | null) => void; // 지금 작업판의 글자(목표 띠의 ㄴ→ㄷ→ㅌ 표시용)
};

export function LabFrame({ target, seed, onDone, onKey, onChange }: Props) {
  const ref = useRef<HTMLIFrameElement | null>(null);
  const done = useRef(false);
  const loaded = useRef(false); // 시작 글자를 올린 뒤부터만 완성 판정(지난 리허설 기록으로 바로 통과하지 않게)
  const doneRef = useRef(onDone);
  const keyRef = useRef(onKey);
  const changeRef = useRef(onChange);
  const lastCur = useRef<string | null | undefined>(undefined);
  const box = useRef<HTMLDivElement | null>(null);
  const [fit, setFit] = useState<{ s: number; w: number; h: number; top: number } | null>(null);
  const [workH, setWorkH] = useState(LAB_MIN_H); // 실험실 작업 영역의 실제 높이(불러온 뒤 잼)
  const [labBg, setLabBg] = useState<string | undefined>(undefined); // 남는 공간을 실험실 바탕색으로(흰 띠 없이 한 장처럼)

  useEffect(() => {
    doneRef.current = onDone;
    keyRef.current = onKey;
    changeRef.current = onChange;
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
        if (snap && snap.c.cur !== lastCur.current) {
          lastCur.current = snap.c.cur;
          changeRef.current?.(snap.c.cur);
          // 첫 획을 놓기 전까지만 '더하기' 줄을 깜빡여 어디를 끌지 알려 준다(한 번 해 보면 사라짐)
          const doc = ref.current?.contentDocument;
          const row = [...(doc?.querySelectorAll("#consonant .toolrow") ?? [])].find((r) => r.querySelector(".lab")?.textContent?.includes("더하기"));
          row?.classList.toggle("jg-hint", snap.c.cur === (seed ?? null));
        }
        if (snap && !done.current && snap.c.cur === target) {
          done.current = true;
          doneRef.current();
        }
      } catch {
        /* 실험실이 아직 준비 전 */
      }
    }, 500);
    return () => clearInterval(timer);
  }, [target, seed]);

  const onLoad = () => {
    const doc = ref.current?.contentDocument;
    const win = ref.current?.contentWindow;
    if (!doc || !win || !win.location.pathname.startsWith("/lab/")) return; // 빈 iframe의 load는 무시
    const font = doc.createElement("link");
    font.rel = "stylesheet";
    font.href = PRETENDARD; // 우리 화면과 같은 글꼴(app/layout.tsx와 같은 주소)
    doc.head.appendChild(font);
    const st = doc.createElement("style");
    st.textContent = LAB_SKIN; // '수업에 참여하기'·승급·알림 숨김 + 우리 화면 말투
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
