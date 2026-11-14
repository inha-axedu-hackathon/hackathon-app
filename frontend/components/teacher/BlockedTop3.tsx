// components/teacher/BlockedTop3.tsx — 막힌 지점 TOP 3 (오개념 단위, 인원). 펼치면 학생별 원문과 AI 근거 (T1, T4)
// 인원은 반 단위 집계라 늘 보이고, 펼친 학생 목록(번호·원문·근거)은 학생 정보 잠금(T7) 안에 있다.
// 사람의 관리·감독: 교사가 틀린 판단을 빼면 인원이 다시 세어진다(인공지능기본법 고영향 AI, SPEC 6-1 "최종은 교사")
import { useState } from "react";
import type { Blocked } from "@backend/lib/rules/forecast";
import type { Section } from "@backend/lib/types";
import { Highlight } from "./Highlight";
import { LockGate, LockIcon, useInfoLock } from "./InfoLock";

type Props = {
  items: Blocked[];
  showNames: boolean;
  startSections: Section[]; // 오늘 수업이 시작될 구간(80% 미만·잠김)
  onToggle: (key: string) => void; // key = "M1:s02"
};

export function BlockedTop3({ items, showNames, startSections, onToggle }: Props) {
  const lock = useInfoLock();
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(new Set()); // 펼친 항목만 열람 기록에 남긴다
  return (
    <ol className="flex flex-col gap-2">
      {items.slice(0, 3).map((m, i) => (
        <li key={m.id} className="rounded-xl border border-line bg-white">
          <details
            className="group"
            onToggle={(e) => {
              const isOpen = e.currentTarget.open;
              setExpanded((prev) => {
                const next = new Set(prev);
                if (isOpen) next.add(m.id);
                else next.delete(m.id);
                return next;
              });
            }}
          >
            <summary
              title={m.id}
              className="flex cursor-pointer list-none items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-paper-2 focus-visible:bg-paper-2 [&::-webkit-details-marker]:hidden"
            >
              <span className="tabular grid size-9 shrink-0 place-items-center rounded-full bg-ink text-base font-bold text-paper">{i + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-bold">{m.short}</span>
                <span className="flex flex-wrap items-center gap-1.5 text-sm text-mute">
                  <span className="rounded bg-paper-2 px-1.5 font-semibold text-ink">{m.section}</span> 구간에서 막혀요
                  {startSections.includes(m.section) && <span className="rounded bg-seal-soft px-1.5 font-semibold text-seal">오늘 수업 시작점</span>}
                </span>
              </span>
              <span className="tabular shrink-0 text-3xl font-bold">
                {m.count}
                <span className="text-base font-semibold text-mute">명</span>
              </span>
              <span className="flex shrink-0 items-center gap-1 rounded-full border border-line px-2.5 py-1 text-sm font-semibold text-water-deep group-open:bg-water-soft">
                {!lock.open && <LockIcon className="size-3.5" />}원문 <span className="inline-block transition-transform group-open:rotate-180">▾</span>
              </span>
            </summary>
            <div className="border-t border-line px-4 py-3">
              <LockGate
                what={`막힌 지점 「${m.short}」 원문·근거`}
                ids={m.students.map((s) => s.student.id)}
                log={expanded.has(m.id)}
                label={`${m.count}명의 원문·근거`}
              >
                <ul className="flex flex-col gap-2 text-base">
                  {m.students.map(({ student, evidence, text, dismissed }) => (
                    <li key={student.id} className={`flex items-start gap-3 ${dismissed ? "opacity-50" : ""}`}>
                      <span className="w-20 shrink-0 font-semibold">
                        {student.no}번{showNames ? ` ${student.name}` : ""}
                        <span className="block text-sm font-normal text-mute">{student.alias}</span>
                      </span>
                      <span className={`min-w-0 flex-1 ${dismissed ? "line-through" : ""}`}>
                        “<Highlight text={text} quote={evidence} />”
                      </span>
                      <button
                        type="button"
                        onClick={() => onToggle(`${m.id}:${student.id}`)}
                        className="shrink-0 rounded-lg border border-line px-2 py-1 text-sm hover:border-ink"
                      >
                        {dismissed ? "되돌리기" : "이 판단 빼기"}
                      </button>
                    </li>
                  ))}
                </ul>
              </LockGate>
            </div>
          </details>
        </li>
      ))}
    </ol>
  );
}
