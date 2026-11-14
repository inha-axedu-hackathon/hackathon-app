// lib/content.ts — 단원 개념·오개념 목록 (docs/SPEC.md 6-2, 아이디어 노트의 오개념 7개)
// 문구는 진선우가 검수해서 고친다. 같이 쓰는 파일: 기존 ID는 지우거나 바꾸지 말고 추가만 한다.

export const CONCEPTS = [
  { id: "C1", text: "기본자 5개(ㄱ ㄴ ㅁ ㅅ ㅇ)는 발음 기관을 본떴다(상형)" },
  { id: "C2", text: "가획은 기본자에 획을 더해 새 글자를 만든다" },
  { id: "C3", text: "획을 더하면 소리가 조금 세진다(해례본: 聲出稍厲)" },
  { id: "C4", text: "병서는 같은 글자를 나란히 쓴다(ㄲ ㄸ ㅃ ㅆ ㅉ)" },
  { id: "C5", text: "이체자(ㆁ ㄹ ㅿ)는 가획과 다르게 만든 글자다" },
  { id: "C6", text: "자음은 발음 기관, 모음은 하늘·땅·사람을 본떴다" },
] as const;

export const MISCONCEPTIONS = [
  { id: "M1", text: "ㄲ도 획을 더한 글자다(가획과 병서 혼동)" },
  { id: "M2", text: "소리의 세기를 크기(볼륨)로 생각한다" },
  { id: "M3", text: "ㅋ과 ㄲ은 둘 다 센 소리라 같은 원리로 만들었다" },
  { id: "M4", text: "ㄷ도 기본자다" },
  { id: "M5", text: "ㅏ→ㅑ도 가획이다(모음에 가획을 적용)" },
  { id: "M6", text: "자음 기본자도 자연물(하늘·땅·사람, 산 등)을 본떴다" },
  { id: "M7", text: "ㅇ은 소리가 없는 글자라 목구멍소리 기본자가 아니다" },
] as const;

export type MisconceptionId = (typeof MISCONCEPTIONS)[number]["id"];

/**
 * 돌(글자) 목록. 모둠(team)은 소리 갈래 줄: 1 어금닛 · 2 혓 · 3 입술 · 4 잇 · 5 목구멍.
 * 돌 카드·문항 내용은 data/stones.json(재우·진선우)에 있고, 여기는 구간 계산에 필요한 정보만 둔다.
 */
export const STONES = [
  { id: "st-g", char: "ㄱ", section: "상형", team: 1 },
  { id: "st-k", char: "ㅋ", section: "가획", team: 1 },
  { id: "st-kk", char: "ㄲ", section: "병서", team: 1 },
  { id: "st-n", char: "ㄴ", section: "상형", team: 2 },
  { id: "st-d", char: "ㄷ", section: "가획", team: 2 },
  { id: "st-t", char: "ㅌ", section: "가획", team: 2 },
  { id: "st-tt", char: "ㄸ", section: "병서", team: 2 },
  { id: "st-m", char: "ㅁ", section: "상형", team: 3 },
  { id: "st-b", char: "ㅂ", section: "가획", team: 3 },
  { id: "st-p", char: "ㅍ", section: "가획", team: 3 },
  { id: "st-pp", char: "ㅃ", section: "병서", team: 3 },
  { id: "st-s", char: "ㅅ", section: "상형", team: 4 },
  { id: "st-j", char: "ㅈ", section: "가획", team: 4 },
  { id: "st-ch", char: "ㅊ", section: "가획", team: 4 },
  { id: "st-ss", char: "ㅆ", section: "병서", team: 4 },
  { id: "st-jj", char: "ㅉ", section: "병서", team: 4 },
  { id: "st-o", char: "ㅇ", section: "상형", team: 5 },
  { id: "st-q", char: "ㆆ", section: "가획", team: 5 },
  { id: "st-h", char: "ㅎ", section: "가획", team: 5 },
  { id: "st-hh", char: "ㆅ", section: "병서", team: 5 },
] as const;

/**
 * 키워드만으로 오개념을 대강 찾는다. AI를 못 쓸 때의 대체 결과이자, "키워드만 M/30" 비교 기준선이다.
 * 일부러 단순하게 둔다(표현이 조금만 달라도 놓친다 → 그래서 AI가 필요하다는 근거가 된다).
 */
export function keywordMisconceptions(text: string): MisconceptionId[] {
  const t = text.replace(/\s+/g, " ");
  const has = (...words: string[]) => words.some((w) => t.includes(w));
  const found: MisconceptionId[] = [];
  if (t.includes("ㄲ") && has("획을 더", "획 더", "가획")) found.push("M1");
  if (has("크게", "커서", "큰 소리", "커지", "커져", "볼륨")) found.push("M2");
  if (t.includes("ㅋ") && t.includes("ㄲ") && has("같은 원리", "똑같", "같아")) found.push("M3");
  if (t.includes("ㄷ") && t.includes("기본자") && !has("아니", "아닌")) found.push("M4");
  if (has("ㅏ", "ㅑ", "모음") && has("가획", "획을 더")) found.push("M5");
  if (has("하늘", "땅", "사람", "산 모양") && has("자음", "ㅅ", "ㄱ")) found.push("M6");
  if (t.includes("ㅇ") && has("소리가 없", "소리 없", "소리가 안")) found.push("M7");
  return found;
}
