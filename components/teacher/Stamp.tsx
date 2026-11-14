// components/teacher/Stamp.tsx — 붉은 승인 도장 (SPEC 5-1 T3). 인주색은 디자인 토큰 seal
export function Stamp({ time, animate = true }: { time: string; animate?: boolean }) {
  return (
    <div role="img" aria-label={`승인 도장 ${time}`} className="relative grid size-28 shrink-0 place-items-center">
      <style>{`@keyframes jg-stamp{0%{transform:scale(1.9) rotate(-9deg);opacity:0}55%{transform:scale(.94) rotate(-9deg);opacity:1}100%{transform:scale(1) rotate(-9deg);opacity:1}}`}</style>
      <div
        className="grid size-28 place-items-center rounded-full border-[5px] border-seal text-seal"
        style={{
          transform: "rotate(-9deg)",
          boxShadow: "inset 0 0 0 4px var(--color-paper), inset 0 0 0 6px var(--color-seal)",
          animation: animate ? "jg-stamp 420ms cubic-bezier(.2,.8,.2,1) both" : undefined,
        }}
      >
        <div className="text-center leading-tight">
          <p className="font-serif text-3xl font-black tracking-[0.2em]">승인</p>
          <p className="tabular text-xs font-bold">{time}</p>
        </div>
      </div>
    </div>
  );
}
