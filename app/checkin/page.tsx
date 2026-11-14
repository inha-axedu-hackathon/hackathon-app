"use client";
// 아침 교실 태블릿 체크인 (담당: 정환희, docs/SPEC.md 5-2 S4, 5-6) — 슈퍼패스 운영 모드 "아침 징검다리"(모의)
// 집에 기기가 없는 학생이 아침 교실 태블릿에서 QR·바코드·얼굴 중 하나로 1초 본인 확인 → 그 태블릿에서 내 징검런이 열린다.
// 어떤 방법이든 결과는 같다(얼굴은 따로 동의한 학생만, 안 써도 불이익 없음). 화면에는 실명 대신 번호와 가명만.
// 얼굴은 슈퍼패스(토스)가 처리하고, 징검다리는 "본인 맞음 · 방법 · 장소 · 시각"만 받는다.
// 공용 기기라서: 확인 단계는 10초, 열린 뒤에는 30초 동안 손대지 않으면 처음으로 돌아간다.
import { useEffect, useState } from "react";
import { charOf } from "@/lib/rules/exceptions";
import { useDemo } from "@/lib/store";

type Method = "qr" | "barcode" | "face";
type Phase = "choose" | "scan" | "confirm" | "open";
type Quiz = "idle" | "ask" | "wrong" | "done";

const PLACE = "2-3 교실 태블릿";
// 모의 인증: 집에 기기가 없는 학생(SPEC 3장 페르소나). 공용 태블릿이라 반 전체 명단을 불러오지 않고 한 명만 둔다.
// 값은 data/class-2-3.json의 s15와 같게(바뀌면 같이 고친다)
const ME: { id: string; no: number; alias: string; path: readonly string[] } = { id: "s15", no: 15, alias: "여울", path: ["st-o"] };
const STONE = ME.path?.[0] ?? "st-o";
const IDLE_SEC = { confirm: 10, open: 30 } as const;

const METHODS: { id: Method; label: string; hint: string }[] = [
  { id: "qr", label: "QR", hint: "학생증 QR을 카메라에" },
  { id: "barcode", label: "바코드", hint: "학생증 바코드를 스캐너에" },
  { id: "face", label: "얼굴", hint: "따로 동의한 학생만 (만 14세 미만은 보호자도)" },
];
const SCAN_TEXT: Record<Method, string> = {
  qr: "학생증 QR을 카메라에 보여 주세요",
  barcode: "학생증 바코드를 스캐너에 대 주세요",
  face: "화면을 1초만 봐 주세요",
};

export default function CheckinPage() {
  const d = useDemo();
  const [phase, setPhase] = useState<Phase>("choose");
  const [method, setMethod] = useState<Method>("qr");
  const [left, setLeft] = useState<number>(IDLE_SEC.open);
  const [info, setInfo] = useState(false);
  const [quiz, setQuiz] = useState<Quiz>("idle");

  useEffect(() => {
    if (phase !== "scan") return;
    const t = setTimeout(() => setPhase("confirm"), 1100); // 모의 인증 1초
    return () => clearTimeout(t);
  }, [phase]);

  // 공용 기기: 확인·열림 단계에서 아무것도 누르지 않으면 처음으로. 화면을 만지면 시간이 다시 시작된다
  useEffect(() => {
    if (phase !== "confirm" && phase !== "open") return;
    const full = IDLE_SEC[phase];
    const reset = () => setLeft(full);
    const first = setTimeout(reset, 0);
    const t = setInterval(() => setLeft((n) => Math.max(0, n - 1)), 1000);
    window.addEventListener("pointerdown", reset);
    window.addEventListener("keydown", reset);
    return () => {
      clearTimeout(first);
      clearInterval(t);
      window.removeEventListener("pointerdown", reset);
      window.removeEventListener("keydown", reset);
    };
  }, [phase]);
  useEffect(() => {
    if ((phase === "confirm" || phase === "open") && left === 0) {
      const t = setTimeout(() => leave(), 0); // 자동 로그아웃
      return () => clearTimeout(t);
    }
  }, [phase, left]);

  function leave() {
    setPhase("choose");
    setQuiz("idle");
    setInfo(false);
    setLeft(IDLE_SEC.open);
  }
  function start(m: Method) {
    setMethod(m);
    setPhase("scan");
  }
  function confirm() {
    d.add({ type: "checked_in", studentId: ME.id, method, place: PLACE });
    setPhase("open");
  }
  function answer(o: "O" | "X") {
    if (o === "O") {
      setQuiz("done");
      d.add({ type: "stone_placed", studentId: ME.id, stoneId: STONE }); // 종이 돌을 태블릿에서 굳힘
    } else setQuiz("wrong");
  }

  const transparency = (
    <>
      <dl className="mt-3 grid gap-3 text-base sm:grid-cols-3">
        <div className="rounded-xl bg-paper-2 p-3">
          <dt className="font-bold">얼굴</dt>
          <dd className="mt-1 text-mute">슈퍼패스(토스)가 확인해요. 얼굴 사진·특징값은 징검다리에 오지 않아요. 보관은 토스 안내를 따라요.</dd>
        </div>
        <div className="rounded-xl bg-paper-2 p-3">
          <dt className="font-bold">징검다리가 받는 것</dt>
          <dd className="mt-1 text-mute">본인 맞음 · 방법(QR·바코드·얼굴) · 장소 · 시각. 이 단원(약 4주)이 끝나면 지워요.</dd>
        </div>
        <div className="rounded-xl bg-paper-2 p-3">
          <dt className="font-bold">고를 수 있어요</dt>
          <dd className="mt-1 text-mute">얼굴은 따로 동의한 학생만 써요. 동의는 언제든 거둘 수 있고, QR·바코드로도 똑같이 열리며 불이익이 없어요.</dd>
        </div>
      </dl>
      <p className="mt-3 text-sm text-mute">
        얼굴로 집중도나 표정을 보지 않아요. 성적·학생부에 들어가지 않아요. 실제 도입: 학교가 등록한 태블릿만, 나가면 이 기기에 남는 기록이 없어요.
      </p>
    </>
  );

  return (
    <main className="mx-auto flex min-h-dvh max-w-5xl flex-col px-4 py-5 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
        <p className="text-lg font-bold">
          슈퍼패스 <span className="font-normal text-mute">운영 모드</span> · 아침 징검다리
        </p>
        <p className="tabular text-base text-mute">2학년 3반 교실 · 월~금 07:50–08:40</p>
      </header>

      <section className="flex flex-1 flex-col items-center justify-center gap-6 py-8 text-center" aria-live="polite">
        {phase === "choose" && (
          <>
            <div>
              <h1 className="text-4xl font-bold sm:text-5xl">내 징검런 열기</h1>
              <p className="mt-3 text-xl text-mute">편한 방법 하나를 고르세요. 어떤 방법이든 똑같이 열려요.</p>
            </div>
            <div className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
              {METHODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => start(m.id)}
                  className="flex min-h-36 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-ink bg-white px-4 py-6 hover:bg-paper-2"
                >
                  <span className="text-3xl font-bold">{m.label}</span>
                  <span className="text-base text-mute">{m.hint}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setInfo((v) => !v)}
              aria-expanded={info}
              className="min-h-12 rounded-xl px-4 text-lg font-semibold text-water-deep underline hover:bg-water-soft"
            >
              무엇이 어디로 가나요?
            </button>
            {info && <div className="w-full max-w-3xl rounded-2xl border border-line bg-white p-5 text-left">{transparency}</div>}
          </>
        )}

        {phase === "scan" && (
          <div className="flex flex-col items-center gap-4" role="status">
            <div className="grid size-48 place-items-center rounded-3xl border-4 border-dashed border-water bg-water-soft">
              <span className="animate-shimmer text-2xl font-bold text-water-deep">{METHODS.find((m) => m.id === method)?.label}</span>
            </div>
            <p className="text-2xl font-semibold">{SCAN_TEXT[method]}</p>
            <p className="text-base text-mute">모의 인증 · 실제 확인은 슈퍼패스가 해요</p>
          </div>
        )}

        {phase === "confirm" && (
          <div className="flex flex-col items-center gap-5">
            <p className="text-xl text-mute">본인 확인</p>
            <p className="text-4xl font-bold">
              {ME.no}번 {ME.alias} 맞나요?
            </p>
            <div className="flex gap-3">
              <button type="button" onClick={confirm} className="min-h-16 rounded-2xl bg-water px-10 py-4 text-2xl font-bold text-white hover:bg-water-deep">
                맞아요
              </button>
              <button type="button" onClick={leave} className="min-h-16 rounded-2xl border-2 border-line px-8 py-4 text-2xl font-semibold hover:border-ink">
                아니에요
              </button>
            </div>
            <p className="tabular text-base text-mute">{left}초 안에 고르지 않으면 처음으로 돌아가요</p>
          </div>
        )}

        {phase === "open" && (
          <div className="flex w-full max-w-xl flex-col items-center gap-5">
            <p className="text-xl text-mute">{ME.alias}의 징검런이 이 태블릿에서 열렸어요</p>
            <p className="text-4xl font-bold sm:text-5xl">{quiz === "done" ? "첨벙! 한 칸 놓았어요" : `오늘 돌 ${ME.path?.length ?? 1}개 · 1분이면 완주 🏁`}</p>
            <span
              className={`grid size-20 place-items-center rounded-2xl border-2 font-serif text-4xl font-bold ${
                quiz === "done" ? "border-water bg-water text-white" : "border-water bg-water-soft text-water-deep"
              }`}
            >
              {charOf(STONE)}
            </span>

            {quiz === "idle" && (
              <>
                <p className="text-lg">어제 종이 징검돌로 놓은 돌이에요. 여기서 굳히면 다리에 바로 이어져요.</p>
                <button type="button" onClick={() => setQuiz("ask")} className="min-h-16 rounded-2xl bg-water px-12 py-4 text-2xl font-bold text-white hover:bg-water-deep">
                  {charOf(STONE)} 굳히기 시작 →
                </button>
              </>
            )}
            {(quiz === "ask" || quiz === "wrong") && (
              <div className="flex w-full flex-col items-center gap-3 rounded-2xl border border-line bg-white p-5">
                <p className="text-2xl font-semibold">ㅇ은 목구멍 모양을 본떠 만든 기본자다</p>
                <div className="flex gap-3">
                  {(["O", "X"] as const).map((o) => (
                    <button key={o} type="button" onClick={() => answer(o)} className="min-h-16 min-w-24 rounded-2xl border-2 border-ink text-3xl font-bold hover:bg-paper-2">
                      {o}
                    </button>
                  ))}
                </div>
                {quiz === "wrong" && (
                  <p className="text-base text-mute">ㅇ은 첫소리에서 소리가 나지 않아도 목구멍 모양을 본뜬 기본자예요. 다시 골라 볼까요?</p>
                )}
              </div>
            )}
            {quiz === "done" && <p className="text-lg">우리 반 다리에 내 돌이 이어졌어요. 선생님 화면에도 바로 반영돼요.</p>}

            <button type="button" onClick={leave} className="min-h-12 rounded-xl border-2 border-line px-6 py-2 text-lg font-semibold hover:border-ink">
              나가기
            </button>
            <p className="tabular text-base text-mute">아무것도 누르지 않으면 {left}초 뒤 자동으로 나가요 (공용 태블릿)</p>
            <details className="w-full rounded-2xl border border-line bg-white p-4 text-left">
              <summary className="min-h-10 cursor-pointer text-lg font-semibold text-water-deep">무엇이 어디로 가나요?</summary>
              {transparency}
            </details>
          </div>
        )}
      </section>
    </main>
  );
}
