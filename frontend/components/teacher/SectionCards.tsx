// components/teacher/SectionCards.tsx — 구간 3개(상형·가획·병서)의 날씨와 정확한 숫자 (교사만, SPEC 5-0)
// 잠김은 색만이 아니라 배지 글자로도 알린다. 막대의 세로선은 잠김 기준 80%
import { WeatherIcon } from "@/components/class/WeatherIcon";
import type { BridgeState } from "@backend/lib/rules/bridge";

const BAR: Record<string, string> = { 맑음: "bg-water", 구름: "bg-water/60", 먹구름: "bg-storm", 소나기: "bg-seal" };

export function SectionCards({ b, animate = true }: { b: BridgeState; animate?: boolean }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-3" aria-label="구간별 놓인 돌">
      {b.sections.map((s) => {
        const shown = s.placed + s.rope;
        const pct = Math.round((shown / Math.max(s.total, 1)) * 100);
        const left = s.total - shown;
        const toLine = Math.max(0, Math.ceil(s.total * 0.8) - shown);
        const weak = !s.locked && pct < 80;
        const state = s.locked
          ? "잠김 · 첫 8분 함께 놓기로 메워요"
          : s.rope > 0
            ? `밧줄 돌 ${s.rope}칸 · 수업 뒤 주인이 굳혀요`
            : left === 0
              ? "다 이어짐"
              : weak
                ? `기준 80%까지 ${toLine}칸 · 못 채우면 수업 때 잠겨요`
                : `${left}칸 남음 · 개통 가능`;
        const frame = s.locked ? "border-2 border-seal ring-4 ring-seal/15" : weak ? "border-2 border-storm" : "border border-line";
        return (
          <li key={s.name} className={`rounded-2xl bg-white p-4 ${frame}`}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="flex items-center gap-2 text-xl font-bold">
                  {s.name}
                  {s.locked && <span className="rounded-full bg-seal px-2.5 py-0.5 text-sm font-bold text-white">잠김</span>}
                </h3>
                <p className="text-base text-mute">{s.weather}</p>
              </div>
              <WeatherIcon weather={s.weather} size={48} />
            </div>
            <p className="tabular mt-2 text-4xl font-bold">
              {shown}
              <span className="text-xl font-semibold text-mute">/{s.total}</span>
              <span className="ml-2 text-lg font-semibold text-mute">{pct}%</span>
            </p>
            <div
              className="relative mt-2 h-3 overflow-hidden rounded-full bg-paper-2"
              role="progressbar"
              aria-label={`${s.name} 놓인 돌`}
              aria-valuemin={0}
              aria-valuemax={s.total}
              aria-valuenow={shown}
              aria-valuetext={`${s.total}칸 중 ${shown}칸 (${pct}%)`}
            >
              <div className={`h-full rounded-full ${animate ? "transition-[width] duration-700" : ""} ${BAR[s.weather]}`} style={{ width: `${pct}%` }} />
              <span aria-hidden="true" className="absolute inset-y-0 left-[80%] w-0.5 bg-ink/50" />
            </div>
            <p className={`mt-2 text-base ${s.locked ? "font-bold text-seal" : weak ? "font-semibold text-ink" : "text-mute"}`}>{state}</p>
          </li>
        );
      })}
    </ul>
  );
}
