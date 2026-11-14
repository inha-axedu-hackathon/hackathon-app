"use client";
// 교사 · 오늘의 수업 예보 (담당: 정환희, docs/SPEC.md 5-1 T1·T2·T4) — 슈퍼스쿨 교사 홈의 "오늘의 수업 예보" 카드를 연 화면
// 숫자는 교사 화면에만 둔다(SPEC 5-0). AI 결과 바로 옆에 출처와 교사 확인 알림을 붙인다(6-4).
// 교사 화면이 교실 프로젝터에 비칠 수 있어서 이름은 기본으로 가리고(번호만), 예외 사유는 결재 화면에서만 보인다.
// [AI 분석 다시 실행]은 로컬(npm run dev)에서만 실제로 돌고, 배포 주소에서는 저장본(data/analysis.saved.json)을 쓴다.
import Link from "next/link";
import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import savedJson from "@/data/analysis.saved.json";
import { AiEvidence } from "@/components/teacher/AiEvidence";
import { BlockedTop3 } from "@/components/teacher/BlockedTop3";
import { CheckInPanel, ExceptionPanel, TypeGrid } from "@/components/teacher/ClassPanels";
import { LockGate, LockStatus, useInfoLock } from "@/components/teacher/InfoLock";
import { SectionCards } from "@/components/teacher/SectionCards";
import { VerifyNotice } from "@/components/teacher/VerifyNotice";
import { STUDENTS, bridgeState } from "@/lib/rules/bridge";
import { type AnalysisRun, aiWins, blockedPoints, headline, needsTeacher } from "@/lib/rules/forecast";
import { useDemo } from "@/lib/store";

const SAVED = savedJson as unknown as AnalysisRun;
const FRAME = {
  storm: "border-l-8 border-storm bg-white",
  locked: "border-l-8 border-seal bg-seal-soft",
  cloud: "border-l-8 border-water bg-white",
  clear: "border-l-8 border-water bg-white",
} as const;
const noop = () => () => {};

type RunState = "idle" | "running" | "saved-only";

export default function TeacherPage() {
  const d = useDemo();
  const lock = useInfoLock(); // 학생 정보 잠금(T7): 열렸을 때만 이름을 보일 수 있다
  const mounted = useSyncExternalStore(noop, () => true, () => false); // 첫 프레임(서버 초기값)에 잘못된 예보가 비치지 않게
  const b = useMemo(() => bridgeState(d.events), [d.events]);
  const [live, setLive] = useState<AnalysisRun | null>(null);
  const [runState, setRunState] = useState<RunState>("idle");
  const [showNames, setShowNames] = useState(false);
  const [dismissed, setDismissed] = useState<ReadonlySet<string>>(new Set());
  const titleRef = useRef<HTMLParagraphElement>(null);
  const run = live ?? SAVED;

  const blocked = useMemo(() => blockedPoints(run.results, dismissed), [run, dismissed]);
  const wins = useMemo(() => aiWins(run.results), [run]);
  const check = useMemo(() => needsTeacher(run.results), [run]);
  const together = d.events.find((e) => e.type === "together_done");
  const h = headline(b, blocked[0], together?.type === "together_done" ? together.correctTeams : undefined);
  const startSections = b.sections.filter((s) => s.locked || (!b.lessonStarted && s.placed / Math.max(s.total, 1) < 0.8)).map((s) => s.name);
  const lockedNow = b.lessonStarted && !b.together && b.sections.some((s) => s.locked);
  const model = run.model ?? "claude-haiku-5-5";
  const source = run.live ? `AI 분석 · 방금 다시 실행 (${model}, ${run.llmCount ?? run.results.length}명)` : `AI 분석 저장본 · 말해보기 제출 직후 (${model})`;

  function toggle(key: string) {
    setDismissed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function startLesson() {
    d.reach(3);
    requestAnimationFrame(() => titleRef.current?.focus());
  }

  async function analyze() {
    if (runState === "running") return;
    setRunState("running");
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 25_000);
    try {
      const answers = STUDENTS.map((s) => ({ studentId: s.id, text: s.signals.explain1, label: s.label?.misconceptions ?? [] }));
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
        signal: ctrl.signal,
      });
      const out = (await res.json()) as AnalysisRun & { usedLLM?: boolean };
      const llm = out.results?.filter((r) => r.source === "llm").length ?? 0;
      if (!res.ok || !out.usedLLM || llm < out.results.length * 0.8) throw new Error("fallback"); // AI가 거의 못 읽었으면 저장본 유지
      setLive({ ...out, createdAt: new Date().toISOString(), live: true });
      setRunState("idle");
    } catch {
      setRunState("saved-only");
    } finally {
      clearTimeout(timer);
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-[1400px] flex-col gap-4 px-4 pt-5 pb-16 sm:px-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-mute">슈퍼스쿨 › 교사 홈 › 징검다리</p>
          <h1 className="flex flex-wrap items-baseline gap-x-3 text-3xl font-bold tracking-tight sm:text-4xl">
            오늘의 수업 예보
            <span className="font-serif text-lg font-semibold tracking-normal text-water-deep">다리가 끊긴 곳에서 수업이 시작돼요</span>
          </h1>
          <p className="mt-1 text-base text-mute">2학년 3반 국어 · 3교시 10:50 · 문자 체계(가획과 병서)</p>
        </div>
        <div className="flex flex-col items-end gap-1 text-right">
          <p className="tabular">
            <span className="mr-2 text-base text-mute">지금 {d.now.slice(11, 16)}</span>
            <span className="text-3xl font-bold">{d.minutesToLesson > 0 ? `수업까지 ${d.minutesToLesson}분` : "수업 중"}</span>
          </p>
          <p className="text-sm text-mute">
            수업활동 › 성찰 「개념 말해보기」 {run.results.length}/{STUDENTS.length} 제출 · 누가 냈는지를 넘어 <b className="text-ink">무엇을 모르는지</b>
          </p>
          <LockStatus />
          {lock.open && (
            <button
              type="button"
              aria-pressed={showNames}
              onClick={() => setShowNames((v) => !v)}
              className="rounded-lg border border-line px-2.5 py-1 text-sm hover:border-ink"
            >
              {showNames ? "이름 가리기" : "이름도 보기"} <span className="text-mute">· 프로젝터에 띄울 땐 번호만</span>
            </button>
          )}
        </div>
      </header>

      <section className={`rounded-2xl px-5 py-4 transition-colors duration-500 ${FRAME[h.tone]}`}>
        <div aria-live="polite" aria-atomic="true">
          <p key={h.title} ref={titleRef} tabIndex={-1} className="animate-rise font-serif text-3xl leading-snug font-bold outline-none sm:text-4xl">
            {mounted ? h.title : " "}
          </p>
          <p className="mt-1 text-lg text-ink/80">{mounted ? h.sub : " "}</p>
        </div>
        {mounted && !b.lessonStarted && (
          <button type="button" onClick={startLesson} className="mt-3 rounded-lg bg-ink px-4 py-2 text-lg font-semibold text-paper hover:bg-ink/85">
            수업 시작 <kbd className="ml-1 text-sm opacity-70">T</kbd>
          </button>
        )}
        {mounted && lockedNow && (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Link href="/class" className="rounded-lg bg-seal px-4 py-2 text-lg font-bold text-white hover:bg-seal/90">
              함께 놓기 시작 · 8분 → 교실 화면
            </Link>
            <span className="text-base text-ink/80">규칙 제안: 놓인 돌 80% 미만 구간은 잠그고 첫 8분 함께 놓기 · 결정은 선생님</span>
          </div>
        )}
        <p className="mt-3 text-sm font-semibold text-water-deep">AI는 학생 답을 읽고 · 규칙은 돌을 고르고 · 선생님이 정해요</p>
      </section>

      <SectionCards b={b} animate={mounted} />

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <section className="flex flex-col gap-2" aria-labelledby="top3-h">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="top3-h" className="text-xl font-bold">
              막힌 지점 TOP 3
            </h2>
            <span className="text-sm text-mute">원문을 열어 근거 확인 · 틀린 판단은 선생님이 뺄 수 있어요</span>
          </div>
          <BlockedTop3 items={blocked} showNames={showNames && lock.open} startSections={startSections} onToggle={toggle} />
          {check.length > 0 && (
            <details className="rounded-lg border border-line bg-white px-3 py-2 text-base">
              <summary className="cursor-pointer font-semibold">선생님이 직접 읽어야 할 답 {check.length}건 · 눌러서 보기</summary>
              <div className="mt-1">
                <LockGate what="AI가 판단을 미룬 답" ids={check.map((c) => c.student.id)}>
                  <ul className="text-mute">
                    {check.map((c) => (
                      <li key={c.student.id}>
                        {c.student.no}번 “{c.student.signals.explain1}”
                      </li>
                    ))}
                  </ul>
                </LockGate>
              </div>
            </details>
          )}
          <VerifyNotice />
        </section>

        <section className="flex flex-col gap-2" aria-labelledby="ai-h">
          <div className="flex items-center justify-between gap-2">
            <h2 id="ai-h" className="text-xl font-bold">
              AI가 읽은 근거
            </h2>
            <button
              type="button"
              onClick={analyze}
              disabled={runState === "running"}
              className="rounded-lg border border-water px-3 py-1.5 text-base font-semibold text-water-deep hover:bg-water-soft disabled:opacity-60"
            >
              {runState === "running" ? "30명 읽는 중…" : "AI 분석 다시 실행"}
            </button>
          </div>
          {runState === "saved-only" && (
            <p role="status" className="text-sm text-mute">
              {live ? "다시 부르지 못해서 직전 분석을 그대로 보여 줘요." : "지금은 AI를 부를 수 없어서 저장된 분석을 보여 줘요."}
            </p>
          )}
          <AiEvidence run={run} wins={wins.slice(0, 3)} total={wins.length} />
          <VerifyNotice source={source} />
        </section>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <TypeGrid className="md:col-span-2 xl:col-span-1" />
        <ExceptionPanel events={d.events} showNames={showNames && lock.open} />
        <CheckInPanel events={d.events} showNames={showNames && lock.open} />
      </div>

      <p className="text-sm text-mute">
        학생 답·AI 분석·8유형은 이 단원(약 4주)이 끝나면 지워요 · 학생부에 넣지 않아요 · 외부 AI에는 가명과 답만 보내요 · 시연은 가상 학생 데이터
      </p>
    </main>
  );
}
