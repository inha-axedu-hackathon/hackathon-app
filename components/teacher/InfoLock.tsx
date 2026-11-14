"use client";
// components/teacher/InfoLock.tsx — 학생 정보 잠금 (SPEC 5-1 T7, 시연은 모의 인증)
// 반 단위 집계(구간 숫자, TOP 3 인원, 일치율)는 그대로 보이고, 특정 학생이 드러나는 정보(번호·이름 목록, 말해보기 원문,
// 근거 구절, 예외 근거)는 잠근다. 교사가 얼굴 1초(슈퍼패스) 또는 비밀번호로 열면(같은 효력) 10분 열리고, 교사 화면을 떠나면 다시 잠긴다.
// 얼굴은 학생을 보는 데 쓰지 않고, 학생 정보를 여는 교사 본인을 확인하는 데만 쓴다. 누가·언제·어느 학생·무엇을·방법을 기록한다.
// 시연에서는 화면만 가린다(데이터는 브라우저에 있음). 실제 도입은 서버가 재인증을 확인한 뒤에만 학생별 정보를 보낸다.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { hhmm, studentOf } from "@/lib/rules/forecast";
import { demo, useDemo } from "@/lib/store";

const OPEN_MS = 10 * 60_000;
type Method = "face" | "password";
type Lock = { open: boolean; left: number; request: () => void; lock: () => void; view: (what: string, ids: string[]) => void };
const LockCtx = createContext<Lock>({ open: false, left: 0, request: () => {}, lock: () => {}, view: () => {} });

export const useInfoLock = () => useContext(LockCtx);

export function InfoLockProvider({ children }: { children: ReactNode }) {
  const [until, setUntil] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [asking, setAsking] = useState(false);
  const seen = useRef(new Set<string>()); // 이번에 열린 동안 이미 기록한 항목

  useEffect(() => {
    if (until === null) return;
    const t = setInterval(() => {
      const n = Date.now();
      setNow(n);
      if (n >= until) setUntil(null); // 10분이 지나면 다시 잠금
    }, 1000);
    return () => clearInterval(t);
  }, [until]);

  const open = until !== null && now < until;

  // 시연 단축키 A(승인)가 잠금을 건너뛰지 않게: 잠겨 있으면 승인 대신 열기 창 (결재 화면은 자기 처리기가 먼저 받는다)
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.code !== "KeyA" || open || e.metaKey || e.ctrlKey || e.altKey || e.isComposing) return;
      if ((e.target as HTMLElement | null)?.tagName === "INPUT") return;
      e.stopPropagation();
      setAsking(true);
    };
    window.addEventListener("keydown", on, true);
    return () => window.removeEventListener("keydown", on, true);
  }, [open]);

  const grant = useCallback((method: Method) => {
    const n = Date.now();
    seen.current = new Set();
    setNow(n);
    setUntil(n + OPEN_MS);
    setAsking(false);
    demo.add({ type: "info_opened", who: "teacher", method });
  }, []);
  const close = useCallback(() => setAsking(false), []);
  const view = useCallback((what: string, ids: string[]) => {
    if (seen.current.has(what)) return;
    seen.current.add(what);
    demo.add({ type: "info_viewed", who: "teacher", what, studentIds: ids });
  }, []);
  const value = useMemo<Lock>(
    () => ({
      open,
      left: open && until ? Math.max(0, Math.ceil((until - now) / 1000)) : 0,
      request: () => setAsking(true),
      lock: () => setUntil(null),
      view,
    }),
    [open, until, now, view],
  );

  return (
    <LockCtx.Provider value={value}>
      {children}
      {asking && <UnlockDialog onGrant={grant} onClose={close} />}
    </LockCtx.Provider>
  );
}

export function LockIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className} fill="currentColor">
      <path d="M5 7V5a3 3 0 0 1 6 0v2h.5A1.5 1.5 0 0 1 13 8.5v5A1.5 1.5 0 0 1 11.5 15h-7A1.5 1.5 0 0 1 3 13.5v-5A1.5 1.5 0 0 1 4.5 7H5Zm1.5 0h3V5a1.5 1.5 0 0 0-3 0v2Z" />
    </svg>
  );
}

/**
 * 잠긴 동안에는 "보호 중" 자리표시와 [열기]를, 열리면 내용을 보여 준다.
 * log=true면 열린 상태로 보일 때 열람을 한 번 기록한다(펼침 목록은 펼쳤을 때만 log=true로 넘긴다).
 */
export function LockGate({
  what,
  ids,
  children,
  log = true,
  label,
  rows = 2,
}: {
  what: string;
  ids: string[];
  children: ReactNode;
  log?: boolean;
  label?: string;
  rows?: number;
}) {
  const { open, view, request } = useInfoLock();
  const key = ids.join();
  useEffect(() => {
    if (open && log) view(what, key ? key.split(",") : []);
  }, [open, view, log, what, key]);
  if (open) return <>{children}</>;
  return (
    <div className="relative overflow-hidden rounded-xl border border-line bg-paper-2" style={{ minHeight: rows * 28 + 24 }}>
      <div aria-hidden="true" className="flex flex-col gap-1.5 p-3 blur-[3px] select-none">
        {Array.from({ length: rows }, (_, i) => (
          <span key={i} className="h-3 rounded bg-ink/10" style={{ width: `${80 - (i % 3) * 15}%` }} />
        ))}
      </div>
      <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-3 text-center">
        <span>
          <span className="flex items-center justify-center gap-1 text-base font-semibold">
            <LockIcon /> {label ?? "학생 정보"} · 보호 중
          </span>
          <span className="block text-sm text-mute">특정 학생이 드러나는 정보라 선생님 확인 뒤에 보여요</span>
        </span>
        <button type="button" onClick={request} className="rounded-lg bg-ink px-3 py-1.5 font-semibold text-paper hover:bg-ink/85">
          열기
        </button>
      </div>
    </div>
  );
}

/** 헤더용: 잠김/열림 상태 + 남은 시간 + 내 열람 기록 */
export function LockStatus() {
  const lock = useInfoLock();
  const d = useDemo();
  const log = d.events.filter((e) => e.type === "info_opened" || e.type === "info_viewed");
  const mm = `${Math.floor(lock.left / 60)}:${String(lock.left % 60).padStart(2, "0")}`;
  return (
    <div className="flex flex-wrap items-center justify-end gap-2 text-sm">
      {lock.open ? (
        <>
          <span className="tabular rounded-full bg-water-soft px-2.5 py-1 font-semibold text-water-deep">학생 정보 열림 · {mm} 남음</span>
          <button type="button" onClick={lock.lock} className="rounded-lg border border-line px-2.5 py-1 hover:border-ink">
            지금 잠그기
          </button>
        </>
      ) : (
        <button type="button" onClick={lock.request} className="flex items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 font-semibold text-paper hover:bg-ink/85">
          <LockIcon /> 학생 정보 보기 <span className="font-normal text-paper/70">얼굴 또는 비밀번호</span>
        </button>
      )}
      <details className="relative">
        <summary className="cursor-pointer list-none rounded-lg border border-line px-2.5 py-1 hover:border-ink [&::-webkit-details-marker]:hidden">
          내 열람 기록 {log.length}
        </summary>
        <ol className="absolute right-0 z-30 mt-1 w-96 max-w-[90vw] rounded-xl border border-line bg-white p-3 text-left shadow-lg">
          {log.length === 0 && <li className="text-mute">아직 없어요</li>}
          {log.map((e, i) => (
            <li key={i} className="tabular border-t border-line py-1 first:border-0">
              {hhmm(e.at)} · 2학년 3반 국어 교사 ·{" "}
              {e.type === "info_opened"
                ? `${e.method === "face" ? "얼굴" : "비밀번호"}로 학생 정보 열기`
                : `${e.what}${e.studentIds.length ? ` · ${e.studentIds.map((id) => `${studentOf(id)?.no ?? "?"}번`).join(" ")}` : ""}`}
            </li>
          ))}
          <li className="mt-1 text-xs text-mute">
            누가·언제·어느 학생(번호)·무엇을·방법만 남겨요. 학생 글은 넣지 않아요. 시연은 이 브라우저에만 저장하고, 실제로는 학교 서버에 지울 수 없게
            보관해요.
          </li>
        </ol>
      </details>
    </div>
  );
}

function UnlockDialog({ onGrant, onClose }: { onGrant: (m: Method) => void; onClose: () => void }) {
  const [phase, setPhase] = useState<"choose" | "face" | "password">("choose");
  const [pw, setPw] = useState("");
  const box = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);

  // 포커스: 열릴 때 제목으로, 닫힐 때 원래 자리로. 창이 떠 있는 동안 Tab은 창 안에서만, 시연 단축키는 멈춤
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    title.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab" || !box.current) return;
      const f = [...box.current.querySelectorAll<HTMLElement>("button:not([disabled]),input")];
      if (f.length === 0) return e.preventDefault();
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      prev?.focus?.();
    };
  }, [onClose]);
  useEffect(() => {
    if (phase !== "face") return;
    title.current?.focus();
    const t = setTimeout(() => onGrant("face"), 1100); // 모의: 슈퍼패스 얼굴 확인 1초
    return () => clearTimeout(t);
  }, [phase, onGrant]);

  const choice = "flex flex-col items-center gap-1 rounded-xl border-2 border-ink bg-white px-3 py-4 hover:bg-paper-2";
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 px-4" onClick={onClose}>
      <div
        ref={box}
        role="dialog"
        aria-modal="true"
        aria-labelledby="unlock-h"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2 id="unlock-h" ref={title} tabIndex={-1} className="text-xl font-bold outline-none">
          학생 정보 보기
        </h2>
        <p className="mt-1 text-base text-mute">학생 한 명 한 명이 드러나는 정보라서, 여는 사람이 선생님 본인인지 한 번 더 확인해요.</p>
        {phase === "choose" && (
          <>
            <p className="mt-4 text-sm font-semibold">둘 중 편한 방법 하나 · 어느 쪽이든 똑같이 10분 열려요</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setPhase("face")} className={choice}>
                <span className="text-lg font-semibold">얼굴</span>
                <span className="text-sm text-mute">슈퍼패스가 확인 · 1초</span>
              </button>
              <button type="button" onClick={() => setPhase("password")} className={choice}>
                <span className="text-lg font-semibold">비밀번호</span>
                <span className="text-sm text-mute">교사 계정 비밀번호</span>
              </button>
            </div>
          </>
        )}
        {phase === "face" && (
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-water-soft px-4 py-3" role="status">
            <svg viewBox="0 0 48 48" className="size-12 animate-shimmer text-water-deep" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <rect x="4" y="4" width="40" height="40" rx="12" />
              <circle cx="18" cy="21" r="2" fill="currentColor" />
              <circle cx="30" cy="21" r="2" fill="currentColor" />
              <path d="M17 31c4 3 10 3 14 0" />
            </svg>
            <p className="text-base font-semibold text-water-deep">슈퍼패스로 선생님 얼굴 확인 중…</p>
          </div>
        )}
        {phase === "password" && (
          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (pw.length >= 4) onGrant("password");
            }}
          >
            <label className="sr-only" htmlFor="unlock-pw">
              비밀번호
            </label>
            <input
              id="unlock-pw"
              name="demo-pin"
              type="password"
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="시연용 숫자 4자리 (저장·전송하지 않아요)"
              className="min-w-0 flex-1 rounded-lg border border-line px-3 py-2 text-base"
            />
            <button type="submit" disabled={pw.length < 4} className="rounded-lg bg-ink px-4 py-2 font-semibold text-paper disabled:opacity-40">
              열기
            </button>
          </form>
        )}
        <p className="mt-4 text-sm text-mute">
          10분 뒤나 교사 화면을 떠나면 다시 잠겨요. 얼굴은 슈퍼패스(토스)가 처리하고 징검다리에는 &quot;본인 맞음·방법·시각&quot;만 와요. 얼굴로 학생을 보지
          않아요. 시연에서는 화면만 가려요. 실제로는 서버가 확인한 뒤에만 학생 정보를 보내요.
        </p>
        <button type="button" onClick={onClose} className="mt-3 text-sm text-mute underline">
          닫기
        </button>
      </div>
    </div>
  );
}
