"use client";
// components/student/TitleBadge.tsx — 칭호 배지 (학생 화면, docs/GAMIFICATION.md 3-8)
// 집현전 사다리(첫걸음 학생 → 견습생 → 학사 → 학자 → 대제학 → 영전사)마다 테두리가 다르다.
// 점수·순위·연속 기록은 없다. 사다리에서 내 자리만 보여 준다(친구와 비교하지 않음).
import "./title-badge.css";

export const TITLE_LADDER = ["첫걸음 학생", "집현전 견습생", "집현전 학사", "집현전 학자", "대제학", "영전사"] as const;
const TIER_CLASS = ["t0", "t1", "t2", "t3", "t4", "t5"] as const;
const TIER_WORD = ["나무 테", "구리 테", "은 테", "금 테", "옥 테", "옥새 테"] as const;
const HANJA = ["初", "徒", "士", "學", "提", "璽"] as const;

export function TitleBadge({ name, size = "md", next }: { name: string; size?: "md" | "lg"; next?: string }) {
  const i = Math.max(0, TITLE_LADDER.indexOf(name as (typeof TITLE_LADDER)[number]));
  const upcoming = TITLE_LADDER[i + 1];
  return (
    <div className={`tb ${TIER_CLASS[i]} ${size}`} aria-label={`내 칭호 ${name}, ${TIER_WORD[i]}`}>
      <div className="tb-frame">
        <span className="tb-seal serif" aria-hidden="true">
          {HANJA[i]}
        </span>
        <div className="tb-body">
          <span className="tb-name serif">
            {name} <span className="tb-kicker">{TIER_WORD[i]}</span>
          </span>
          <div className="tb-foot">
          <ol className="tb-ladder" aria-label="집현전 사다리">
            {TITLE_LADDER.map((t, k) => (
              <li key={t} className={k < i ? "past" : k === i ? "now" : ""} title={t}>
                <span className="sr-only">{t}{k === i ? " (지금)" : ""}</span>
              </li>
            ))}
          </ol>
          {upcoming && (
            <span className="tb-next" title={next ? `${next} ${upcoming}` : undefined}>
              다음 · {upcoming}
            </span>
          )}
          </div>
        </div>
        {i >= 3 && <span className="tb-shine" aria-hidden="true" />}
      </div>
      {next && upcoming && <span className="sr-only">{next} {upcoming}</span>}
    </div>
  );
}
