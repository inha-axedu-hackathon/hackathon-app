// components/class/stageModel.ts — 시연 상태(lib/store) + 다리 계산(lib/rules/bridge) → 디자인 화면(StageView)의 값
// 디자인 캔버스 Stage 아트보드의 renderVals를 옮겼다. 숫자(placed/total)는 쓰지 않고 날씨만 읽는다 (SPEC 5-0)
import { TOGETHER } from "@/components/student/stones";
import type { BridgeState, Weather } from "@/lib/rules/bridge";

export type Scene = "forecast" | "splash" | "tide" | "together" | "rope" | "open" | "jejapyo";
type Wx = "clear" | "cloud" | "dark" | "shower";

const WX_OF: Record<Weather, Wx> = { 맑음: "clear", 구름: "cloud", 먹구름: "dark", 소나기: "shower" };
const T: Record<Wx, { word: string; col: string; name: string; lvl: number }> = {
  // 글자는 먹선(외곽선)을 두르므로 하늘색과 상관없이 읽힌다 (game-skin.css .wxcell .t)
  clear: { word: "맑음", col: "#FFD34D", name: "#FFFFFF", lvl: 150 },
  cloud: { word: "구름", col: "#FFFFFF", name: "#FFFFFF", lvl: 128 },
  dark: { word: "먹구름", col: "#E3EAED", name: "#FFFFFF", lvl: 100 },
  shower: { word: "소나기", col: "#9FF0E0", name: "#FFFFFF", lvl: 84 },
};
const XS = [168, 536, 904]; // 양쪽 둑에 돌이 가리지 않게 (구간 폭 352)
const SKX = [-100, 400, 840];
const SKW = [820, 760, 700];
const NAMES = ["상형", "가획", "병서"];
const GLYPH = [
  ["ㄱ", "ㄴ", "ㅁ", "ㅅ", "ㅇ"],
  ["ㅋ", "ㄷ", "ㅌ", "ㅂ", "ㅍ"],
  ["ㄲ", "ㄸ", "ㅃ", "ㅆ", "ㅉ"],
];
const ROWS: [string, string[][]][] = [
  ["어금닛소리", [["ㄱ"], ["ㅋ"], ["ㄲ"]]],
  ["혓소리", [["ㄴ"], ["ㄷ", "ㅌ"], ["ㄸ"]]],
  ["입술소리", [["ㅁ"], ["ㅂ", "ㅍ"], ["ㅃ"]]],
  ["잇소리", [["ㅅ"], ["ㅈ", "ㅊ"], ["ㅆ", "ㅉ"]]],
  ["목구멍소리", [["ㅇ"], ["ㆆ", "ㅎ"], ["ㆅ"]]],
];

/** 시연 단계 → 장면. 3단계(수업 시작)는 물때를 잠깐 보여 준 뒤 함께 놓기로 넘어간다 */
export function sceneOf(step: number, togetherOpen: boolean): Scene {
  if (step >= 6) return "jejapyo";
  if (step === 5) return "open";
  if (step === 4) return "rope";
  if (step === 3) return togetherOpen ? "together" : "tide";
  if (step === 1) return "splash";
  return "forecast";
}

/** 날씨에 맞춰 돌 모양을 고른다. 칸 수가 아니라 날씨만 본다 */
function stoneCls(sec: number, j: number, wx: Wx, scene: Scene, rope: boolean): string {
  // 시연 학생 ㅌ(가획 3번째 돌)
  if (sec === 1 && j === 2) {
    if (scene === "splash") return "stone drop";
    return wx === "clear" ? "stone" : "stone wet";
  }
  const weak = j === 0 || j === 2; // 구간마다 덜 놓인 자리 두 개 (예시 위치)
  if (rope && weak) return scene === "rope" ? "stone rope rising" : "stone rope";
  if (wx === "shower" && weak) return scene === "tide" ? "stone sunk sinking" : "stone sunk";
  if (wx === "dark" && weak) return "stone wet";
  if (wx === "cloud" && j === 2) return "stone wet";
  return "stone";
}

export function stageVals(opts: {
  bridge: BridgeState;
  scene: Scene;
  step: number;
  minutesToLesson: number;
  pick: "O" | "X" | null;
  revealed: boolean;
  onPick: (v: "O" | "X") => void;
  onReveal: () => void;
  onRope: () => void;
}) {
  const { bridge, scene: k, step, minutesToLesson, pick, revealed } = opts;
  const sections = bridge.sections.map((s, i) => {
    const rope = s.rope > 0 && !bridge.opened;
    // 개통 전 밧줄 구간은 구름(아직 굳히는 중), 개통 후 맑음
    const w: Wx = rope ? (k === "open" || k === "jejapyo" ? "clear" : "cloud") : WX_OF[s.weather];
    const t = T[w];
    return {
      name: NAMES[i],
      x: XS[i],
      skyX: SKX[i],
      skyW: SKW[i],
      skyCls: i ? "skyp sm" : "skyp",
      oClear: w === "clear" ? 1 : 0,
      oCloud: w === "cloud" ? 1 : 0,
      oDark: w === "dark" ? 1 : 0,
      oShower: w === "shower" ? 1 : 0,
      wxClear: w === "clear",
      wxCloud: w === "cloud",
      wxDark: w === "dark",
      wxShower: w === "shower",
      wxWord: t.word,
      wxColor: t.col,
      nameColor: t.name,
      lvl: t.lvl,
      rain: w === "shower",
      glint: k === "tide" && w === "shower",
      rope: rope && (k === "rope" || k === "open"),
      stones: GLYPH[i].map((g, j) => {
        const c = stoneCls(i, j, w, k, rope);
        return {
          g,
          cls: c,
          wcls: (j % 2 ? "sw low" : "sw") + (c.includes("sunk") ? " under" : ""),
          ripple: k === "splash" && i === 1 && j === 2,
        };
      }),
    };
  });
  const L = sections.map((s) => s.lvl);
  const line = `M0 ${L[0]} L488 ${L[0]} C528 ${L[0]} 536 ${L[1]} 576 ${L[1]} L856 ${L[1]} C896 ${L[1]} 904 ${L[2]} 944 ${L[2]} L1440 ${L[2]}`;

  const locked = bridge.sections.filter((s) => s.locked).map((s) => s.name);
  const cloudy = bridge.sections.filter((s) => s.weather !== "맑음");
  const tq = TOGETHER[(locked[0] ?? "병서") as keyof typeof TOGETHER]; // 잠긴 구간의 함께 놓기 문항 (data/stones.json)
  const forecastLine =
    cloudy.length === 0
      ? "모든 구간이 맑아요"
      : bridge.sections.map((s) => `${s.name}${s.weather === "맑음" ? "은 맑고" : s.weather === "구름" ? "은 구름" : "엔 먹구름"}`).join(", ").replace(/, ([^,]*)$/, ", $1");

  let n = 0;
  const rows = ROWS.map((r, ri) => ({
    name: r[0],
    bg: ri % 2 ? "transparent" : "rgba(255,255,255,.04)",
    cells: r[1].map((c, ci) => c.map((g) => ({ g, delay: `${700 + ci * 260 + ri * 90 + ++n * 18}ms` }))),
  }));

  const CLOCK: Record<Scene, string> = {
    forecast: `3교시까지 ${Math.max(0, minutesToLesson)}분`,
    splash: `3교시까지 ${Math.max(0, minutesToLesson)}분`,
    tide: "3교시 · 물때",
    together: "3교시 · 함께 놓기",
    rope: "3교시 · 함께 놓기",
    open: "3교시 · 개통",
    jejapyo: "3교시 · 위에서 보기",
  };
  const LINE: Partial<Record<Scene, string>> = {
    forecast: forecastLine,
    splash: cloudy.length ? `해가 났어요 · ${cloudy.map((s) => `${s.name}엔 아직 ${s.weather}`).join(", ")}` : "모든 구간이 맑아요",
    rope: "구름이 걷히고, 잠긴 돌이 밧줄에 묶여 떠올라요",
  };

  return {
    rootCls: `stage s-${k}`,
    clock: CLOCK[k],
    titleBridge: k === "forecast" || k === "splash" || k === "tide" || k === "rope",
    isSplash: k === "splash",
    isTogether: k === "together",
    isOpen: k === "open",
    isOpenB: k === "open",
    isJeja: k === "jejapyo",
    showLine: Boolean(LINE[k]),
    line: LINE[k] ?? "",
    showCrossing: k === "forecast" || k === "splash",
    showTideBanner: k === "tide" && locked.length > 0,
    showWx: k !== "together" && k !== "jejapyo",
    newFlag: step >= 2 && step <= 5,
    sections,
    rows,
    chain: [],
    waterFill: `${line} L1440 340 L0 340 Z`,
    ovKor: k === "jejapyo",
    ovMath: false,
    ovCaption: "훈민정음 자음 설계도",
    ovName: "국어 · 자음 제자표",
    unitLabel: "2학년 3반 · 「국어의 문자 체계」",
    oCls: "ox o" + (pick === "O" ? " picked" : "") + (revealed ? (tq.answer === "O" ? " right" : " wrong") : ""),
    xCls: "ox x" + (pick === "X" ? " picked" : "") + (revealed ? (tq.answer === "X" ? " right" : " wrong") : ""),
    tideBanner: `${locked.join("·")} 소나기 · 첫 8분 함께 놓기`,
    qText: tq.prompt,
    qAns: tq.answer,
    qExplain: tq.explain,
    notRevealed: !revealed,
    revealed,
    controls: true, // '정답 공개' 버튼
    showNav: false, // 디자인 프로토타입의 장면 이동 막대는 쓰지 않음(단축키 N·T 사용)
    pickO: () => opts.onPick("O"),
    pickX: () => opts.onPick("X"),
    reveal: opts.onReveal,
    toRope: opts.onRope,
    next: () => {},
    prev: () => {},
    nav: [],
  };
}
