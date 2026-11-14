"use client";
// components/student/StudentFlow.tsx — 학생 태블릿 화면의 흐름 (담당: 신재우)
// 디자인(StudentView)에 실제 동작을 붙인다: 실험실(LabFrame) · 굳히기 문항 · 첨벙(시연 단계 1) · 도착 관문(/api/explain, 시연 단계 2)
// 본인 숫자만 보여 준다. 점수·순위·연속 기록·레벨 없음. 학생에게 보이는 판정 문장은 서버가 미리 써 둔 문구뿐.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { handleDemoKey } from "@/components/DemoKeys";
import { FitStage } from "@/components/FitStage";
import { LabFrame } from "@/components/LabFrame";
import { isLabKey, onLabDone, postLabDone } from "@/components/student/labSignal";
import { myProgress } from "@/components/student/progress";
import { DEMO_STUDENT, EXPLAIN, stoneCard } from "@/components/student/stones";
import { StudentView } from "@/components/student/StudentView";
import { useDemo } from "@/lib/store";

export type Screen = "home" | "concept" | "lab" | "quiz" | "splash" | "gate" | "pass";

type Q = { tag: string; text: string; opts: string[]; ans: number; serif: boolean; explain: string; fix: string };

// 굳히기 문항 (ㅌ: 디자인 확정본, 해례 '聲出稍厲' 기준 · 진선우 검수)
const Q_T: Q[] = [
  { tag: "굳히기 1/2", text: "ㄷ에 획을 하나 더해 ㅌ을 만든 까닭은?", opts: ["소리가 조금 세게 나서", "글자를 더 크게 쓰려고", "같은 글자를 나란히 쓰려고"], ans: 0, serif: false,
    explain: '해례는 "소리가 조금 세지면 획을 더한다(聲出稍厲)"고 설명해요.', fix: "‘크게’가 아니라 ‘세게’예요. 큰 소리가 아니라 소리가 조금 세게 나는 거예요." },
  { tag: "굳히기 2/2", text: "ㅌ과 같은 원리로 만든 글자는?", opts: ["ㄲ", "ㅋ", "ㄹ"], ans: 1, serif: true,
    explain: "ㅋ도 ㄱ에 획을 더한 글자예요. 소리가 조금 세졌죠.", fix: "ㄲ은 ㄱ을 나란히 쓴 병서예요. 획을 더한 글자를 다시 찾아봐요." },
  { tag: "굳히기 2/2 · 비슷한 문제", text: "ㄴ → ㄷ처럼 획을 더해 만든 짝은?", opts: ["ㅅ → ㅆ", "ㅁ → ㅂ", "ㅇ → ㆁ"], ans: 1, serif: false,
    explain: "ㅁ에 획을 더하면 ㅂ. 소리가 조금 세져요.", fix: "ㅆ은 나란히 쓴 병서, ㆁ은 모양이 다른 이체자예요." },
  { tag: "굳히기 1/2 · 비슷한 문제", text: "ㄱ에 획을 하나 더해 ㅋ을 만든 까닭은?", opts: ["글자를 나란히 쓰려고", "소리가 조금 세게 나서", "글자 모양을 예쁘게 하려고"], ans: 1, serif: false,
    explain: "ㅋ도 ㅌ처럼 소리가 조금 세져서 획을 더했어요(聲出稍厲).", fix: "나란히 쓰는 건 병서(ㄲ)예요. 획을 더하는 까닭은 소리가 세지는 것이에요." },
];
// ㄴ·ㄷ: data/stones.json 문항 그대로(1·2번 + 비슷한 문제 1개). 틀렸을 때 문구는 답을 바로 말하지 않는 힌트로
const fromJson = (id: string, fixes: string[]): Q[] => {
  const qs = stoneCard(id)?.questions ?? [];
  return qs.slice(0, 3).map((q, i) => ({
    tag: i === 2 ? "비슷한 문제" : `굳히기 ${i + 1}/2`,
    text: q.prompt,
    opts: q.options,
    ans: q.answer,
    serif: false,
    explain: q.explain,
    fix: fixes[i] ?? "개념 카드를 떠올려 다시 골라 봐요.",
  }));
};

export type StoneId = "st-n" | "st-d" | "st-t";
type StoneMeta = {
  char: string;
  plain: string; // 학생 말로 한 줄 (모양 본뜨기 / 획 하나 더하기)
  section: string;
  lab?: { target: string; seed: string; goal: string; chain: string[] };
  concept: { from?: string; head: string; sub: string; hanja: string; caption?: string };
  qs: Q[];
  variantOf: [number, number]; // 1번·2번을 틀렸을 때 낼 비슷한 문제 위치
};
const STONE: Record<StoneId, StoneMeta> = {
  "st-n": {
    char: "ㄴ", plain: "모양 본뜨기", section: "상형",
    concept: { head: "ㄴ은 혀끝이 윗잇몸에 닿는 모양", sub: "자음 기본자(ㄱ ㄴ ㅁ ㅅ ㅇ)는 소리 낼 때 발음 기관의 모양을 본떴어요.", hanja: "舌附上腭之形", caption: "혀끝이 윗잇몸에 닿는 모양" },
    qs: fromJson("st-n", ["ㄴ을 소리 내 보면 혀끝이 어디에 닿는지 느껴 봐요.", "하늘·땅·사람은 모음 이야기예요. 자음 기본자는 몸의 어느 부분을 본떴을까요?", "ㅁ을 소리 내 보면 입술이 붙어요."]),
    variantOf: [2, 2],
  },
  "st-d": {
    char: "ㄷ", plain: "획 하나 더하기", section: "가획",
    lab: { target: "ㄷ", seed: "ㄴ", goal: "ㄴ에 획을 더해 ㄷ 만들기", chain: ["ㄴ", "ㄷ"] },
    concept: { from: "ㄴ", head: "ㄴ에 획을 하나 더하면 ㄷ", sub: "소리가 조금 세게 나면 획을 하나 더해요.", hanja: "聲出稍厲 故加畫" },
    qs: fromJson("st-d", ["기본자는 다섯 개뿐이에요. ㄷ이 그 안에 있을까요?", "획을 한 번만 더해요. 두 번 더하면 다른 글자가 돼요.", "지금 자음 순서(ㄱ ㄴ ㄷ…)와 헷갈리지 않게!"]),
    variantOf: [2, 2],
  },
  "st-t": {
    char: "ㅌ", plain: "획 한 번 더 더하기", section: "가획",
    lab: { target: "ㅌ", seed: "ㄴ", goal: "ㄴ에 획을 더해 ㅌ 만들기", chain: ["ㄴ", "ㄷ", "ㅌ"] },
    concept: { from: "ㄷ", head: "ㄷ에 획을 하나 더하면 ㅌ", sub: "소리가 조금 세게 나면 획을 하나 더해요.", hanja: "聲出稍厲 故加畫" },
    qs: Q_T,
    variantOf: [3, 2],
  },
};

type Judge = { passed: boolean; feedback: string; source: string; misconception?: string | null; needsTeacher?: boolean };

export function StudentFlow({ initial = "home", initialStone = "st-t" }: { initial?: Screen; initialStone?: StoneId }) {
  const d = useDemo();
  const router = useRouter();
  const p = useMemo(() => myProgress(DEMO_STUDENT, d.events), [d.events]);
  const [screen, setScreen] = useState<Screen>(initial);
  const [stone, setStone] = useState<StoneId>(initialStone); // 지금 밟는 돌(ㅌ = 오늘 할 돌, ㄴ·ㄷ = 이미 놓은 돌 다시 해 보기)
  const [labCur, setLabCur] = useState<string | null>("ㄴ"); // 실험실 작업판의 지금 글자(목표 띠 표시용)
  const [q, setQ] = useState(0);
  const [slot, setSlot] = useState<0 | 1>(0); // 지금 풀고 있는 문항 (1번 또는 2번)
  const [picked, setPicked] = useState<number | null>(null);
  const [usedVariant, setUsedVariant] = useState(false);
  const [touched, setTouched] = useState(false);
  const [replayDone, setReplayDone] = useState(false); // ㄴ·ㄷ 다시 해 보기를 마쳤을 때(다리 상태는 그대로)
  const [tab, setTab] = useState<"frame" | "free">("frame");
  const [b1, setB1] = useState("");
  const [b2, setB2] = useState("");
  const [freeText, setFreeText] = useState("");
  const [busy, setBusy] = useState(false);
  const inFlight = useRef(false); // 같은 프레임 연타 방지
  const [held, setHeld] = useState(false); // 서버가 "선생님 확인"으로 넘긴 답: 다시 내지 않고 기다림
  const [gateMsg, setGateMsg] = useState("");
  const [answer, setAnswer] = useState("");

  // 단축키 N으로 시연을 강제로 넘겨도 학생 화면이 따라오게 (SPEC 9-2 실패 대비)
  useEffect(() => {
    // 외부(다른 탭의 단축키) 상태에 화면을 맞춘다
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (d.step >= 2) setScreen((s) => (s === "gate" ? "pass" : s));
    else if (d.step >= 1) setScreen((s) => (s === "concept" || s === "lab" || s === "quiz" ? "splash" : s));
  }, [d.step]);

  const meta = STONE[stone];
  const tPlaced = d.events.some((e) => e.type === "stone_placed" && e.studentId === DEMO_STUDENT && e.stoneId === "st-t");
  const placedT = tPlaced || (stone === "st-t" && (screen === "splash" || screen === "gate" || screen === "pass"));
  const passed = p.arrived || screen === "pass";

  // 숨은 키 K: 실험실 완성 처리 (/demo의 어느 창에서 눌러도)
  const labDone = useCallback(() => setScreen((s) => (s === "lab" ? "quiz" : s)), []);
  useEffect(() => {
    const on = (e: KeyboardEvent) => isLabKey(e) && postLabDone();
    window.addEventListener("keydown", on);
    const off = onLabDone(labDone);
    return () => {
      window.removeEventListener("keydown", on);
      off();
    };
  }, [labDone]);
  const onLabKey = useCallback(
    (e: KeyboardEvent) => (isLabKey(e) ? postLabDone() : handleDemoKey(e, (path) => router.push(path))),
    [router],
  );

  const resetQuiz = () => {
    setQ(0);
    setSlot(0);
    setPicked(null);
    setUsedVariant(false);
  };

  // 돌 하나 시작: ㄴ·ㄷ은 이미 놓인 돌을 다시 해 보기(이벤트를 남기지 않아 시연 단계는 그대로), ㅌ은 오늘 할 돌
  const startStone = (id: StoneId) => {
    if (id === "st-t" && closed && !placedT) return; // 밤 10시 마감 뒤에는 열지 않는다
    if (id === "st-t" && placedT) {
      setScreen(passed ? "home" : "gate");
      return;
    }
    setStone(id);
    setLabCur(STONE[id].lab?.seed ?? null);
    resetQuiz();
    setReplayDone(false);
    if (id === "st-t") setTouched(true);
    setScreen("concept");
  };

  const place = () => {
    if (stone !== "st-t") {
      setReplayDone(true); // 이미 놓인 돌: 다리는 그대로, 축하만
      setScreen("splash");
      return;
    }
    if (!tPlaced) {
      d.add({ type: "stone_placed", studentId: DEMO_STUDENT, stoneId: "st-t" });
      d.reach(1); // 시연 단계 1: ㅌ 첨벙
    }
    setReplayDone(false);
    setScreen("splash");
  };

  const submit = async () => {
    const text = tab === "frame" ? `ㅌ은 ㄷ보다 소리가 ${b1.trim()} 나서 ${b2.trim()} 하나 더했다.` : freeText.trim();
    if (inFlight.current || held) return;
    if ((tab === "frame" && (!b1.trim() || !b2.trim())) || (tab === "free" && text.length < 5)) {
      setGateMsg("빈칸을 채우거나 내 말로 써 볼까요?");
      return;
    }
    inFlight.current = true;
    setBusy(true);
    let j: Judge = { passed: false, feedback: "선생님이 확인할게요", source: "saved", needsTeacher: true };
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: DEMO_STUDENT, stoneId: "st-t", text }),
        signal: AbortSignal.timeout(9000), // 서버가 멈춰도 '확인하는 중…'에 갇히지 않게
      });
      if (res.ok) j = (await res.json()) as Judge;
    } catch {
      /* 서버에 못 닿으면 통과시키지 않는다 */
    }
    inFlight.current = false;
    setBusy(false);
    if (j.passed) {
      setGateMsg("");
      setAnswer(text);
      d.reach(2); // 시연 단계 2: 말해보기 통과
      setScreen("pass");
    } else {
      setGateMsg(j.needsTeacher ? `${j.feedback} · 괜찮아요, 홈에서 다른 돌을 이어 가요` : j.feedback);
      if (j.needsTeacher) setHeld(true);
    }
  };

  const cq = meta.qs[q] ?? meta.qs[0];
  const closed = d.minutesToDeadline <= 0 && d.step < 3; // 전날 밤 22:00 마감 ~ 수업 시작 전
  const answered = picked !== null;
  const ok = answered && picked === cq.ans;
  const tState = placedT ? "done" : touched ? "wet" : "next";

  // 돌 안의 단계: 이름까지 보여 준다(점만 있으면 어디쯤인지 몰라서)
  const stepNames = meta.lab ? ["개념 보기", "실험실에서 만들기", "문제 2개"] : ["개념 보기", "문제 2개"];
  const stepAt = screen === "concept" ? 0 : screen === "lab" ? 1 : stepNames.length - 1;
  const steps = stepNames.map((label, i) => ({ label, n: i + 1, state: i < stepAt ? "done" : i === stepAt ? "on" : "todo" }));

  // 홈 '지금 할 일': 화면에서 가장 먼저 보이는 한 가지
  const mission = placedT
    ? passed
      ? { tag: "오늘 완주", note: "", title: "오늘 길을 다 건넜어요! 🏁", sub: "수업에서 만나요 · 놓은 돌은 다시 눌러 복습할 수 있어요", steps: null, cta: "시연 처음부터 다시", primary: false, go: () => d.reset() }
      : { tag: "지금 할 일", note: "마지막 하나", title: "도착 관문: 내 말로 설명하기", sub: "ㅌ은 왜 ㄷ에 획을 더했을까? 낱말 상자로 한 문장 · 약 1분", steps: ["낱말 고르기", "제출하기"], cta: "도착 관문 가기 →", primary: true, go: () => setScreen("gate") }
    : closed
      ? { tag: "오늘 놓기 마감", note: "", title: "오늘 놓기는 밤 10시에 닫혔어요", sub: "수업에서 함께 건너요 · 놓은 돌은 그대로예요", steps: null, cta: null, primary: false, go: () => {} }
      : { tag: "지금 할 일", note: tState === "wet" ? "하다 멈춘 돌" : "1개 남음", title: "ㅌ 돌 놓기", sub: "ㄷ에 획을 하나 더해 ㅌ을 만들고 문제 2개 풀기 · 약 4분", steps: ["개념 보기", "실험실에서 만들기", "문제 2개"], cta: tState === "wet" ? "이어서 하기 →" : "시작하기 →", primary: true, go: () => startStone("st-t") };

  const doneState = (id: StoneId) => (id === "st-t" ? placedT : p.stones.find((x) => x.id === id)?.state === "placed");
  const stoneCards = (["st-n", "st-d", "st-t"] as StoneId[]).map((id, i) => {
    const m = STONE[id];
    const done = doneState(id);
    const now = id === "st-t" && !placedT && !closed;
    return {
      id,
      num: ["①", "②", "③"][i],
      char: m.char,
      section: m.section,
      title: `${m.char} · ${m.plain}`,
      desc: id === "st-n" ? "혀끝이 윗잇몸에 닿는 모양을 본떴어요" : id === "st-d" ? "ㄴ에 획을 하나 더하면 ㄷ" : "ㄷ에 획을 하나 더하면 ㅌ",
      status: done ? "✓ 놓았어요" : now ? (tState === "wet" ? "하다 멈춤" : "지금 할 차례") : closed ? "마감" : "",
      done,
      now,
      cta: done ? (id === "st-t" ? (passed ? "다시 보기" : "도착 관문 가기 →") : "다시 해 보기") : now ? (tState === "wet" ? "이어서 하기 →" : "시작하기 →") : "수업에서",
      go: () => startStone(id),
      cls: done ? (id === "st-n" ? "start" : id === "st-t" ? "gold" : "") : now ? (tState === "wet" ? "wet" : "next loop-bob") : "",
      label: `${["①", "②", "③"][i]} ${m.char} ${done ? "✓ 놓음" : now ? "· 지금 할 차례" : ""}`,
    };
  });

  const v = {
    liteCls: "",
    controls: false, // 시연용 '완성 처리' 버튼은 숨김(K 키는 그대로 동작)
    labSlot:
      screen === "lab" && meta.lab ? (
        <LabFrame key={stone} target={meta.lab.target} seed={meta.lab.seed} onDone={labDone} onKey={onLabKey} onChange={setLabCur} />
      ) : null,
    labCur,
    labGoal: meta.lab?.goal ?? "",
    labChain: meta.lab?.chain ?? [],
    labTarget: meta.lab?.target ?? meta.char,
    stoneChar: meta.char,
    stoneTitle: `${meta.char} 돌 · ${meta.plain}`,
    stoneSection: meta.section,
    steps,
    concept: { ...meta.concept, char: meta.char, hasLab: Boolean(meta.lab), replay: stone !== "st-t" },
    mission,
    stoneCards,
    goClass: () => router.push("/student/class"),
    splash: replayDone
      ? { char: meta.char, title: `${meta.char} 돌을 다시 굳혔어요`, sub: "이미 놓인 돌이라 다리는 그대로예요 · 복습 끝!", btn: "내 돌로", go: () => setScreen("home") }
      : { char: "ㅌ", title: "첨벙! 한 칸 놓음", sub: "교실 다리에도 한 칸 놓였어요 · 도착 관문이 열렸어요", btn: "도착 관문으로", go: () => setScreen("gate") },
    isHome: screen === "home",
    isConcept: screen === "concept",
    isLab: screen === "lab",
    isQuiz: screen === "quiz",
    isSplash: screen === "splash",
    isGate: screen === "gate",
    isPass: screen === "pass",
    inStone: screen === "concept" || screen === "lab" || screen === "quiz",
    ringText: placedT ? "3/3" : "2/3",
    ringLabel: placedT ? "오늘 놓은 돌 3개 중 3개" : "오늘 놓은 돌 3개 중 2개",
    ringDash: placedT ? "3 0" : "2 3",
    ringColor: placedT ? "#C9A227" : "#9B3A51",
    heroLine: placedT ? (passed ? "완주! 🏁" : "돌 3개 다 놓음") : closed ? "오늘 놓기 마감" : "1칸 남음 · 4분이면 완주 🏁",
    heroSub: placedT ? (passed ? "오늘 수업에서 만나요" : "도착 관문만 남았어요") : closed ? "수업에서 함께 건너요" : "ㅌ 돌 하나만 더 놓으면 돼요",
    titleName: passed ? "집현전 견습생" : "첫걸음 학생",
    star1: true,
    star2: passed ? "#C9A227" : "none",
    star2w: passed ? "0" : "1.8",
    star2c: passed ? "#1C1A18" : "#6B665F",
    qTag: cq.tag,
    qText: cq.text,
    qExplain: cq.explain,
    qFix: cq.fix,
    fbOk: answered && ok,
    fbNo: answered && !ok,
    okLabel: slot === 0 ? "다음 문항" : stone === "st-t" ? "돌 놓기" : "돌 굳히기",
    opts: cq.opts.map((t, j) => {
      let cls = "opt";
      if (answered) cls += j === picked ? (ok ? " ok" : " no") : " dim";
      let mark = ["①", "②", "③", "④"][j];
      if (answered && j === picked) mark = ok ? "✓" : "·";
      return { text: t, mark, cls, font: cq.serif ? "serif" : "", pick: () => !answered && (setPicked(j), stone === "st-t" && setTouched(true)) };
    }),
    afterOk: () => {
      if (slot === 0) {
        setQ(1); // 1번(또는 1번의 비슷한 문제)을 맞혀도 2번은 꼭 푼다
        setSlot(1);
        setPicked(null);
        setUsedVariant(false); // 비슷한 문제 기회는 문항마다 한 번
      } else place();
    },
    toVariant: () => {
      if (usedVariant) {
        setScreen("home"); // 젖은 돌: 불이익 없이 다음에
        return;
      }
      setUsedVariant(true);
      setQ(meta.variantOf[slot]);
      setPicked(null);
    },
    goHome: () => setScreen("home"),
    variantLabel: usedVariant ? "다음에 이어서" : "비슷한 문제로 다시",
    goLab: () => (meta.lab ? setScreen("lab") : (resetQuiz(), setScreen("quiz"))),
    goQuiz: () => {
      resetQuiz();
      setScreen("quiz");
    },
    goGate: () => setScreen("gate"),
    goPass: submit,
    finish: () => setScreen("home"),
    segA: tab === "frame" ? "on" : "",
    segB: tab === "free" ? "on" : "",
    frameTab: tab === "frame",
    freeTab: tab === "free",
    tabFrame: () => setTab("frame"),
    tabFree: () => setTab("free"),
    b1,
    b2,
    setB1: (e: React.ChangeEvent<HTMLInputElement>) => setB1(e.target.value),
    setB2: (e: React.ChangeEvent<HTMLInputElement>) => setB2(e.target.value),
    freeText,
    setFree: (e: React.ChangeEvent<HTMLTextAreaElement>) => setFreeText(e.target.value),
    gateMsg,
    busy,
    answer: answer || EXPLAIN.prepared, // 실제 통과한 답, 없으면(단축키로 넘긴 경우) 준비된 바른 설명
    crossing: true, // 시연 데이터에 아직 건너는 친구가 있음(숫자는 보이지 않음)
    logout: () => setScreen("home"),
    words: ["세게", "크게", "획을", "나란히", "작게"].map((w) => ({
      w,
      cls: "wchip" + (b1 === w || b2 === w ? " used" : ""),
      fill: () => (!b1 ? setB1(w) : !b2 ? setB2(w) : undefined),
    })),
  };

  return (
    <main className="h-dvh w-full" style={{ background: "#FFFFFF", overflow: "clip" }}>
      <FitStage width={1180} height={820}>
        <StudentView {...v} />
      </FitStage>
    </main>
  );
}
