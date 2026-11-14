"use client";
// 학생 · 징검런 홈 (담당: 신재우) — docs/SPEC.md 5-0, 5-2 S1 · docs/GAMIFICATION.md 0장 문구
// 본인 숫자(내 링, 남은 칸)만 보여 준다. 친구·반 숫자, 점수, 순위, 연속 기록, 레벨은 없다.
import Link from "next/link";
import { useMemo, useState } from "react";
import { ProgressRing } from "@/components/ProgressRing";
import { myProgress } from "@/components/student/progress";
import { DEMO_STUDENT } from "@/components/student/stones";
import { STUDENTS } from "@/lib/rules/bridge";
import { useDemo } from "@/lib/store";

// 다른 친구가 아직 건너는 중인지(실제 데이터 신호). 아무도 없으면 문구를 숨긴다 (SPEC S1)
const OTHERS_CROSSING = STUDENTS.some((s) => s.id !== DEMO_STUDENT && !s.arrived);

const STATE_TEXT = { placed: "놓인 돌", paper: "종이 돌 · 선생님 확인", wet: "젖은 돌 · 한 번 더 두드려 봐", todo: "아직 물속" } as const;

export default function StudentPage() {
  const d = useDemo();
  const p = useMemo(() => myProgress(DEMO_STUDENT, d.events), [d.events]);
  const [rest, setRest] = useState(false);
  const hour = Number(d.now.slice(11, 13));
  const daytime = hour >= 7 && hour < 22; // 밤 10시~아침 7시에는 '함께 건너는 중'을 숨긴다

  const headline = !p.allPlaced
    ? `${p.total - p.placed}칸 남음 · ${p.minutesLeft}분이면 완주 🏁`
    : p.arrived
      ? "완주! 깃발을 꽂았어요 🏁"
      : "도착 관문이 열렸어요";

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col gap-5 px-5 py-6">
      <p className="-mb-3 text-xs font-semibold text-water">교실 태블릿 · 슈퍼패스로 들어옴 · 다 하면 자동 로그아웃</p>
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-mute">국어의 문자 체계 · 오늘 3교시 전까지</p>
          <h1 className="text-2xl font-bold">{p.alias}의 징검런</h1>
        </div>
        <span className="rounded-full bg-seal-soft px-3 py-1 text-sm font-semibold text-seal">{p.arrived ? "집현전 견습생" : "첫걸음 학생"}</span>
      </header>

      <ProgressRing done={p.placed} total={p.total}>
        <p className="tabular text-5xl font-bold">
          {p.placed}
          <span className="text-2xl text-mute">/{p.total}</span>
        </p>
        <p className="mt-1 text-sm text-mute">내 돌</p>
      </ProgressRing>

      <p className="text-center text-xl font-bold" aria-live="polite">
        {headline}
      </p>

      <ol className="grid gap-2" aria-label="내 징검돌">
        {p.stones.map((s) => {
          const on = s.state === "placed" || s.state === "paper";
          return (
            <li key={s.id} className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${on ? "border-water/30 bg-water-soft/60" : "border-line bg-white"}`}>
              <span className={`grid size-11 place-content-center rounded-full font-serif text-2xl ${on ? "bg-water text-white" : "bg-paper-2 text-mute"}`}>{s.char}</span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{s.title}</p>
                <p className="text-sm text-mute">
                  {s.start ? "이미 아는 개념 · 처음부터 켜져 있어요" : STATE_TEXT[s.state]}
                </p>
              </div>
              {!on && p.next?.id === s.id && (
                <Link href={`/student/stone/${s.id}`} className="rounded-xl bg-water px-4 py-2 font-semibold text-white hover:bg-water-deep">
                  밟기
                </Link>
              )}
            </li>
          );
        })}
      </ol>

      {p.allPlaced && !p.arrived && (
        <Link href="/student/explain" className="animate-rise rounded-2xl bg-ink px-5 py-4 text-center text-lg font-bold text-white">
          도착 관문 · 내 말로 설명하기
        </Link>
      )}

      <section className="rounded-2xl border border-line bg-white px-4 py-3" aria-label="이번 단원 별 (나만 봐요)">
        <p className="text-sm text-mute">이번 단원 별 · 나만 봐요</p>
        <div className="mt-1 grid grid-cols-3 gap-2 text-center text-sm">
          <Star on={p.allPlaced} label="굳힘" />
          <Star on={p.arrived} label="설명" />
          <Star on={false} label="일주일 뒤에도" />
        </div>
      </section>

      {rest ? (
        <p className="rounded-2xl bg-paper-2 px-4 py-3 text-center">오늘은 여기까지 — 놓은 칸은 안 사라짐</p>
      ) : (
        <button type="button" onClick={() => setRest(true)} className="rounded-2xl border border-line bg-white px-4 py-3 font-semibold text-mute hover:bg-paper-2">
          오늘은 여기까지 · 로그아웃
        </button>
      )}

      <footer className="mt-auto grid gap-1 text-center text-base text-mute">
        {daytime && OTHERS_CROSSING && <p>지금 친구들도 함께 건너는 중</p>}
        <p className="font-semibold text-ink">성적·학생부에 들어가지 않아요</p>
        <p className="text-sm">나의 강 지도 · 단원이 끝나면 열려요</p>
      </footer>
    </main>
  );
}

function Star({ on, label }: { on: boolean; label: string }) {
  return (
    <div className={on ? "text-gold" : "text-faint"}>
      <p className="text-2xl" aria-hidden="true">
        {on ? "★" : "☆"}
      </p>
      <p className={on ? "font-semibold text-ink" : ""}>{label}</p>
    </div>
  );
}
