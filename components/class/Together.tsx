"use client";
// components/class/Together.tsx — 첫 8분 함께 놓기 (C3). 큰 O/X + 30초 모둠 상의 → 결과는 날씨로만 말한다
// 정답 모둠 수 같은 숫자는 교사 화면에만 있다 (SPEC 5-0)
import { useEffect, useState } from "react";
import { TOGETHER } from "@/components/student/stones";
import type { Section } from "@/lib/types";

export function Together({ sections, onDone }: { sections: Section[]; onDone: () => void }) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<"O" | "X" | null>(null);
  const [left, setLeft] = useState(30);
  const sec = sections[idx];
  const quiz = sec ? TOGETHER[sec] : undefined;

  useEffect(() => {
    if (picked) return;
    const t = setInterval(() => setLeft((n) => Math.max(0, n - 1)), 1000);
    return () => clearInterval(t);
  }, [picked, idx]);

  const last = idx >= sections.length - 1;
  if (!quiz) return null;
  const next = () => {
    if (last) return onDone();
    setIdx(idx + 1);
    setPicked(null);
    setLeft(30);
  };

  return (
    <section className="animate-rise mx-auto w-full max-w-4xl rounded-3xl border border-line bg-white px-8 py-4 shadow-sm">
      <div className="flex items-center justify-between text-mute">
        <p className="text-2xl font-bold">
          {sec}에 소나기 · <span className="text-water">첫 8분 함께 놓기</span>
        </p>
        {!picked && <p className="tabular text-lg">모둠 상의 {left}초</p>}
      </div>
      <p className="mt-1 text-center text-4xl leading-snug font-bold">“{quiz.prompt}”</p>
      {!picked && (
      <div className="mt-5 grid grid-cols-2 gap-6">
        {(["O", "X"] as const).map((v) => {
          const isAnswer = picked && v === quiz.answer;
          const isWrongPick = picked === v && v !== quiz.answer;
          return (
            <button
              key={v}
              type="button"
              disabled={Boolean(picked)}
              onClick={() => setPicked(v)}
              className={[
                "rounded-2xl border-4 font-black transition-all",
                picked ? "py-2 text-3xl" : "py-5 text-6xl",
                isAnswer ? "border-water bg-water-soft text-water-deep" : "border-line bg-paper text-ink",
                isWrongPick ? "opacity-50" : "",
                !picked ? "hover:border-water hover:bg-water-soft" : "",
              ].join(" ")}
              aria-label={v === "O" ? "O 맞다" : "X 아니다"}
            >
              {v}
            </button>
          );
        })}
      </div>
      )}
      {picked && (
        <div className="animate-fade mt-4 grid gap-2 text-center" aria-live="polite">
          <p className="text-2xl font-semibold">
            <span className="mr-2 inline-grid size-10 place-content-center rounded-xl bg-water-soft font-black text-water-deep">{quiz.answer}</span>
            {picked === quiz.answer ? "맞아요!" : "아깝다 — 그래서 오늘 수업이 여기서 시작해요"}
          </p>
          <p className="text-xl text-mute">{quiz.explain}</p>
          <p className="text-xl font-semibold text-water">모둠 답을 모았어요 · 이제 밧줄을 내려요</p>
          <button type="button" onClick={next} className="mx-auto mt-2 rounded-xl bg-water px-6 py-3 text-lg font-semibold text-white hover:bg-water-deep">
            {last ? "밧줄 내리기" : "다음 구간"}
          </button>
        </div>
      )}
    </section>
  );
}
