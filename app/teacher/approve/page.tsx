"use client";
// 교사 · 결재(아침 예외 확인) — 담당: 정환희, docs/SPEC.md 5-1 T3·T7
// 규칙 안 학생은 제출하자마자 열렸고, 규칙 밖 예외만 교사가 아침에 확인한다(약 3분).
// AI는 경로를 정하지 않는다: 규칙이 제안하고, 교사가 돌을 빼거나 더한 뒤 승인한다. 승인은 기록으로 남는다.
// 예외 근거는 특정 학생 정보라 잠겨 있고(T7), 열어서 근거를 본 뒤에만 결재할 수 있다(단축키 A도 같음).
import Link from "next/link";
import { useEffect, useState } from "react";
import { LockGate, LockIcon, LockStatus, useInfoLock } from "@/components/teacher/InfoLock";
import { Stamp } from "@/components/teacher/Stamp";
import { smallCell } from "@/components/teacher/ClassPanels";
import { STUDENTS } from "@/lib/rules/bridge";
import { RULE_SETS, TYPE_DEFS, charOf, nextStone, proposalFor, typeKey, typeOf } from "@/lib/rules/exceptions";
import { METHOD_LABEL, exceptions, hhmm, typeCounts } from "@/lib/rules/forecast";
import { useDemo } from "@/lib/store";
import type { StoneProgress } from "@/lib/types";

const STATE: Record<StoneProgress | "new", { label: string; cls: string }> = {
  placed: { label: "놓음", cls: "border-water bg-water-soft text-water-deep" },
  wet: { label: "막힘", cls: "border-seal bg-seal-soft text-ink" },
  paper: { label: "종이 돌", cls: "border-gold bg-gold/15 text-ink" },
  new: { label: "새로 더함", cls: "border-dashed border-ink bg-white text-ink" },
};

export default function ApprovePage() {
  const d = useDemo();
  const lock = useInfoLock();
  const list = exceptions(); // 번호순
  const [paths, setPaths] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(list.map(({ student }) => [student.id, student.path ?? []])),
  );
  const approved = [...d.events].reverse().find((e) => e.type === "approved");
  const original = (id: string) => STUDENTS.find((s) => s.id === id)?.path ?? [];
  const changed = (id: string) => (paths[id] ?? []).join() !== original(id).join();
  const edited = list.filter(({ student }) => changed(student.id)).length;
  const counts = typeCounts();
  const exceptionTypes = new Set(list.map(({ student }) => (student.type ? typeKey(student.type) : "")));
  const locked = Boolean(approved);

  function approve() {
    if (!lock.open || approved) return;
    const changes = list.filter(({ student }) => changed(student.id)).map(({ student }) => ({ studentId: student.id, path: paths[student.id] }));
    d.add({ type: "approved", who: "teacher", count: list.length, edited, changes });
  }

  // 단축키 A: 이 화면에서는 승인 버튼과 똑같이(잠겨 있으면 열기 창). 공용 단축키(무조건 승인)보다 먼저 받는다
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.code !== "KeyA" || e.metaKey || e.ctrlKey || e.altKey || e.isComposing) return;
      if ((e.target as HTMLElement | null)?.tagName === "INPUT") return;
      e.stopImmediatePropagation();
      e.stopPropagation();
      if (approved) return;
      if (!lock.open) return lock.request();
      const changes = list.filter(({ student }) => changed(student.id)).map(({ student }) => ({ studentId: student.id, path: paths[student.id] }));
      d.add({ type: "approved", who: "teacher", count: list.length, edited, changes });
    };
    window.addEventListener("keydown", on, true);
    return () => window.removeEventListener("keydown", on, true);
  });

  return (
    <main className="mx-auto flex min-h-dvh max-w-5xl flex-col gap-4 px-4 pt-5 pb-16 sm:px-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link href="/teacher" className="text-sm text-mute hover:text-ink">
            ← 오늘의 수업 예보
          </Link>
          <h1 className="text-2xl font-bold sm:text-3xl">결재 · 아침 예외 확인</h1>
        </div>
        <div className="flex flex-col items-end gap-1">
          <p className="tabular text-sm text-mute">2학년 3반 국어 · 지금 {d.now.slice(11, 16)}</p>
          <LockStatus />
        </div>
      </header>

      <section className="rounded-2xl border border-line bg-white px-5 py-4">
        <p className="text-lg">
          <b>규칙 안 {STUDENTS.length - list.length}명</b>은 어제 제출과 함께 징검런이 바로 열렸어요.{" "}
          <b className="text-seal">규칙 밖 예외 {list.length}건</b>만 확인해 주세요.
        </p>
        <p className="mt-1 text-base text-mute">AI는 경로를 정하지 않아요. 규칙이 제안하고, 선생님이 돌을 빼거나 더해서 정해요.</p>
        <details className="mt-3 text-sm">
          <summary className="cursor-pointer font-semibold">단원 시작 때 승인한 8유형 돌 세트 보기 (예비교사 설계)</summary>
          <div className="overflow-x-auto">
            <table className="tabular mt-2 w-full min-w-[44rem] text-left">
              <thead className="text-xs text-mute">
                <tr>
                  <th className="py-1 font-normal">유형 (참여 신호 · 선수 개념 · 학습 환경)</th>
                  <th className="py-1 font-normal">돌</th>
                  <th className="py-1 font-normal">지원</th>
                  <th className="py-1 text-right font-normal">인원</th>
                </tr>
              </thead>
              <tbody>
                {RULE_SETS.map((r) => {
                  const t = TYPE_DEFS[r.key];
                  return (
                    <tr key={r.key} className={`border-t border-line align-top ${lock.open && exceptionTypes.has(r.key) ? "bg-seal-soft" : ""}`}>
                      <td className="py-1 pr-2">
                        <b>{t.id}</b> {t.name}
                      </td>
                      <td className="py-1 pr-2 whitespace-nowrap">{r.stones}</td>
                      <td className="py-1 pr-2 text-mute">{t.support}</td>
                      <td className="py-1 text-right">{smallCell(counts.get(r.key) ?? 0, lock.open)}명</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-1 text-xs text-mute">참여 신호는 관찰한 제출·시도·SOS예요(의욕을 판정하지 않음). 걸림돌이 있으면 환경부터 풀어요.</p>
        </details>
      </section>

      <LockGate what={`결재: 예외 ${list.length}건 근거·경로`} ids={list.map(({ student }) => student.id)} label={`예외 ${list.length}건의 근거·경로`} rows={8}>
        <ol className="flex flex-col gap-3">
          {list.map(({ student, reason }) => {
            const p = proposalFor(student);
            const t = typeOf(student);
            const path = paths[student.id] ?? [];
            const add = nextStone(student, path);
            const ci = d.events.find((e) => e.type === "checked_in" && e.studentId === student.id);
            return (
              <li key={student.id} className="rounded-2xl border border-line bg-white p-4 sm:p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-lg font-bold">
                    {student.no}번 {student.name} <span className="text-sm font-normal text-mute">{student.alias}</span>
                  </h2>
                  <span className="rounded-full bg-seal-soft px-2.5 py-0.5 text-sm font-semibold text-seal">{reason}</span>
                </div>
                <p className="mt-2">
                  <span className="text-sm font-semibold text-mute">근거 </span>
                  {p.why}
                </p>
                {ci?.type === "checked_in" && (
                  <p className="mt-1 text-sm font-semibold text-water-deep">
                    {hhmm(ci.at)} 교실 태블릿에서 본인 확인({METHOD_LABEL[ci.method]}) · 그 태블릿에서 징검런을 열었어요
                  </p>
                )}
                <p className="mt-1">
                  <span className="text-sm font-semibold text-mute">오늘 할 일 </span>
                  {p.plan.join(" · ")}
                </p>
                {t && (
                  <p className="mt-1 text-sm text-mute">
                    유형 지원 · {t.support}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-mute">경로</span>
                  {path.map((id) => {
                    const st = STATE[student.progress?.[id] ?? "new"];
                    return (
                      <span key={id} className={`flex items-center gap-1 rounded-lg border px-2 py-1 ${st.cls}`}>
                        <b className="font-serif text-lg leading-none">{charOf(id)}</b>
                        <span className="text-xs">{st.label}</span>
                      </span>
                    );
                  })}
                  {!locked && (
                    <span className="ml-auto flex gap-2">
                      <button
                        type="button"
                        disabled={path.length <= 1}
                        onClick={() => setPaths((x) => ({ ...x, [student.id]: path.slice(0, -1) }))}
                        className="rounded-lg border border-line px-3 py-1.5 text-sm font-semibold hover:border-ink disabled:opacity-40"
                      >
                        − 돌 빼기
                      </button>
                      <button
                        type="button"
                        disabled={!add}
                        onClick={() => add && setPaths((x) => ({ ...x, [student.id]: [...path, add.id] }))}
                        className="rounded-lg border border-line px-3 py-1.5 text-sm font-semibold hover:border-ink disabled:opacity-40"
                      >
                        + 돌 더하기{add ? ` (${add.char})` : ""}
                      </button>
                    </span>
                  )}
                  {changed(student.id) && <span className="text-xs font-semibold text-seal">수정함</span>}
                </div>
              </li>
            );
          })}
        </ol>
      </LockGate>

      <section className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-white px-5 py-4" aria-live="polite">
        {approved?.type === "approved" ? (
          <>
            <Stamp time={hhmm(approved.at)} />
            <div>
              <p className="text-lg font-bold">결재했어요 · 오늘 수업은 다리가 끊긴 「병서」에서 시작해요</p>
              <p className="text-mute">
                2학년 3반 국어 교사 · {hhmm(approved.at)} · 예외 {approved.count}건 승인
                {approved.edited ? ` · 경로 ${approved.edited}건 수정` : " · 경로 수정 없음"}
              </p>
              <p className="mt-1 text-xs text-mute">결재 기록은 학년도 말까지 보관해요(학생 글은 넣지 않아요).</p>
            </div>
            <Link href="/teacher" className="ml-auto rounded-lg border border-ink px-4 py-2 font-semibold hover:bg-ink hover:text-paper">
              수업 예보로
            </Link>
          </>
        ) : lock.open ? (
          <>
            <p className="text-mute">
              예외 {list.length}건 · {edited ? `경로 ${edited}건 수정함` : "제안 그대로"}
            </p>
            <button
              type="button"
              onClick={approve}
              aria-keyshortcuts="A"
              className="ml-auto rounded-xl bg-seal px-6 py-3 text-lg font-bold text-white hover:bg-seal/90"
            >
              승인
            </button>
          </>
        ) : (
          <>
            <p className="text-mute">근거를 본 뒤에 결재할 수 있어요</p>
            <button
              type="button"
              onClick={lock.request}
              className="ml-auto flex items-center gap-1.5 rounded-xl border-2 border-ink px-5 py-3 text-lg font-bold hover:bg-paper-2"
            >
              <LockIcon /> 학생 정보 열고 결재하기
            </button>
          </>
        )}
      </section>
    </main>
  );
}
