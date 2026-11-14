// components/teacher/ClassPanels.tsx — 유형 분포 · 예외 결재 · 아침 체크인 (교사만, SPEC 5-1 T1·T3·T7, 5-2 S4)
// 교사 화면이 프로젝터에 비칠 수 있어서 반 단위 숫자만 늘 보이고, 누가인지는 학생 정보 잠금(T7) 안에 둔다.
// 잠긴 동안 8유형 표의 1~2명 칸은 "1~2"로 묶는다(작은 칸으로 누군지 짐작되지 않게).
import Link from "next/link";
import { TYPE_DEFS } from "@backend/lib/rules/exceptions";
import type { CheckIn } from "@backend/lib/rules/forecast";
import { METHOD_LABEL, TYPE_COLS, TYPE_ROWS, exceptions, hhmm, studentOf, typeCounts } from "@backend/lib/rules/forecast";
import type { DemoEvent, Student } from "@backend/lib/types";
import { LockGate, useInfoLock } from "./InfoLock";

const card = "min-w-0 rounded-2xl border border-line bg-white p-4";
const who = (s: Student | undefined, showNames: boolean) => (s ? `${s.no}번${showNames ? ` ${s.name}` : ""}` : "");

/** 잠긴 동안 3명 미만 칸은 묶어서 보여 준다 */
export const smallCell = (n: number, open: boolean) => (!open && n > 0 && n < 3 ? "1~2" : String(n));

export function TypeGrid({ className = "" }: { className?: string }) {
  const counts = typeCounts();
  const { open } = useInfoLock();
  return (
    <section className={`${card} ${className}`} aria-labelledby="types-h">
      <h2 id="types-h" className="text-lg font-bold">
        8유형 분포 <span className="text-sm font-normal text-mute">예비교사 설계</span>
      </h2>
      <p className="mb-2 text-sm text-mute">참여 신호 × 선수 개념 × 학습 환경 · 규칙으로 계산 · 교사만 · 학생부 미반영</p>
      <div className="overflow-x-auto">
        <table className="tabular w-full min-w-[22rem] text-center text-sm">
          <thead>
            <tr className="text-mute">
              <th className="py-1 text-left font-normal">참여 신호</th>
              {TYPE_COLS.map(([r, e]) => (
                <th key={r + e} className="py-1 font-normal">
                  개념 {r}
                  <br />
                  환경 {e}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TYPE_ROWS.map((p) => (
              <tr key={p} className="border-t border-line">
                <th className="py-1.5 text-left font-semibold">{p}</th>
                {TYPE_COLS.map(([r, e]) => {
                  const key = `${p}/${r}/${e}`;
                  const n = counts.get(key) ?? 0;
                  return (
                    <td key={r + e} className={`py-1.5 ${n ? "" : "text-faint"}`}>
                      <span className="text-base font-bold">{smallCell(n, open)}</span>
                      <span className="ml-1 text-xs text-mute">{TYPE_DEFS[key]?.id}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-1 text-xs text-mute">
        참여 신호는 관찰한 제출·시도·SOS예요(의욕을 판정하지 않음). 환경 걸림돌이 있으면 &quot;낮아 보임&quot;으로 두고 환경부터 풀어요(SPEC 8-1-1). 잠긴 동안
        작은 칸은 1~2로 묶어요.
      </p>
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
          규칙 밖 예외 <span className="tabular text-2xl">{list.length}</span>건
        </h2>
        {approved ? (
          <span className="text-sm font-semibold text-seal">승인됨 · {hhmm(approved.at)}</span>
        ) : (
          <span className="text-sm text-mute">승인 전</span>
        )}
      </div>
      <div className="my-2">
        <LockGate what="예외 학생 번호" ids={list.map(({ student }) => student.id)} label="예외 학생 번호" rows={1}>
          <p className="text-base">{list.map(({ student }) => who(student, showNames)).join(" · ")}</p>
        </LockGate>
      </div>
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
        아침 체크인 <span className="tabular text-2xl">{list.length}</span>명
      </h2>
      <p className="mb-2 text-sm text-mute">슈퍼패스 교실 태블릿 · 본인 확인 결과·방법·장소·시각만 받아요</p>
      {list.length === 0 ? (
        <p className="text-base text-mute">아직 없어요</p>
      ) : (
        <LockGate what="아침 체크인 명단" ids={list.map((c) => c.studentId)} label="체크인한 학생 번호" rows={1}>
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
        </LockGate>
      )}
    </section>
  );
}
