"use client";
// components/student/StudentFlow.tsx — 학생 태블릿 화면의 흐름 (담당: 신재우)
// 디자인(StudentView)에 실제 동작을 붙인다: 실험실(LabFrame) · 굳히기 문항 · 첨벙(시연 단계 1) · 도착 관문(/api/explain, 시연 단계 2)
// 본인 숫자만 보여 준다. 점수·순위·연속 기록·레벨 없음. 학생에게 보이는 판정 문장은 서버가 미리 써 둔 문구뿐.
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { handleDemoKey } from "@/components/DemoKeys";
import { FitStage } from "@/components/FitStage";
import { LabFrame } from "@/components/LabFrame";
import { isLabKey, onLabDone, postLabDone } from "@/components/student/labSignal";
import { myProgress } from "@/components/student/progress";
import { DEMO_STUDENT, EXPLAIN } from "@/components/student/stones";
import { StudentView } from "@/components/student/StudentView";
import { useDemo } from "@/lib/store";

export type Screen = "home" | "concept" | "lab" | "quiz" | "splash" | "gate" | "pass";

// 굳히기 문항 (디자인 확정본, 해례 '聲出稍厲' 기준 · 진선우 검수)
const Q = [
  { tag: "굳히기 1/2", text: "ㄷ에 획을 하나 더해 ㅌ을 만든 까닭은?", opts: ["소리가 조금 세게 나서", "글자를 더 크게 쓰려고", "같은 글자를 나란히 쓰려고"], ans: 0, serif: false,
    explain: '해례는 "소리가 조금 세지면 획을 더한다(聲出稍厲)"고 설명해요.', fix: "‘크게’가 아니라 ‘세게’예요. 큰 소리가 아니라 소리가 조금 세게 나는 거예요." },
  { tag: "굳히기 2/2", text: "ㅌ과 같은 원리로 만든 글자는?", opts: ["ㄲ", "ㅋ", "ㄹ"], ans: 1, serif: true,
    explain: "ㅋ도 ㄱ에 획을 더한 글자예요. 소리가 조금 세졌죠.", fix: "ㄲ은 ㄱ을 나란히 쓴 병서예요. 획을 더한 글자를 다시 찾아봐요." },
  { tag: "굳히기 2/2 · 비슷한 문제", text: "ㄴ → ㄷ처럼 획을 더해 만든 짝은?", opts: ["ㅅ → ㅆ", "ㅁ → ㅂ", "ㅇ → ㆁ"], ans: 1, serif: false,
    explain: "ㅁ에 획을 더하면 ㅂ. 소리가 조금 세져요.", fix: "ㅆ은 나란히 쓴 병서, ㆁ은 모양이 다른 이체자예요." },
];

type Judge = { passed: boolean; feedback: string; source: string };

export function StudentFlow({ initial = "home" }: { initial?: Screen }) {
  const d = useDemo();
  const router = useRouter();
  const p = useMemo(() => myProgress(DEMO_STUDENT, d.events), [d.events]);
  const [screen, setScreen] = useState<Screen>(initial);
  const [q, setQ] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [usedVariant, setUsedVariant] = useState(false);
  const [touched, setTouched] = useState(false);
  const [tab, setTab] = useState<"frame" | "free">("frame");
  const [b1, setB1] = useState("");
  const [b2, setB2] = useState("");
  const [freeText, setFreeText] = useState("");
  const [busy, setBusy] = useState(false);
  const [gateMsg, setGateMsg] = useState("");
  const [answer, setAnswer] = useState("");

  // 단축키 N으로 시연을 강제로 넘겨도 학생 화면이 따라오게 (SPEC 9-2 실패 대비)
  useEffect(() => {
    // 외부(다른 탭의 단축키) 상태에 화면을 맞춘다
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (d.step >= 2) setScreen((s) => (s === "gate" ? "pass" : s));
    else if (d.step >= 1) setScreen((s) => (s === "concept" || s === "lab" || s === "quiz" ? "splash" : s));
  }, [d.step]);

  const tPlaced = d.events.some((e) => e.type === "stone_placed" && e.studentId === DEMO_STUDENT && e.stoneId === "st-t");
  const placedT = tPlaced || screen === "splash" || screen === "gate" || screen === "pass";
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

  const place = () => {
    if (!tPlaced) {
      d.add({ type: "stone_placed", studentId: DEMO_STUDENT, stoneId: "st-t" });
      d.reach(1); // 시연 단계 1: ㅌ 첨벙
    }
    setScreen("splash");
  };

  const submit = async () => {
    const text = tab === "frame" ? `ㅌ은 ㄷ보다 소리가 ${b1.trim()} 나서 ${b2.trim()} 하나 더했다.` : freeText.trim();
    if (busy) return;
    if ((tab === "frame" && (!b1.trim() || !b2.trim())) || (tab === "free" && text.length < 5)) {
      setGateMsg("빈칸을 채우거나 내 말로 써 볼까요?");
      return;
    }
    setBusy(true);
    let j: Judge = { passed: false, feedback: "선생님이 확인할게요", source: "saved" };
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: DEMO_STUDENT, stoneId: "st-t", text }),
      });
      if (res.ok) j = (await res.json()) as Judge;
    } catch {
      /* 서버에 못 닿으면 통과시키지 않는다 */
    }
    setBusy(false);
    if (j.passed) {
      setGateMsg("");
      setAnswer(text);
      d.reach(2); // 시연 단계 2: 말해보기 통과
      setScreen("pass");
    } else setGateMsg(j.feedback);
  };

  const cq = Q[q];
  const answered = picked !== null;
  const ok = answered && picked === cq.ans;
  const stepIdx = screen === "concept" ? 1 : screen === "lab" ? 2 : 3;
  const dot = (n: number) => (n < stepIdx ? "done" : n === stepIdx ? "on" : "");
  const tState = placedT ? "done" : touched ? "wet" : "next";

  const v = {
    liteCls: "",
    controls: false, // 시연용 '완성 처리' 버튼은 숨김(K 키는 그대로 동작)
    labSlot: screen === "lab" ? <LabFrame target="ㅌ" seed="ㄴ" onDone={labDone} onKey={onLabKey} /> : null,
    isHome: screen === "home",
    isConcept: screen === "concept",
    isLab: screen === "lab",
    isQuiz: screen === "quiz",
    isSplash: screen === "splash",
    isGate: screen === "gate",
    isPass: screen === "pass",
    inStone: screen === "concept" || screen === "lab" || screen === "quiz",
    stepName: screen === "concept" ? "개념" : screen === "lab" ? "실험실" : "굳히기",
    d1: dot(1),
    d2: dot(2),
    d3: dot(3),
    tNext: tState === "next",
    tWet: tState === "wet",
    tDone: tState === "done",
    tOpen: tState !== "done",
    tLabel: tState === "done" ? "놓인 돌" : tState === "wet" ? "젖은 돌 · 이어서" : "다음 돌",
    ringText: placedT ? "3/3" : "2/3",
    ringLabel: placedT ? "진행 3/3" : "진행 2/3",
    ringDash: placedT ? "3 0" : "2 3",
    ringColor: placedT ? "#C9A227" : "#9B3A51",
    heroLine: placedT ? "완주! 🏁" : "1칸 남음 · 4분이면 완주 🏁",
    heroSub: placedT ? (passed ? "오늘 수업에서 만나요" : "도착 관문이 남았어요") : "ㄷ → ㅌ 만들기 + 문항 2개",
    titleName: passed ? "집현전 견습생" : "첫걸음 학생",
    star2: passed ? "#C9A227" : "none",
    star2w: passed ? "0" : "1.8",
    star2c: passed ? "#1C1A18" : "#6B665F",
    qTag: cq.tag,
    qText: cq.text,
    qExplain: cq.explain,
    qFix: cq.fix,
    fbOk: answered && ok,
    fbNo: answered && !ok,
    okLabel: q === 0 ? "다음 문항" : "돌 굳히기",
    opts: cq.opts.map((t, j) => {
      let cls = "opt";
      if (answered) cls += j === picked ? (ok ? " ok" : " no") : " dim";
      let mark = ["①", "②", "③"][j];
      if (answered && j === picked) mark = ok ? "✓" : "·";
      return { text: t, mark, cls, font: cq.serif ? "serif" : "", pick: () => !answered && (setPicked(j), setTouched(true)) };
    }),
    afterOk: () => {
      if (q === 0) {
        setQ(1);
        setPicked(null);
      } else place();
    },
    toVariant: () => {
      if (usedVariant) {
        setScreen("home"); // 젖은 돌: 불이익 없이 다음에
        return;
      }
      setUsedVariant(true);
      setQ(2);
      setPicked(null);
    },
    goHome: () => setScreen("home"),
    variantLabel: usedVariant ? "다음에 이어서" : "비슷한 문제로 다시",
    goConcept: () => {
      setTouched(true);
      setScreen(placedT ? (passed ? "home" : "gate") : "concept");
    },
    goLab: () => setScreen("lab"),
    goQuiz: () => {
      setQ(0);
      setPicked(null);
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
    <main className="h-dvh w-full" style={{ background: "#F2F1EB", overflow: "clip" }}>
      <FitStage width={1180} height={820}>
        <StudentView {...v} />
      </FitStage>
    </main>
  );
}
