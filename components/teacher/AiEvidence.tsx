// components/teacher/AiEvidence.tsx — AI가 왜 필요한가: 키워드만으로 틀린 답을 AI가 근거와 함께 바로잡음 + 일치율 (T2, SPEC 6-5)
// 숫자는 과장하지 않는다: 전체 중 몇 개인지, 가상 답·라벨 기준이라는 것, AI가 다르게 본 건수를 같이 적는다
import type { AiWin, AnalysisRun } from "@/lib/rules/forecast";
import { MISCONCEPTION_SHORT } from "@/lib/rules/forecast";
import { Highlight } from "./Highlight";
import { LockGate } from "./InfoLock";

const names = (list: string[]) => (list.length ? list.map((id) => MISCONCEPTION_SHORT[id] ?? id).join(", ") : "못 찾음");

export function AiEvidence({ run, wins, total }: { run: AnalysisRun; wins: AiWin[]; total: number }) {
  const a = run.agreement;
  const k = run.keywordAgreement;
  return (
    <div className="flex flex-col gap-3">
      {a && k && (
        <div>
          <p className="mb-1.5 text-base font-semibold">AI 판정과 예비교사 판정 일치</p>
          <dl className="grid grid-cols-2 gap-2 text-center">
            <div className="rounded-xl bg-water-soft px-3 py-2">
              <dt className="text-sm font-semibold text-water-deep">AI가 읽음</dt>
              <dd className="tabular text-3xl font-bold text-water-deep">
                {a.matched}/{a.total}
              </dd>
            </div>
            <div className="rounded-xl bg-paper-2 px-3 py-2">
              <dt className="text-sm font-semibold text-ink/70">키워드만 (비교용)</dt>
              <dd className="tabular text-3xl font-bold text-ink/70">
                {k.matched}/{k.total}
              </dd>
            </div>
          </dl>
          <p className="mt-1.5 text-sm text-mute">
            예비교사가 일부러 넣은 오개념 라벨과 비교 · 가상 답 {a.total}개(초안) · {run.model ?? "claude-haiku-5-5"} · AI가 다르게 본{" "}
            {a.total - a.matched}건은 교사 확인 대상 · 실제 정확도는 파일럿에서 다시 재요
          </p>
        </div>
      )}
      {wins.length > 0 && k && (
        <div>
          <p className="mb-1.5 text-base font-semibold">
            키워드만으로 틀린 답 {k.total - k.matched}개 중 AI가 라벨대로 바로잡은 답 {total}개 · 예시 {wins.length}개
          </p>
          <LockGate what="AI 근거 예시 원문" ids={wins.map((w) => w.student.id)}>
          <ul className="flex flex-col gap-2">
            {wins.map((w) => (
              <li key={w.student.id} className="rounded-xl border border-line bg-white px-3 py-2">
                <p className="text-base">
                  “<Highlight text={w.text} quote={w.evidence} />”
                </p>
                <p className="mt-1 flex flex-wrap gap-x-4 text-sm">
                  <span className="text-mute">키워드: {names(w.keyword)}</span>
                  <span className="font-semibold text-water-deep">AI: {names(w.ai)}</span>
                </p>
              </li>
            ))}
          </ul>
          </LockGate>
        </div>
      )}
    </div>
  );
}
