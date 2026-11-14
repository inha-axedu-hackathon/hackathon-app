"use client";
// 학생 · 첫 수업 안내와 동의 (담당: 정환희, docs/SPEC.md 5-2 S5) — 카드 3장 + 분리 동의
// 개인정보 보호법: 동의마다 목적·항목·기간·거부권을 알리고(15조, 22조), 얼굴은 민감정보라 따로 받는다(23조).
// 만 14세 미만은 보호자 동의가 끝난 뒤에 켜지고(22조의2), 철회는 동의만큼 쉽게(37조). 처음엔 둘 다 꺼져 있다.
// 시연 화면이라 고른 값은 저장·전송하지 않는다.
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { charOf } from "@/lib/rules/exceptions";
import { ME } from "@/lib/student/me";

const CARDS = [
  {
    kicker: "징검다리가 뭐예요?",
    title: "수업 전에, 내가 막힌 곳만 메워요",
    lines: ["예습 영상에서 막힌 곳을 찾아 내 크기의 돌 1~5개만 놓아요.", "친구마다 돌 개수는 달라도 모두 같은 수업에 함께 도착해요.", "내 돌 하나가 우리 반 다리 한 칸이 돼요."],
  },
  {
    kicker: "누가 뭘 보나요?",
    title: "점수도 순위도 없어요",
    lines: ["성적·학생부에 들어가지 않아요.", "누가 몇 개 했는지 친구들은 못 봐요. 교실 화면은 날씨로만 말해요."],
  },
  {
    kicker: "AI는 뭘 하나요?",
    title: "AI는 선생님을 돕기만 해요",
    lines: ["AI는 내 답을 읽고 막힌 곳을 선생님께 알려 드려요. 나한테 말을 걸거나 점수를 매기지 않아요.", "AI에는 이름 대신 가명과 답만 가요."],
  },
] as const;

const NOTICE = {
  service: [
    ["왜?", "수업 전에 막힌 개념을 찾아 선생님이 도와주려고"],
    ["무엇을?", "이름·반(슈퍼스쿨 계정), 영상 확인 질문·말해보기 답, 내가 놓은 돌"],
    ["언제까지?", "답과 AI 분석은 이 단원(약 4주)이 끝나면, 내가 이해한 개념 기록은 학년도 말(2월 말)에 지워요"],
    ["안 하면?", "불이익 없이 종이 징검돌로 똑같이 참여해요"],
  ],
  face: [
    ["왜?", "아침 교실 태블릿에서 1초 체크인하려고"],
    ["무엇을?", "얼굴 정보는 슈퍼패스(토스)만 처리하고, 징검다리는 \"본인 맞음·방법·시각\"만 받아요"],
    ["언제까지?", "체크인 기록은 단원이 끝나면 지워요 · 얼굴 정보 보관은 토스 안내를 따라요"],
    ["안 하면?", "QR·바코드로 똑같이 열려요. 얼굴로 나를 지켜보지 않아요"],
  ],
} as const;

function Notice({ rows }: { rows: readonly (readonly [string, string])[] }) {
  return (
    <dl className="mt-2 grid grid-cols-[4.5rem_1fr] gap-x-2 gap-y-1 text-sm">
      {rows.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="font-semibold text-ink/70">{k}</dt>
          <dd className="text-mute">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function WelcomePage() {
  const [step, setStep] = useState(0); // 0~2 카드, 3 동의
  const [service, setService] = useState(false);
  const [face, setFace] = useState(false);
  const [paper, setPaper] = useState(false);
  const head = useRef<HTMLHeadingElement>(null);
  const last = CARDS.length;

  useEffect(() => {
    if (step > 0) head.current?.focus(); // 카드를 넘기면 새 제목으로(화면 낭독기도 바뀐 걸 안다)
  }, [step]);

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col gap-5 px-5 pt-6">
      <header>
        <p className="text-sm text-mute">2학년 3반 국어 · 첫 수업 안내</p>
        <h1 className="text-2xl font-bold">안녕, {ME.alias}</h1>
      </header>

      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={last + 1}
        aria-valuenow={step + 1}
        aria-valuetext={`${last + 1}단계 중 ${step + 1}단계`}
        className="flex gap-1.5"
      >
        {Array.from({ length: last + 1 }, (_, i) => (
          <span key={i} aria-hidden="true" className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-water" : "bg-paper-2"}`} />
        ))}
      </div>

      {step < last ? (
        <section key={step} className="animate-rise flex flex-col gap-4 rounded-3xl border border-line bg-white p-6" aria-labelledby="card-h">
          <p className="text-sm font-semibold text-water-deep">{CARDS[step].kicker}</p>
          <h2 id="card-h" ref={head} tabIndex={-1} className="font-serif text-3xl leading-snug font-bold outline-none">
            {CARDS[step].title}
          </h2>
          {step === 0 && (
            <div className="flex items-center gap-2" aria-hidden="true">
              {ME.path.map((id) => (
                <span key={id} className="grid size-14 place-content-center rounded-full bg-water font-serif text-3xl text-white">
                  {charOf(id)}
                </span>
              ))}
              <span className="text-base font-semibold text-water-deep">→ 같은 수업 🏁</span>
            </div>
          )}
          <ul className="flex flex-col gap-3 text-base leading-relaxed">
            {CARDS[step].lines.map((l) => (
              <li key={l} className="flex gap-2">
                <span aria-hidden="true" className="text-water">
                  ●
                </span>
                {l}
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="animate-rise flex flex-col gap-4" aria-labelledby="consent-h">
          <h2 id="consent-h" ref={head} tabIndex={-1} className="font-serif text-3xl font-bold outline-none">
            내가 고르기
          </h2>
          <p className="text-base text-mute">두 가지는 따로 골라요. 처음엔 둘 다 꺼져 있어요.</p>

          <label className="flex gap-3 rounded-2xl border-2 border-line bg-white p-4 has-checked:border-water">
            <input
              type="checkbox"
              checked={service}
              onChange={(e) => {
                setService(e.target.checked);
                setPaper(false);
                if (!e.target.checked) setFace(false);
              }}
              className="mt-1 size-5 shrink-0 accent-water"
            />
            <span>
              <b className="block text-lg">징검다리를 쓸게요</b>
              <Notice rows={NOTICE.service} />
            </span>
          </label>

          <label className="flex gap-3 rounded-2xl border-2 border-line bg-white p-4 has-checked:border-water has-disabled:opacity-50">
            <input
              type="checkbox"
              checked={face}
              disabled={!service}
              aria-describedby="face-desc"
              onChange={(e) => setFace(e.target.checked)}
              className="mt-1 size-5 shrink-0 accent-water"
            />
            <span id="face-desc">
              <b className="block text-lg">
                아침 태블릿에서 얼굴로 체크인할래요 <span className="text-sm font-semibold text-mute">(선택)</span>
              </b>
              {!service && <span className="block text-sm text-mute">먼저 위 항목을 켜야 고를 수 있어요.</span>}
              <Notice rows={NOTICE.face} />
            </span>
          </label>

          <p className="text-sm text-mute">
            만 14세가 안 됐다면 보호자 동의가 끝난 뒤에 켜져요(동의서는 슈퍼스쿨 알림으로 보호자에게 가요). 그전엔 QR로 들어와요. 마음이 바뀌면 [내 정보 ›
            동의 관리]에서 언제든 끌 수 있어요. 시연 화면이라 고른 값은 저장하지 않아요.
          </p>
          {paper && !service && <p className="rounded-xl bg-paper-2 p-3 text-base">좋아요. 선생님이 종이 징검돌을 챙겨 주실 거예요.</p>}
        </section>
      )}

      <nav className="sticky bottom-0 -mx-5 mt-auto flex gap-2 bg-paper/95 px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur">
        {step > 0 && (
          <button type="button" onClick={() => setStep((s) => s - 1)} className="min-h-12 rounded-2xl border-2 border-line px-5 text-lg font-semibold hover:border-ink">
            이전
          </button>
        )}
        {step < last ? (
          <button type="button" onClick={() => setStep((s) => s + 1)} className="min-h-12 flex-1 rounded-2xl bg-ink px-5 text-lg font-bold text-paper hover:bg-ink/85">
            다음
          </button>
        ) : service ? (
          <Link href="/student" className="grid min-h-12 flex-1 place-items-center rounded-2xl bg-water px-5 text-center text-lg font-bold text-white hover:bg-water-deep">
            {face ? "시작하기 · 얼굴은 보호자 확인 후 켜져요" : "시작하기"}
          </Link>
        ) : (
          <button type="button" onClick={() => setPaper(true)} className="min-h-12 flex-1 rounded-2xl border-2 border-ink px-5 text-lg font-bold hover:bg-paper-2">
            종이 징검돌로 할게요
          </button>
        )}
      </nav>
    </main>
  );
}
