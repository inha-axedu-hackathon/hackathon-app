"use client";
// 교사 · 오늘의 수업 예보 (담당: 신재우·정환희, docs/SPEC.md 5-1 T1·T2·T4·T7)
// 겉모습: 디자인 캔버스 Console(components/teacher/ConsoleView). 기능: 정환희가 만든 예보·AI 근거·잠금·예외·체크인 컴포넌트.
// 숫자는 교사 화면에만 둔다(SPEC 5-0). AI 결과 바로 옆에 출처와 교사 확인 알림을 붙인다(6-4).
// 교사 화면이 교실 프로젝터에 비칠 수 있어서 이름은 기본으로 가리고(번호만), 예외 사유는 결재 화면에서만 보인다.
// [AI 분석 다시 실행]은 로컬(npm run dev)에서만 실제로 돌고, 배포 주소에서는 저장본(data/analysis.saved.json)을 쓴다.
import Link from "next/link";
import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import savedJson from "@/data/analysis.saved.json";
import { AiEvidence } from "@/components/teacher/AiEvidence";
import { BlockedTop3 } from "@/components/teacher/BlockedTop3";
import { ExceptionPanel } from "@/components/teacher/ClassPanels";
import { ConsoleView } from "@/components/teacher/ConsoleView";
import { TOGETHER } from "@/components/student/stones";
import { LockGate, LockStatus, useInfoLock } from "@/components/teacher/InfoLock";
import { VerifyNotice } from "@/components/teacher/VerifyNotice";
import { bridgeState, type SectionState } from "@/lib/rules/bridge";
import { TYPE_PRINCIPLES, readinessCounts, typeHypothesis } from "@/lib/rules/typeRules";
import { STUDENTS } from "@/lib/rules/roster"; // 교사 전용 전체 명단(학생·교실 화면은 import 금지)
import { type AnalysisRun, aiWins, blockedPoints, headline, needsTeacher } from "@/lib/rules/forecast";
import { useDemo } from "@/lib/store";

const SAVED = savedJson as unknown as AnalysisRun;
const noop = () => () => {};
type RunState = "idle" | "running" | "saved-only" | "off";

const WX: Record<SectionState["weather"], { key: "clear" | "cloud" | "dark" | "shower"; col: string }> = {
  맑음: { key: "clear", col: "#7A4E00" },
  구름: { key: "cloud", col: "#4A4641" },
  먹구름: { key: "dark", col: "#4B5C6B" },
  소나기: { key: "shower", col: "#1E5A60" },
};

// 8유형 (SPEC 8-1-1): 환경 걸림돌이 있으면 참여는 "낮아 보임"으로 두고 판단을 미룬다
const TYPES = [
  { p: "있음", r: "준비", e: "양호", stones: "돌 1(심화)", color: "#7A2A3D" },
  { p: "있음", r: "보충", e: "양호", stones: "돌 3", color: "#A8455C" },
  { p: "있음", r: "준비", e: "걸림돌", stones: "돌 1", color: "#C76E7F" },
  { p: "있음", r: "보충", e: "걸림돌", stones: "돌 2–3", color: "#E3A0A8" },
  { p: "낮음", r: "준비", e: "양호", stones: "작은 돌 2", color: "#D9814F" },
  { p: "낮음", r: "보충", e: "양호", stones: "작은 돌 2", color: "#EBAA80" },
  { p: "낮음", r: "준비", e: "걸림돌", stones: "작은 돌 1", color: "#F3CBAE" },
  { p: "낮음", r: "보충", e: "걸림돌", stones: "작은 돌 1", color: "#F8E3D4" },
] as const;

type TabId = "today" | "stuck" | "except" | "plan";
const TABS: { id: TabId; label: string; sub: string }[] = [
  { id: "today", label: "오늘 현황", sub: "구간 날씨 · 반 전체" },
  { id: "stuck", label: "막힌 지점", sub: "" },
  { id: "except", label: "예외 확인", sub: "" },
  { id: "plan", label: "함께 놓기", sub: "계획 · 8유형 분포" },
];

export default function TeacherPage() {
  const d = useDemo();
  const lock = useInfoLock(); // 학생 정보 잠금(T7): 열렸을 때만 이름을 보일 수 있다
  const mounted = useSyncExternalStore(noop, () => true, () => false); // 첫 프레임(서버 초기값)에 잘못된 예보가 비치지 않게
  const b = useMemo(() => bridgeState(d.events), [d.events]);
  const [live, setLive] = useState<AnalysisRun | null>(null);
  const [runState, setRunState] = useState<RunState>("idle");
  const [showNames, setShowNames] = useState(false);
  const [tab, setTab] = useState<TabId>("today");
  const [dismissed, setDismissed] = useState<ReadonlySet<string>>(new Set());
  const titleRef = useRef<HTMLParagraphElement>(null);
  const run = live ?? SAVED;

  const blocked = useMemo(() => blockedPoints(run.results, dismissed), [run, dismissed]);
  const wins = useMemo(() => aiWins(run.results), [run]);
  const check = useMemo(() => needsTeacher(run.results), [run]);
  const together = d.events.find((e) => e.type === "together_done");
  const h = headline(b, blocked[0], together?.type === "together_done" ? together.correctTeams : undefined);
  const startSections = b.sections.filter((s) => s.locked || (!b.lessonStarted && s.placed / Math.max(s.total, 1) < 0.8)).map((s) => s.name);
  const lockedNames = b.sections.filter((s) => s.locked).map((s) => s.name);
  const lockedNow = b.lessonStarted && !b.together && lockedNames.length > 0;
  const model = run.model ?? "claude-haiku-5-5";
  const source = run.live
    ? `AI 분석 · 방금 다시 실행 (${model}, ${run.llmCount ?? run.results.length}명)` + (run.tokens?.used === 0 ? " · 같은 답이라 직전 결과 재사용" : "")
    : `AI 분석 저장본 · 말해보기 제출 직후 (${model})`;
  const agree = run.agreement ? ` · 오개념 탐지 일치 ${run.agreement.matched}/${run.agreement.total}` : "";

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
    const timer = setTimeout(() => ctrl.abort(), 45_000);
    try {
      const answers = STUDENTS.map((s) => ({ studentId: s.id, text: s.signals.explain1, label: s.label?.misconceptions ?? [] }));
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
        signal: ctrl.signal,
      });
      if (res.status === 403) {
        setRunState("off"); // 배포 주소: 시연 전에 저장한 분석을 쓴다(로컬에서만 다시 실행)
        return;
      }
      const out = (await res.json()) as AnalysisRun & { usedLLM?: boolean };
      const llm = out.results?.filter((r) => r.source === "llm").length ?? 0;
      if (!res.ok || !out.usedLLM || llm < out.results.length * 0.8) throw new Error("fallback"); // AI가 거의 못 읽었으면 저장본 유지
      setLive({ ...out, tokens: (out as AnalysisRun).tokens, createdAt: new Date().toISOString(), live: true });
      setRunState("idle");
    } catch {
      setRunState("saved-only");
    } finally {
      clearTimeout(timer);
    }
  }

  const secs = b.sections.map((s) => {
    const pct = Math.round((s.placed / Math.max(s.total, 1)) * 100);
    const w = WX[s.weather];
    const left = s.total - s.placed;
    const note =
      s.rope > 0
        ? `밧줄 돌 ${s.rope}개 · 오늘 안에 각자 굳힘`
        : pct >= 100
          ? "모두 놓임"
          : pct >= 80
            ? `남은 ${left}칸 · 개통 기준 넘음`
            : s.locked
              ? "80% 미만 · 물때에 잠김"
              : "80% 미만 · 수업 시작 때 잠김";
    return { name: s.name, placed: s.placed, total: s.total, pct, word: s.weather, col: w.col, note, clear: w.key === "clear", cloud: w.key === "cloud", dark: w.key === "dark", shower: w.key === "shower" };
  });

  const counts = TYPES.map((t) => STUDENTS.filter((s) => s.type?.participation === t.p && s.type?.readiness === t.r && s.type?.environment === t.e).length);

  const planNames = b.lessonStarted ? lockedNames : b.sections.filter((s) => s.placed / Math.max(s.total, 1) < 0.8).map((s) => s.name);
  const planQ = planNames[0] ? TOGETHER[planNames[0] as keyof typeof TOGETHER] : null;
  const exceptionCount = STUDENTS.filter((s) => s.exception).length;
  // 8유형 기준 5가지(SPEC 8-1-2): 관찰 근거 · 의욕 판정 보류 · 결손/오개념 구분 · 경계 보류 · 이번 단원 가설
  const hyps = STUDENTS.map((s) => typeHypothesis(s, run.results.find((r) => r.studentId === s.id)));
  const rc = readinessCounts(hyps);
  const pLow = hyps.filter((h) => h.participation === "낮음 · 이유 확인 전").length;
  const pEnv = hyps.filter((h) => h.participation === "낮아 보임 · 환경 먼저").length;
  const cell = (n: number) => (!lock.open && n > 0 && n <= 2 ? "1~2" : String(n));
  const v = {
    planLine: b.lessonStarted
      ? lockedNames.length
        ? `잠긴 구간 ${lockedNames.length}개(${lockedNames.join("·")}) → 첫 8분 함께 놓기`
        : "잠긴 구간이 없어요 · 바로 본시 수업"
      : planNames.length
        ? `수업 시작 때 80% 미만 구간이 잠겨요 · 지금 예상: ${planNames.join("·")}`
        : "지금은 잠길 구간이 없어요",
    planQ,
    teams: together?.type === "together_done" ? `정답 모둠 ${together.correctTeams}/5 · 이 숫자는 교사 화면에만` : "",
    secs,
    tide: mounted && lockedNow,
    headerLine: (
      <>
        2학년 3반 · 「국어의 문자 체계」 · 3교시 10:50 ·{" "}
        <b style={{ color: "#9B3A51" }}>{d.minutesToDeadline > 0 ? `오늘 밤 10시 돌 마감까지 ${d.minutesToDeadline}분` : d.minutesToLesson > 0 ? `어젯밤 10시 마감 · 수업까지 ${d.minutesToLesson}분` : "수업 중 · 어젯밤 10시 마감 기준"}</b> · 수업활동 › 성찰 「개념 말해보기」 {run.results.length}/{STUDENTS.length} 제출
      </>
    ),
    analyze,
    analyzing: runState === "running" || runState === "off",
    analyzeLabel: runState === "running" ? `${STUDENTS.length}명 읽는 중…` : runState === "off" ? "저장본 사용 중" : "AI 분석 다시 실행",
    startSlot: !mounted ? null : !b.lessonStarted ? (
      <button type="button" className="btn bp" onClick={startLesson}>
        수업 시작 <kbd style={{ opacity: 0.7, fontSize: 12 }}>T</kbd>
      </button>
    ) : lockedNow ? (
      <Link href="/class" className="btn bp">
        함께 놓기 시작 · 8분 → 교실 화면
      </Link>
    ) : d.step < 5 ? (
      <button type="button" className="btn bp" onClick={() => d.reach(5)}>
        함께 놓기 끝 · 다리 개통 <kbd style={{ opacity: 0.7, fontSize: 12 }}>N</kbd>
      </button>
    ) : d.step < 6 ? (
      <button type="button" className="btn bp" onClick={() => d.reach(6)}>
        개통 · 위에서 보기 <kbd style={{ opacity: 0.7, fontSize: 12 }}>N</kbd>
      </button>
    ) : (
      <button type="button" className="btn bs" onClick={() => d.reset()}>
        시연 처음부터 <kbd style={{ opacity: 0.7, fontSize: 12 }}>Shift+R</kbd>
      </button>
    ),
    toolbarSlot: (
      <div className="bx" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div aria-live="polite" aria-atomic="true" style={{ flex: "1 1 520px" }}>
          <p key={h.title} ref={titleRef} tabIndex={-1} className="serif animate-rise" style={{ margin: 0, fontSize: 28, fontWeight: 700, lineHeight: 1.35, outline: "none" }}>
            {mounted ? h.title : " "}
          </p>
          <p style={{ margin: "4px 0 0", fontSize: 15, color: "#4A4641" }}>{mounted ? h.sub : " "}</p>
          <p style={{ margin: "6px 0 0", fontSize: 13, fontWeight: 700, color: "#0E6F61" }}>AI는 학생 답을 읽고 · 규칙은 돌을 고르고 · 선생님이 정해요</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
          <LockStatus />
          {lock.open && (
            <button type="button" aria-pressed={showNames} onClick={() => setShowNames((x) => !x)} className="btn bg">
              {showNames ? "이름 가리기" : "이름도 보기"} <span style={{ color: "#6B665F", fontWeight: 500 }}>· 프로젝터에 띄울 땐 번호만</span>
            </button>
          )}
        </div>
      </div>
    ),
    noticeMeta: `${source}${agree}`,
    tideTitle: `${lockedNames.join("·")} 소나기 · 첫 8분 함께 놓기`,
    tideSub: `— 잠긴 구간 ${lockedNames.length}개 → ${lockedNames.length === 1 ? "O/X 1문항 + 해설" : lockedNames.length === 2 ? "구간마다 O/X 1문항" : "8분 + 본시 진도 조정 권장"}`,
    totalPlaced: b.placed,
    totalAll: b.total,
    arrived: b.arrived,
    students: b.students,
    crossingText: "지금 건너는 친구 있음 · 학생 화면엔 숫자 없음",
    top3Slot: (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <BlockedTop3 items={blocked} showNames={showNames && lock.open} startSections={startSections} onToggle={toggle} />
        {check.length > 0 && (
          <details style={{ border: "1px solid #ECE9E1", borderRadius: 12, padding: "8px 12px", fontSize: 15 }}>
            <summary style={{ cursor: "pointer", fontWeight: 700 }}>선생님이 직접 읽어야 할 답 {check.length}건 · 눌러서 보기</summary>
            <div style={{ marginTop: 4 }}>
              <LockGate what="AI가 판단을 미룬 답" ids={check.map((c) => c.student.id)}>
                <ul style={{ color: "#6B665F", margin: 0 }}>
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
        <VerifyNotice source={source} />
      </div>
    ),
    exceptionSlot: <ExceptionPanel events={d.events} showNames={showNames && lock.open} />,
    typeSlot: (
      <>
        <div style={{ display: "flex", height: 28, borderRadius: 8, overflow: "hidden", gap: 2 }} role="img" aria-label="유형 분포 8칸">
          {TYPES.map((t, i) => counts[i] > 0 && <i key={i} style={{ flex: counts[i], background: t.color }} />)}
        </div>
        <div className="num" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "6px 16px", fontSize: 13, color: "#4A4641" }}>
          {TYPES.map((t, i) => (
            <span key={i}>
              <i style={{ display: "inline-block", width: 10, height: 10, borderRadius: 3, background: t.color }} /> {t.p === "낮음" && t.e === "걸림돌" ? "낮아 보임" : t.p}·{t.r}·{t.e}{" "}
              {/* 잠긴 동안 1~2명 칸은 묶어서 보인다(특정 학생 추정 방지, handoff-screens 원칙 4) */}
              <b>{!lock.open && counts[i] > 0 && counts[i] <= 2 ? "1~2" : counts[i]}</b> · {t.stones}
            </span>
          ))}
        </div>
        <div className="num" style={{ display: "flex", flexWrap: "wrap", gap: 8, fontSize: 13 }}>
          {(["준비", "결손", "오개념", "경계"] as const).map((k) => (
            <span key={k} style={{ padding: "4px 10px", borderRadius: 999, background: k === "경계" ? "#FBF0D6" : "#F7F6F2", fontWeight: 700 }}>
              {k === "결손" ? "결손(아직 모름)" : k === "오개념" ? "오개념(틀린 생각)" : k === "경계" ? "경계 · 단정 안 함" : "준비"} {cell(rc[k])}
            </span>
          ))}
          <span style={{ padding: "4px 10px", borderRadius: 999, background: "#F7F6F2" }}>
            참여 낮음 · 이유 확인 전 {cell(pLow)} · 낮아 보임 · 환경 먼저 {cell(pEnv)}
          </span>
        </div>
        <details style={{ fontSize: 13, color: "#4A4641" }}>
          <summary style={{ cursor: "pointer", fontWeight: 700 }}>유형을 나누는 기준 5가지 · 이번 단원 가설이에요</summary>
          <ol style={{ margin: "6px 0 0", paddingLeft: 18, display: "grid", gap: 2 }}>
            {TYPE_PRINCIPLES.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ol>
          <p style={{ margin: "6px 0 0", color: "#6B665F" }}>
            확신은 지금은 AI가 답을 읽은 확신(0.65 미만이면 경계)으로 보고, 학생 스스로의 확신 문항은 파일럿에서 더해요. 유형은 학생에게 보이지 않고 단원이 끝나면 지워요.
          </p>
        </details>
      </>
    ),
    tab,
    tabsBar: (
      <div role="tablist" aria-label="예보 화면 고르기" className="console-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={tab === t.id ? "on" : ""}
          >
            <span className="t">{t.label}</span>
            <span className="s">{t.id === "except" ? `예외 ${exceptionCount}건 · 아침 확인` : t.id === "stuck" ? `TOP 3 · AI가 읽은 근거` : t.sub}</span>
          </button>
        ))}
      </div>
    ),
    aiSlot: (
      <>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>AI가 읽은 근거</h2>
          <span className="lb">키워드가 놓친 답을 AI가 찾은 예</span>
        </div>
        {runState === "off" && (
          <p role="status" style={{ margin: 0, fontSize: 13, color: "#6B665F" }}>
            배포 주소에서는 시연 전에 저장한 분석을 써요 · 다시 실행은 발표 노트북(로컬)에서만
          </p>
        )}
        {runState === "saved-only" && (
          <p role="status" style={{ margin: 0, fontSize: 13, color: "#6B665F" }}>
            {live ? "다시 부르지 못해서 직전 분석을 그대로 보여 줘요." : "지금은 AI를 부를 수 없어서 저장된 분석을 보여 줘요."}
          </p>
        )}
        <AiEvidence run={run} wins={wins.slice(0, 3)} total={wins.length} />
        <VerifyNotice source={source} />
      </>
    ),
    checkinSlot: null, // 11/14: 아침 교실 태블릿 체크인 없음(학교 지급 태블릿, 밤 10시 마감)
  };

  return <ConsoleView {...v} />;
}
