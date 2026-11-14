"use client";
// components/teacher/StudentTypeModal.tsx — 학생 한 명의 8유형 자리 (교사 화면 전용, SPEC 8-1-1·8-1-2)
// 「오늘 현황」 구간 카드 → 학생 명단 → [학생 유형 보기]로 연다. 3D 공간에서 그 학생의 점과, 세 축 스펙트럼 막대를 함께 보여 준다.
// 칸은 규칙이 정한 유형, 칸 안의 위치는 관찰 근거가 얼마나 뚜렷한지(lib/rules/typePosition.ts). 다른 학생은 익명 점으로만.
import { useEffect, useRef } from "react";
import { TYPE_INFO, TypeSpace3D, keyOf, type TypeCell, type TypePoint } from "@/components/teacher/TypeSpace3D";
import { VerifyNotice } from "@/components/teacher/VerifyNotice";
import { GuidePanel } from "@/components/teacher/GuidePanel";
import type { TypePosition } from "@/lib/rules/typePosition";
import type { TypeHypothesis } from "@/lib/rules/typeRules";
import type { Student } from "@/lib/types";
import "./typespace.css";

const READY_WORD: Record<TypeHypothesis["readiness"], string> = {
  준비: "준비",
  결손: "결손 · 아직 모름",
  오개념: "오개념 · 틀린 생각",
  경계: "경계 · 단정 안 함",
};

export function StudentTypeModal({
  student,
  showName,
  pos,
  hyp,
  cells,
  classPoints,
  stones,
  misconceptions,
  source,
  onClose,
  onPrev,
  onNext,
  index,
  count,
}: {
  student: Student;
  showName: boolean;
  pos: TypePosition;
  hyp: TypeHypothesis;
  cells: TypeCell[];
  classPoints: TypePoint[];
  stones: string;
  /** AI가 읽은 오개념 ID (제시 방향에 씀) */
  misconceptions: string[];
  source: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  index: number;
  count: number;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const closeFn = useRef(onClose);
  useEffect(() => {
    closeFn.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        closeFn.current();
      } else if (e.key === "Tab" && boxRef.current) {
        // 모달 안에서만 Tab이 돌게
        const f = boxRef.current.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey, true);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = overflow;
      prev?.focus?.();
    };
  }, []);

  const who = `${student.no}번${showName ? ` ${student.name}` : ""}`;
  const t = student.type ?? { participation: "있음", readiness: "준비", environment: "양호" };
  const k = keyOf({ p: t.participation, r: t.readiness, e: t.environment });
  const info = TYPE_INFO[k];
  const pLabel = pos.axes[0].side;

  return (
    <div className="stm-back" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={boxRef} className="stm" role="dialog" aria-modal="true" aria-labelledby="stm-title">
        <header className="stm-head">
          <div>
            <p className="stm-kicker">학생 유형 · 이번 단원 가설</p>
            <h2 id="stm-title">
              {who}
              {!showName && <span className="stm-hide"> · 이름 가림</span>}
            </h2>
          </div>
          <div className="stm-nav">
            <button type="button" onClick={onPrev} disabled={!onPrev} aria-label="이전 학생">
              ‹ 이전
            </button>
            <span className="num">
              {index + 1}/{count}
            </span>
            <button type="button" onClick={onNext} disabled={!onNext} aria-label="다음 학생">
              다음 ›
            </button>
            <button ref={closeRef} type="button" className="stm-x" onClick={onClose} aria-label="닫기">
              ✕
            </button>
          </div>
        </header>

        <div className="stm-body">
          <TypeSpace3D compact cells={cells} total={count} points={classPoints} me={{ x: pos.x, y: pos.y, z: pos.z, label: `${student.no}번` }} />

          <div className="stm-side">
            <section className="stm-card" style={{ borderColor: t.environment === "양호" ? "#BFE3DA" : "#F1D2BE" }}>
              <span className="stm-tag" style={{ background: t.environment === "양호" ? "#1E9E87" : "#D9814F" }}>
                환경 {t.environment} · {t.environment === "양호" ? "앞쪽" : "뒤쪽"}
              </span>
              <p className="stm-oct">
                참여 {pLabel} · 선수 개념 {t.readiness} · 환경 {t.environment}
              </p>
              <p className="stm-who">{info.who}</p>
              <p className="stm-act">
                <b>기본 개입</b>
                {info.act}
              </p>
              <p className="stm-meta">
                경로 규칙 · <b>{stones}</b> · 답 상태 <b>{READY_WORD[hyp.readiness]}</b>
              </p>
            </section>

            <section aria-label="세 축 스펙트럼" className="stm-axes">
              {pos.axes.map((a) => (
                <div key={a.axis} className="stm-axis">
                  <div className="stm-axis-top">
                    <b>{a.axis}</b>
                    <span>
                      {a.side} 쪽 · <em className={a.strength < 0.3 ? "edge" : ""}>{a.word}</em>
                    </span>
                  </div>
                  <div className="stm-bar" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(a.value * 100)} aria-label={`${a.axis}: ${a.ends[0]}에서 ${a.ends[1]} 사이, ${a.side} 쪽 ${a.word}`}>
                    <i className="mid" />
                    <i className="dot" style={{ left: `${a.value * 100}%` }} />
                  </div>
                  <div className="stm-ends">
                    <span>{a.ends[0]}</span>
                    <span>경계</span>
                    <span>{a.ends[1]}</span>
                  </div>
                  <ul>
                    {a.why.map((w) => (
                      <li key={w}>{w}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>

            <GuidePanel
              input={{
                participation: pos.axes[0].value,
                readinessValue: pos.axes[1].value,
                environment: pos.axes[2].value,
                pStrength: pos.axes[0].strength,
                rStrength: pos.axes[1].strength,
                eStrength: pos.axes[2].strength,
                participationSide: pos.axes[0].side as "있음" | "낮음" | "낮아 보임",
                readiness: hyp.readiness,
                misconceptions,
                barriers: student.signals.barriers,
              }}
            />

            {hyp.borderline && <p className="stm-border">경계인 까닭: {hyp.borderline} · 선생님이 직접 읽어 주세요</p>}
            <p className="stm-note">칸은 규칙이 정한 유형이고, 칸 안의 위치는 관찰한 근거가 얼마나 뚜렷한지예요. 학생에게 보이지 않고 단원이 끝나면 지워요.</p>
            <VerifyNotice source={source} />
          </div>
        </div>
      </div>
    </div>
  );
}
