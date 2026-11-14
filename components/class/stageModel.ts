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
/** 한 화면에 한 구간(날씨 하나)씩: 0 상형(출발 둑 → 가획 앞) · 1 가획(→ 병서 앞) · 2 병서(→ 도착 관문) */
export const PAGE_NAMES = NAMES;
const PAGE_SEC = { x: 200, w: 1040 }; // 한 구간을 화면 가득(양쪽 둑·화살표 자리는 비움)
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

/** 시연 단계가 바뀔 때 저절로 넘길 쪽: 0 예보 → 상형, 1 ㅌ 첨벙 → 가획(ㅌ이 가획 돌), 3 이후 → 잠긴 구간(함께 놓기·밧줄·개통). 2는 그대로 */
export function autoPage(step: number, bridge: BridgeState): number | null {
  if (step <= 0) return 0;
  if (step === 1) return 1;
  if (step === 2) return null;
  const i = bridge.sections.findIndex((s) => s.locked || s.rope > 0);
  return i >= 0 ? i : 2;
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
  minutesToDeadline?: number;
  pick: "O" | "X" | null;
  revealed: boolean;
  onPick: (v: "O" | "X") => void;
  onReveal: () => void;
  onRope: () => void;
  page?: number; // 지금 보이는 구간(0 상형 · 1 가획 · 2 병서)
  viewer?: "class" | "student"; // 학생이 보는 교실 화면은 보기만(정답 공개·밧줄 버튼 없음)
}) {
  const { bridge, scene: k, step, minutesToLesson, pick, revealed } = opts;
  const page = Math.min(2, Math.max(0, opts.page ?? 0));
  const student = opts.viewer === "student";
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
  // 한 화면에는 지금 구간 하나만: 하늘은 화면 전체, 돌 5개는 화면 가득 펼친다
  const cur = { ...sections[page], x: PAGE_SEC.x, w: PAGE_SEC.w, skyX: 0, skyW: 1440, skyCls: "skyp" };
  const lv = cur.lvl;
  const line = `M0 ${lv} L488 ${lv} C528 ${lv} 536 ${lv} 576 ${lv} L856 ${lv} C896 ${lv} 904 ${lv} 944 ${lv} L1440 ${lv}`;
  const curState = bridge.sections[page];
  const curWord = cur.wxWord;
  const pageLine =
    curWord === "맑음" ? `${cur.name}${cur.name === "병서" ? "는" : "은"} 맑아요` : curWord === "구름" ? `${cur.name}엔 구름이 꼈어요` : curWord === "소나기" ? `${cur.name}엔 소나기가 와요` : `${cur.name}엔 먹구름이 꼈어요`;

  const locked = bridge.sections.filter((s) => s.locked).map((s) => s.name);
  const tq = TOGETHER[(locked[0] ?? "병서") as keyof typeof TOGETHER]; // 잠긴 구간의 함께 놓기 문항 (data/stones.json)

  let n = 0;
  const rows = ROWS.map((r, ri) => ({
    name: r[0],
    bg: ri % 2 ? "transparent" : "rgba(255,255,255,.04)",
    cells: r[1].map((c, ci) => c.map((g) => ({ g, delay: `${700 + ci * 260 + ri * 90 + ++n * 18}ms` }))),
  }));

  const CLOCK: Record<Scene, string> = {
    forecast: `밤 10시 마감까지 ${Math.max(0, opts.minutesToDeadline ?? minutesToLesson)}분`,
    splash: `밤 10시 마감까지 ${Math.max(0, opts.minutesToDeadline ?? minutesToLesson)}분`,
    tide: "3교시 · 물때",
    together: "3교시 · 함께 놓기",
    rope: "3교시 · 함께 놓기",
    open: "3교시 · 개통",
    jejapyo: "3교시 · 위에서 보기",
  };
  const LINE: Partial<Record<Scene, string>> = {
    forecast: pageLine,
    splash: curState && curState.weather !== "맑음" ? `첨벙! · ${cur.name}엔 아직 ${curState.weather}` : `해가 났어요 · ${pageLine}`,
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
    sections: [cur],
    page,
    pageWx: sections.map((x) => x.wxWord as Weather), // 아래 점(구간 이름+날씨)용, 숫자 없음
    showStartBank: page === 0, // 출발 둑은 상형 화면에만
    showEndBank: page === 2, // 도착(수업) 둑은 병서 화면에만
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
    controls: !student, // '정답 공개' 버튼(학생 화면에서는 숨김)
    ropeBtn: !student, // '이제 밧줄을 내려요' 버튼(학생 화면에서는 숨김)
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
