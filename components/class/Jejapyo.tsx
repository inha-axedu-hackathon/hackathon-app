// components/class/Jejapyo.tsx — 개통한 다리를 위에서 보면 훈민정음 자음 제자표 (C4, 시그니처 마지막 장면)
// 줄 = 소리 갈래 = 모둠(1 어금닛 · 2 혓 · 3 입술 · 4 잇 · 5 목구멍), 칸 = 상형 · 가획 · 병서
import { EXPLAIN } from "@/components/student/stones";
import { STONES } from "@/lib/content";

const ROWS = ["어금닛소리", "혓소리", "입술소리", "잇소리", "목구멍소리"];
const COLS = ["상형", "가획", "병서"] as const;

export function Jejapyo() {
  return (
    <figure className="animate-fade mx-auto w-full max-w-4xl">
      <div className="grid grid-cols-[9rem_repeat(3,1fr)] overflow-hidden rounded-2xl border border-line bg-white text-center">
        <div className="bg-paper-2 py-3" />
        {COLS.map((c) => (
          <div key={c} className="bg-paper-2 py-3 text-2xl font-bold text-ink">
            {c}
          </div>
        ))}
        {ROWS.map((row, r) => (
          <Row key={row} name={row} team={r + 1} delay={r * 140} />
        ))}
      </div>
      <figcaption className="mt-5 text-center">
        <p className="text-3xl font-bold">세종이 만든 자음 설계도</p>
        <p className="mt-2 text-lg text-mute">다섯 모둠이 한 줄씩 놓은 다리를 위에서 보면, 훈민정음 자음 제자표가 돼요.</p>
        <p className="mt-1 text-lg text-mute">이체자 ㆁ ㄹ ㅿ는 다음 시간에 만나요</p>
        <p className="mt-1 text-sm text-mute">출처: {EXPLAIN.source}</p>
      </figcaption>
    </figure>
  );
}

function Row({ name, team, delay }: { name: string; team: number; delay: number }) {
  return (
    <>
      <div className="flex items-center justify-center border-t border-line py-3 text-xl font-semibold text-ink">{name}</div>
      {COLS.map((c) => (
        <div
          key={c}
          className="animate-rise flex items-center justify-center gap-3 border-t border-l border-line py-3 font-serif text-4xl"
          style={{ animationDelay: `${delay}ms` }}
        >
          {STONES.filter((s) => s.team === team && s.section === c).map((s, i, arr) => (
            <span key={s.id} className="flex items-center gap-3">
              <span className="grid h-14 w-20 place-items-center rounded-[50%] bg-[#8f8676] text-white shadow-sm">{s.char}</span>
              {c === "가획" && i < arr.length - 1 && <span className="text-2xl text-mute" aria-hidden="true">→</span>}
            </span>
          ))}
        </div>
      ))}
    </>
  );
}
