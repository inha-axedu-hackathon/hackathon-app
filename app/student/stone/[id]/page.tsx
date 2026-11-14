"use client";
// 학생 · 돌 굳히기 (담당: 신재우) — docs/SPEC.md 5-2 S2 · GAMIFICATION 3-4
// 개념 카드 → 실험실에서 목표 글자 만들기 → 굳히기 2문항 → 틀리면 교정 설명 + 변형 1문항 → "첨벙! 한 칸 놓음"
// 숨은 키 K: 실험실 완성 처리(시연 실패 대비)
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { handleDemoKey } from "@/components/DemoKeys";
import { LabFrame } from "@/components/LabFrame";
import { myProgress } from "@/components/student/progress";
import { isLabKey, onLabDone, postLabDone } from "@/components/student/labSignal";
import { DEMO_STUDENT, stoneCard } from "@/components/student/stones";
import { useDemo } from "@/lib/store";
import type { Question } from "@/lib/types";

type Phase = "card" | "lab" | "quiz" | "done" | "wet";

export default function StonePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const d = useDemo();
  const card = stoneCard(id);
  const [phase, setPhase] = useState<Phase>("card");
  const [queue, setQueue] = useState<Question[]>(() => card?.questions.slice(0, 2) ?? []);
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [usedVariant, setUsedVariant] = useState(false);

  const labDone = useCallback(() => setPhase((p) => (p === "lab" ? "quiz" : p)), []);

  // 페이지에서 누른 K도 실험실 완성으로 (iframe 안에서 누른 키는 LabFrame이 넘겨 준다)
  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (isLabKey(e)) postLabDone();
      else handleDemoKey(e, (path) => router.push(path));
    },
    [router],
  );
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (isLabKey(e)) postLabDone();
    };
    window.addEventListener("keydown", on);
    const off = onLabDone(labDone); // /demo의 다른 창에서 누른 K도 받는다
    return () => {
      window.removeEventListener("keydown", on);
      off();
    };
  }, [labDone]);

  const p = useMemo(() => myProgress(DEMO_STUDENT, d.events), [d.events]);

  if (!card) {
    return (
      <main className="mx-auto max-w-md px-5 py-10">
        <p>이 돌을 찾을 수 없어요.</p>
        <Link href="/student" className="text-water underline">
          징검런 홈으로
        </Link>
      </main>
    );
  }

  const q = queue[qi];
  const correct = picked !== null && q && picked === q.answer;

  const place = () => {
    const already = d.events.some((e) => e.type === "stone_placed" && e.studentId === DEMO_STUDENT && e.stoneId === card.id);
    if (!already) {
      // 이벤트를 먼저 넣고 단계만 올린다(다른 돌을 먼저 굳힌 리허설에서도 ㅌ 첨벙이 빠지지 않게)
      d.add({ type: "stone_placed", studentId: DEMO_STUDENT, stoneId: card.id });
      if (card.id === "st-t") d.reach(1); // 시연 단계 1: ㅌ 첨벙
    }
    setPhase("done");
  };

  const nextQuestion = () => {
    if (!q) return;
    if (picked === q.answer) {
      if (qi + 1 < queue.length) {
        setQi(qi + 1);
        setPicked(null);
      } else place();
      return;
    }
    // 틀림: 변형 문항을 한 번 더 준다. 변형까지 틀리면 젖은 돌(불이익 없음)
    if (!usedVariant && card.questions[2]) {
      setQueue([...queue.slice(0, qi + 1), card.questions[2], ...queue.slice(qi + 1)]);
      setUsedVariant(true);
      setQi(qi + 1);
      setPicked(null);
    } else setPhase("wet");
  };

  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col gap-4 px-5 py-6">
      <header className="flex items-center justify-between">
        <Link href="/student" className="text-mute hover:text-ink">
          ← 징검런
        </Link>
        <p className="text-sm text-mute">
          {card.section} 돌 · 약 {card.minutes}분
        </p>
      </header>

      <div className="flex items-center gap-4">
        <span className="grid size-16 place-content-center rounded-2xl bg-water text-4xl text-white font-serif">{card.char}</span>
        <h1 className="text-2xl font-bold">{card.char} 돌 굳히기</h1>
      </div>

      {phase === "card" && (
        <section className="animate-rise grid gap-4">
          <p className="rounded-2xl border border-line bg-white px-5 py-4 text-lg leading-relaxed">{card.card}</p>
          <button
            type="button"
            onClick={() => setPhase(card.lab ? "lab" : "quiz")}
            className="rounded-2xl bg-water px-5 py-4 text-lg font-bold text-white hover:bg-water-deep"
          >
            {card.lab ? `실험실에서 ${card.lab.target} 만들기` : "굳히기 문항 풀기"}
          </button>
        </section>
      )}

      {phase === "lab" && card.lab && (
        <section className="grid gap-2">
          <p className="text-lg">
            작업판의 <b>{card.lab.seed}</b>에 획을 더해 <b className="text-water">{card.lab.target}</b>을 만들어 보세요.
          </p>
          <LabFrame target={card.lab.target} seed={card.lab.seed} onDone={labDone} onKey={onKey} />
          <p className="text-xs text-mute">한글 창제 원리 실험실 · 팀원 제작 (출처: hangul-class.netlify.app)</p>
        </section>
      )}

      {phase === "quiz" && q && (
        <section className="grid gap-3" aria-live="polite">
          <div key={q.id} className="animate-rise grid gap-3">
          <p className="text-sm text-mute">
            굳히기 문항 {Math.min(qi + 1, queue.length)} / {queue.length}
          </p>
          <p className="text-xl font-bold">{q.prompt}</p>
          <div className="grid gap-2">
            {q.options.map((o, i) => {
              const show = picked !== null;
              const isAns = show && i === q.answer;
              const isPick = picked === i;
              return (
                <button
                  key={o}
                  type="button"
                  disabled={show}
                  onClick={() => setPicked(i)}
                  className={[
                    "rounded-2xl border-2 px-4 py-3 text-left text-lg transition",
                    isAns ? "border-water bg-water-soft font-semibold" : isPick ? "border-seal/40 bg-seal-soft" : "border-line bg-white hover:border-water",
                  ].join(" ")}
                >
                  {o}
                  {isAns && <span className="ml-2 text-sm font-bold text-water-deep">✓ 정답</span>}
                </button>
              );
            })}
          </div>
          {picked !== null && (
            <div className="animate-fade grid gap-3 rounded-2xl bg-paper-2 px-4 py-3">
              <p className="font-semibold">{correct ? "맞아요!" : "아깝다, 한 번 더 두드려 봐"}</p>
              <p className="text-mute">{q.explain}</p>
              <button type="button" onClick={nextQuestion} className="justify-self-end rounded-xl bg-ink px-4 py-2 font-semibold text-white">
                {correct ? (qi + 1 < queue.length ? "다음 문항" : "돌 놓기") : usedVariant || !card.questions[2] ? "확인" : "비슷한 문항 하나 더"}
              </button>
            </div>
          )}
          </div>
        </section>
      )}

      {phase === "done" && (
        <section className="animate-rise grid justify-items-center gap-4 py-6 text-center" role="status">
          <div className="relative grid size-28 place-content-center">
            <span className="animate-splash absolute inset-0 rounded-full border-4 border-water" />
            <span className="grid size-24 place-content-center rounded-full bg-water font-serif text-5xl text-white">{card.char}</span>
          </div>
          <p className="text-3xl font-bold">첨벙! 한 칸 놓음</p>
          <p className="text-mute">우리 반 다리의 {card.section} 구간에 내 돌이 놓였어요</p>
          {p.allPlaced && !p.arrived ? (
            <Link href="/student/explain" className="rounded-2xl bg-ink px-6 py-3 text-lg font-bold text-white">
              도착 관문으로
            </Link>
          ) : (
            <Link href="/student" className="rounded-2xl bg-water px-6 py-3 text-lg font-bold text-white">
              징검런 홈으로
            </Link>
          )}
        </section>
      )}

      {phase === "wet" && (
        <section className="animate-rise grid gap-3 rounded-2xl bg-paper-2 px-5 py-4" role="status">
          <p className="text-lg font-bold">젖은 돌이 됐어요 · 불이익은 없어요</p>
          <p className="text-mute">다음에 새 문항으로 다시 해요. 막히면 선생님과 함께 건널 수 있어요.</p>
          <Link href="/student" className="justify-self-start rounded-xl bg-water px-4 py-2 font-semibold text-white">
            징검런 홈으로
          </Link>
        </section>
      )}
    </main>
  );
}
