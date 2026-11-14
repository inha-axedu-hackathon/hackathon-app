"use client";
// 학생 · 나의 강 지도 (담당: 정환희, docs/SPEC.md 5-2 S8)
// 단원마다 개통한 반 다리(자음 제자표)를 한 장씩 모은 내 지도. 숙달한 개념만 남기고 점수·순위·날짜 연속은 없다.
// 나와 선생님만 보고, 학년도 말까지 보관하고, 내려받을 수 있다(인쇄·PDF 저장). 별은 숙달 단계(SPEC 5-0): 굳힘 → 내 말로 설명 → 일주일 뒤에도.
// 반 전체 명단을 불러오지 않고(lib/student/me.ts), 시연 이벤트도 내 것과 "개통" 여부만 쓴다.
import Link from "next/link";
import { useMemo } from "react";
import { STONES } from "@/lib/content";
import { ME } from "@/lib/student/me";
import { useDemo } from "@/lib/store";

const ROWS = [
  { team: 1, name: "어금닛소리" },
  { team: 2, name: "혓소리" },
  { team: 3, name: "입술소리" },
  { team: 4, name: "잇소리" },
  { team: 5, name: "목구멍소리" },
] as const;
const COLS = ["상형", "가획", "병서"] as const;
const LEVEL = ["", "굳혔어요", "내 말로 설명했어요", "일주일 뒤에도 기억해요"] as const;

export default function RiverPage() {
  const d = useDemo();
  const mineEvents = useMemo(() => d.events.filter((e) => "studentId" in e && e.studentId === ME.id), [d.events]);
  const opened = d.events.some((e) => e.type === "opened"); // 반 다리는 개통 여부만
  const mine = new Set<string>(ME.path);
  const passed = mineEvents.some((e) => e.type === "explain_passed");
  const placed = (id: string) => ME.progress[id] === "placed" || mineEvents.some((e) => e.type === "stone_placed" && e.stoneId === id);
  const level = (id: string) => (!placed(id) ? 0 : id === "st-t" && passed ? 2 : 1);
  const concepts = [
    placed("st-n") && "기본자는 발음 기관을 본떴어요 (ㄴ: 혀가 윗잇몸에 닿는 모양)",
    placed("st-d") && "기본자에 획을 더하면 새 글자가 돼요 (ㄴ → ㄷ)",
    passed && "획을 더하면 소리가 조금 세져요 (ㄷ → ㅌ, 말해보기 통과)",
  ].filter(Boolean) as string[];
  const myChars = ME.path.filter(placed).map((id) => STONES.find((s) => s.id === id)?.char ?? "");

  return (
    <main className="g-skin mx-auto flex min-h-dvh max-w-md flex-col gap-5 px-5 py-6 print:py-0">
      <header className="flex items-end justify-between gap-2">
        <div>
          <p className="text-sm text-mute">
            {ME.alias} · <span className="print:hidden">나와 선생님만 봐요</span>
            <span className="hidden print:inline">내가 내려받은 기록 · 점수·순위 없음</span>
          </p>
          <h1 className="text-2xl font-bold">나의 강 지도</h1>
        </div>
        <Link href="/student" className="text-sm text-mute hover:text-ink print:hidden">
          징검런으로
        </Link>
      </header>
      <p className="text-base text-ink/80">단원마다 우리 반이 함께 이은 다리를 모아요. 남는 건 점수가 아니라 내가 이해한 개념이에요.</p>

      <div className="flex items-center gap-3 rounded-2xl bg-water p-3 text-white [print-color-adjust:exact]">
        <span className="font-serif text-3xl tracking-widest">{myChars.join(" ")}</span>
        <span className="text-sm">내가 이은 조각</span>
        <button type="button" onClick={() => window.print()} className="ml-auto min-h-11 rounded-full bg-white px-4 text-sm font-semibold text-water-deep print:hidden">
          지도 저장
        </button>
      </div>

      <section className="rounded-3xl border border-line bg-white p-5" aria-labelledby="u1-h">
        <div className="flex items-start justify-between gap-2">
          <h2 id="u1-h" className="text-lg font-bold">
            <span className="block text-sm font-normal text-mute">국어의 문자 체계</span>
            자음 만들기
          </h2>
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-sm font-semibold whitespace-nowrap [print-color-adjust:exact] ${
              opened ? "bg-water text-white" : "bg-water-soft text-water-deep"
            }`}
          >
            {opened ? "개통" : "건너는 중"}
          </span>
        </div>
        <table className="mt-3 w-full text-center" aria-label="자음 제자표: 소리 갈래별 상형·가획·병서">
          <thead>
            <tr className="text-sm text-ink/70">
              <th className="py-1 text-left font-normal">소리 갈래</th>
              {COLS.map((c) => (
                <th key={c} className="py-1 font-normal">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.team} className="border-t border-line">
                <th className="py-1.5 text-left text-sm font-normal text-ink/70">{r.name}</th>
                {COLS.map((c) => (
                  <td key={c} className="py-1.5">
                    <span className="flex flex-wrap justify-center gap-1">
                      {STONES.filter((s) => s.team === r.team && s.section === c).map((s) => {
                        const own = mine.has(s.id);
                        const n = level(s.id);
                        return (
                          <span
                            key={s.id}
                            role="img"
                            aria-label={own ? `${s.char}, 내 돌${n ? `, ${LEVEL[n]}` : ""}` : s.char}
                            className={`relative grid size-9 place-content-center rounded-full font-serif text-lg [print-color-adjust:exact] ${
                              own ? "bg-water text-white" : opened ? "bg-paper-2 text-ink/60" : "bg-paper-2/60 text-faint"
                            }`}
                          >
                            {s.char}
                            {own && n > 0 && (
                              <span aria-hidden="true" className="absolute -top-1.5 -right-1.5 rounded-full bg-gold px-1 text-xs leading-4 font-bold text-ink">
                                {"★".repeat(n)}
                              </span>
                            )}
                          </span>
                        );
                      })}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-sm text-ink/70">파란 돌은 내가 놓은 돌 · ★ 굳혔어요 · ★★ 내 말로 설명했어요 · ★★★ 일주일 뒤에도 기억해요</p>
        <p className="mt-2 text-base font-semibold text-water-deep">내가 놓은 돌이 우리 반 다리의 한 칸이 됐어요.</p>

        <h3 className="mt-4 text-base font-bold">내가 이해한 개념</h3>
        {concepts.length ? (
          <ul className="mt-1 flex flex-col gap-1.5 text-base">
            {concepts.map((c) => (
              <li key={c} className="rounded-xl bg-water-soft px-3 py-2 text-water-deep [print-color-adjust:exact]">
                {c}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-base text-mute">돌을 놓으면 여기에 개념이 쌓여요.</p>
        )}
      </section>

      <section className="relative overflow-hidden rounded-3xl border border-dashed border-line bg-paper-2 p-5 text-mute" aria-labelledby="u2-h">
        <h2 id="u2-h" className="text-lg font-bold">
          다음 단원 · 모음 만들기 (하늘·땅·사람)
        </h2>
        <p className="mt-1 text-base">아직 물속이에요. 다음 단원에서 우리 반이 함께 이어요.</p>
        <p className="mt-3 font-serif text-3xl tracking-[0.4em] opacity-40" aria-hidden="true">
          ㆍ ㅡ ㅣ
        </p>
      </section>

      <p className="text-center text-sm text-mute">
        나와 선생님만 봐요 · 학년도 말(2월 말)에 지워져요 · 내려받은 파일은 내가 보관해요 · 성적·학생부에 들어가지 않아요
      </p>
      <p className="mt-auto pt-6 text-center text-xs text-mute">시연용 가상 학생 데이터 · 모의 인증</p>
    </main>
  );
}
