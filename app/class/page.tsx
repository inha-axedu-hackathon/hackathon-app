"use client";
// 교실 화면 · 우리 반 다리 (담당: 신재우) — docs/SPEC.md 5-0, 5-3 C1~C4, 7-5
// 프로젝터용 16:9. 반·모둠·친구의 숫자는 쓰지 않고 날씨로만 말한다. 숫자는 교사 화면에만.
import { useEffect, useMemo, useRef, useState } from "react";
import { BridgeScene } from "@/components/class/BridgeScene";
import { Jejapyo } from "@/components/class/Jejapyo";
import { Together } from "@/components/class/Together";
import { WEATHER_TEXT, WeatherIcon } from "@/components/class/WeatherIcon";
import { STONES } from "@/lib/content";
import { bridgeState, type SectionState } from "@/lib/rules/bridge";
import { useDemo } from "@/lib/store";
import type { Section } from "@/lib/types";

const SECTION_OF = new Map<string, Section>(STONES.map((s) => [s.id, s.section as Section]));

function forecast(sections: SectionState[]): string {
  const cloudy = sections.filter((s) => s.weather !== "맑음");
  if (cloudy.length === 0) return "모든 구간이 맑아요";
  return cloudy.map((s) => `${s.name}에 ${s.weather === "구름" ? "구름이 조금" : "먹구름이"}`).join(", ") + " 끼어 있어요";
}

export default function ClassPage() {
  const d = useDemo();
  const b = useMemo(() => bridgeState(d.events), [d.events]);
  const locked = b.sections.filter((s) => s.locked).map((s) => s.name);

  // 새 돌이 놓이면 그 구간에 "첨벙"
  const placedEvents = d.events.filter((e) => e.type === "stone_placed");
  const placedCount = placedEvents.length;
  const lastPlaced = placedEvents[placedCount - 1];
  const lastSection = lastPlaced?.type === "stone_placed" ? SECTION_OF.get(lastPlaced.stoneId) : undefined;
  const seen = useRef(-1);
  const mountedAt = useRef(0);
  const [splash, setSplash] = useState<{ section: Section; key: number } | null>(null);
  const [toast, setToast] = useState(false);
  useEffect(() => {
    if (seen.current === -1) {
      seen.current = placedCount; // 처음 그릴 때는 효과 없음
      mountedAt.current = performance.now();
      return;
    }
    // 새로고침 직후 저장본을 불러오며 늘어난 것은 첨벙이 아니다
    const fresh = performance.now() - mountedAt.current > 800;
    if (placedCount > seen.current && fresh) {
      // 다른 탭(학생 화면)에서 온 외부 이벤트에 맞춰 효과를 한 번 켠다
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (lastSection) setSplash({ section: lastSection, key: placedCount });
      setToast(true);
    }
    seen.current = placedCount;
  }, [placedCount, lastSection]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(false), 2600);
    return () => clearTimeout(t);
  }, [toast, splash]);

  const phase = d.step >= 6 ? "top" : b.opened ? "opened" : b.together ? "rope" : b.lessonStarted ? "tide" : "before";

  return (
    <main className="mx-auto flex min-h-dvh max-w-[1400px] flex-col gap-5 px-8 py-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-lg text-mute">2학년 3반 · 국어 · 국어의 문자 체계</p>
          <h1 className="mt-1 text-4xl font-bold tracking-tight">우리 반 다리</h1>
        </div>
        <p className="tabular rounded-full bg-white px-5 py-2 text-xl font-semibold shadow-sm ring-1 ring-line">
          {phase === "before" && `수업까지 ${Math.max(0, d.minutesToLesson)}분`}
          {phase === "tide" && "물때 · 수업 시작"}
          {phase === "rope" && "함께 놓기 끝"}
          {(phase === "opened" || phase === "top") && "개통"}
        </p>
      </header>

      {phase === "top" ? (
        <Jejapyo />
      ) : (
        <>
          <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-sm">
            <div className="grid grid-cols-3 gap-4 px-[5%] pt-5">
              {b.sections.map((s) => (
                <div key={s.name} role="group" className="flex items-center justify-center gap-3" aria-label={`${s.name} 구간 ${s.weather}`}>
                  <WeatherIcon weather={s.weather} size={64} />
                  <div>
                    <p className="text-2xl font-bold">{s.name}</p>
                    <p className={s.locked ? "text-2xl font-semibold text-water" : "text-2xl text-ink"}>
                      {s.weather} · {s.rope > 0 && !b.opened ? "밧줄로 이었어요" : WEATHER_TEXT[s.weather]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <BridgeScene sections={b.sections} opened={b.opened} splash={splash} />
          </div>

          {phase === "before" && (
            <p className="text-center text-3xl">
              오늘의 예보 · <span className="font-semibold">{forecast(b.sections)}</span>
            </p>
          )}

          {phase === "tide" &&
            (locked.length > 0 ? (
              <>
                <Together key={locked.join()} sections={locked} onDone={() => d.reach(4)} />
              </>
            ) : (
              <div className="grid justify-items-center gap-3">
                <p className="text-3xl font-bold">잠긴 구간이 없어요 · 바로 본시 수업</p>
                <button type="button" onClick={() => d.reach(5)} className="rounded-xl bg-water px-6 py-3 text-lg font-semibold text-white">
                  다리 개통
                </button>
              </div>
            ))}

          {phase === "rope" && (
            <div className="animate-fade grid justify-items-center gap-3 text-center">
              <p className="text-3xl font-bold">구름이 걷히고, 잠긴 돌이 밧줄에 묶여 떠올랐어요</p>
              <p className="text-xl text-mute">밧줄 돌은 오늘 안에 각자 문항 2개로 굳혀요</p>
              <button type="button" onClick={() => d.reach(5)} className="mt-2 rounded-xl bg-water px-6 py-3 text-lg font-semibold text-white hover:bg-water-deep">
                다리 개통
              </button>
            </div>
          )}

          {phase === "opened" && (
            <div className="animate-rise grid justify-items-center gap-3 text-center">
              <p className="text-4xl font-bold">우리 반 다리가 수업에 닿았노라</p>
              <p className="text-2xl text-mute">한 사람도 빠짐없이</p>
              <button type="button" onClick={() => d.reach(6)} className="mt-2 rounded-xl border-2 border-water px-6 py-3 text-lg font-semibold text-water hover:bg-water-soft">
                위에서 보기
              </button>
            </div>
          )}
        </>
      )}

      {toast && (
        <p role="status" className="animate-rise fixed top-6 left-1/2 -translate-x-1/2 rounded-full bg-water px-6 py-3 text-2xl font-bold text-white shadow-lg">
          첨벙! 한 칸 놓였어요
        </p>
      )}

      <footer className={`mt-auto text-center text-base text-mute ${phase === "tide" ? "hidden" : ""}`}>
        이 화면에는 친구 이름도, 몇 명인지도 나오지 않아요 · 성적·학생부에 들어가지 않아요
      </footer>
    </main>
  );
}
