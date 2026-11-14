// components/teacher/ClassPanels.tsx — 유형 분포 · 예외 결재 · 아침 체크인 (교사만, SPEC 5-1 T1·T3, 5-2 S4)
// 교사 화면이 프로젝터에 비칠 수 있어서 예외 사유와 이름은 여기서 펼치지 않는다(사유는 결재 화면에서만)
import Link from "next/link";
import type { CheckIn } from "@/lib/rules/forecast";
import { METHOD_LABEL, TYPE_COLS, TYPE_ROWS, exceptions, hhmm, studentOf, typeCounts } from "@/lib/rules/forecast";
import type { DemoEvent, Student } from "@/lib/types";

const card = "min-w-0 rounded-2xl border border-line bg-white p-4";
const who = (s: Student | undefined, showNames: boolean) => (s ? `${s.no}번${showNames ? ` ${s.name}` : ""}` : "");

export function TypeGrid({ className = "" }: { className?: string }) {
  const counts = typeCounts();
  return (
    <section className={`${card} ${className}`} aria-labelledby="types-h">
      <h2 id="types-h" className="text-lg font-bold">
        8유형 분포
      </h2>
      <p className="mb-2 text-sm text-mute">참여 신호 × 선수 개념 × 환경 · 규칙으로 계산 · 교사만 · 학생부 미반영</p>
      <div className="overflow-x-auto">
        <table className="tabular w-full min-w-[22rem] text-center text-sm">
          <thead>
            <tr className="text-mute">
              <th className="py-1 text-left font-normal">참여 신호</th>
              {TYPE_COLS.map(([r, e]) => (
                <th key={r + e} className="py-1 font-normal">
                  개념 {r}
                  <br />
                  {e === "양호" ? "환경 양호" : "걸림돌"}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TYPE_ROWS.map((p) => (
              <tr key={p} className="border-t border-line">
                <th className="py-1.5 text-left font-semibold">{p === "있음" ? "있음" : "적음"}</th>
                {TYPE_COLS.map(([r, e]) => {
                  const n = counts.get(`${p}/${r}/${e}`) ?? 0;
                  return (
                    <td key={r + e} className={`py-1.5 text-base font-bold ${n ? "" : "text-faint"}`}>
                      {n}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function ExceptionPanel({ events, showNames }: { events: readonly DemoEvent[]; showNames: boolean }) {
  const list = exceptions();
  const approved = [...events].reverse().find((e) => e.type === "approved");
  return (
    <section className={card} aria-labelledby="ex-h">
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="ex-h" className="text-lg font-bold">
          규칙 밖 예외 {list.length}건
        </h2>
        {approved ? (
          <span className="text-sm font-semibold text-seal">승인됨 · {hhmm(approved.at)}</span>
        ) : (
          <span className="text-sm text-mute">승인 전</span>
        )}
      </div>
      <p className="my-2 text-base">{list.map(({ student }) => who(student, showNames)).join(" · ")}</p>
      <p className="mb-2 text-sm text-mute">사유는 결재 화면에서만 보여요</p>
      <Link
        href="/teacher/approve"
        className="block rounded-lg border border-ink px-3 py-2 text-center font-semibold hover:bg-ink hover:text-paper"
      >
        {approved ? "결재 기록 보기" : "결재하러 가기 · 약 3분"}
      </Link>
    </section>
  );
}

export function CheckInPanel({ events, showNames }: { events: readonly DemoEvent[]; showNames: boolean }) {
  const list = events.filter((e): e is CheckIn => e.type === "checked_in");
  return (
    <section className={card} aria-labelledby="ci-h">
      <h2 id="ci-h" className="text-lg font-bold">
        아침 체크인
      </h2>
      <p className="mb-2 text-sm text-mute">슈퍼패스 교실 태블릿 · 본인 확인 결과·방법·장소·시각만 받아요</p>
      {list.length === 0 ? (
        <p className="text-base text-mute">아직 없어요</p>
      ) : (
        <ul className="flex flex-col gap-1 text-base">
          {list.map((c, i) => (
            <li key={i} className="flex justify-between gap-2">
              <span className="font-semibold">{who(studentOf(c.studentId), showNames) || c.studentId}</span>
              <span className="tabular text-mute">
                {METHOD_LABEL[c.method]} · {c.place} · {hhmm(c.at)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
