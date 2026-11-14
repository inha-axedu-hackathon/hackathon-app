// components/class/BridgeScene.tsx — 우리 반 다리 그림 (담당: 신재우)
// 숫자를 그리지 않는다. 구간마다 돌 6개를 '날씨'에 맞춰 그릴 뿐이라, 칸 수나 남은 인원을 셀 수 없다 (SPEC 5-0)
import type { Section } from "@/lib/types";
import type { SectionState } from "@/lib/rules/bridge";

const W = 1200;
const SEC_X = [60, 430, 800]; // 구간 시작 x
const SEC_W = 340;
const STONES = 6;
const GAP = SEC_W / STONES;
const Y = 214; // 놓인 돌 높이

type Look = "solid" | "faint" | "under" | "rope";

/** 날씨 → 돌 6개의 모양. 비율이 아니라 날씨만 본다 */
function looks(s: SectionState, opened: boolean): Look[] {
  if (opened || s.weather === "맑음") {
    if (s.rope > 0 && !opened) return [...Array(3).fill("solid"), ...Array(3).fill("rope")];
    return Array(STONES).fill("solid");
  }
  if (s.weather === "구름") return [...Array(5).fill("solid"), "faint"];
  return [...Array(3).fill("solid"), ...Array(3).fill("under")];
}

export function BridgeScene({
  sections,
  opened,
  splash,
}: {
  sections: SectionState[];
  opened: boolean;
  splash: { section: Section; key: number } | null;
}) {
  return (
    <svg viewBox={`0 120 ${W} 240`} className="block h-auto w-full" role="img" aria-label="우리 반 다리 그림. 구간별 상태는 위의 날씨로 보여 줘요">
      <defs>
        <linearGradient id="river" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cfe6e8" />
          <stop offset="1" stopColor="#9fcbcf" />
        </linearGradient>
        <pattern id="waves" width="120" height="24" patternUnits="userSpaceOnUse">
          <path d="M0 12 Q30 2 60 12 T120 12" fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="2" />
        </pattern>
      </defs>

      {/* 강 */}
      <rect x="0" y="196" width={W} height="164" fill="url(#river)" />
      <g className="animate-wave">
        <rect x="0" y="232" width={W + 120} height="24" fill="url(#waves)" />
        <rect x="0" y="292" width={W + 120} height="24" fill="url(#waves)" opacity="0.7" />
      </g>

      {/* 양쪽 둑 */}
      <path d="M0 150 H48 Q58 196 40 360 H0 Z" fill="#e8e1d3" />
      <path d={`M${W} 150 H${W - 48} Q${W - 58} 196 ${W - 40} 360 H${W} Z`} fill="#e8e1d3" />
      <text x="22" y="140" textAnchor="middle" fontSize="18" fill="#6f6c66">출발</text>
      <text x={W - 26} y="140" textAnchor="middle" fontSize="18" fill="#6f6c66">수업</text>

      {sections.map((s, i) => {
        const x0 = SEC_X[i];
        const ls = looks(s, opened);
        const done = ls.every((l) => l === "solid");
        return (
          <g key={s.name}>
            {/* 다 이어진 구간은 상판이 생긴다 */}
            {done && <rect x={x0 + 10} y={Y - 26} width={SEC_W - 20} height="8" rx="4" fill="#b8a98f" className="animate-fade" />}
            {ls.map((l, j) => {
              const cx = x0 + GAP * j + GAP / 2;
              const cy = l === "under" ? Y + 26 : Y;
              return (
                <g key={j}>
                  <ellipse
                    cx={cx}
                    cy={cy}
                    rx="23"
                    ry="13"
                    fill={l === "rope" ? "#fafaf7" : l === "faint" ? "#cfc8bc" : "#8f8676"}
                    stroke={l === "rope" ? "#2f7f86" : "none"}
                    strokeWidth={l === "rope" ? 3 : 0}
                    strokeDasharray={l === "rope" ? "6 5" : undefined}
                    className={l === "rope" ? "animate-rise" : undefined}
                    style={l === "rope" ? { animationDelay: `${j * 120}ms` } : undefined}
                  />
                  {l === "rope" && <line x1={cx} y1={Y - 13} x2={cx} y2={Y - 60} stroke="#2f7f86" strokeWidth="2" strokeDasharray="4 4" />}
                </g>
              );
            })}
            {/* 잠긴 구간: 물이 돌 위로 덮이고 반짝인다 */}
            {s.locked && <rect x={x0 - 6} y={Y + 2} width={SEC_W + 12} height="56" rx="14" fill="#2f7f86" opacity="0.55" className="animate-shimmer" />}
            {splash?.section === s.name && (
              <circle
                key={splash.key}
                cx={x0 + SEC_W / 2}
                cy={Y}
                r="40"
                fill="none"
                stroke="#2f7f86"
                strokeWidth="5"
                className="animate-splash"
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
