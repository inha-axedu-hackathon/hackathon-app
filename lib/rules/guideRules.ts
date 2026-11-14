// lib/rules/guideRules.ts — 학생 한 명의 "제시 방향" 근거 틀 (교사 화면 전용 · 학생 유형 모달의 마지막 칸)
// 세 축(참여 · 선수 개념 · 환경)의 스펙트럼 위치 → 연구 근거가 있는 지도 전략 카드(STRATEGIES)를 규칙으로 고른다.
// AI(/api/guide)는 여기서 고른 카드 안에서만 교사에게 할 조언을 문장으로 다듬는다. 카드 밖의 전략·출처는 받지 않는다.
// AI를 못 부르면 이 파일의 규칙 문장(ruleGuide)을 그대로 보여 준다.
// 학생·교실 화면에서는 import하지 않는다.

export type Readiness = "준비" | "결손" | "오개념" | "경계";
export type QMix = { 선다형: number; 서답형: number; 서술형: number };

export interface GuideInput {
  /** 0~1 (1 = 있음 · 준비 · 양호 끝) */
  participation: number;
  readinessValue: number;
  environment: number;
  /** 가운데에서 떨어진 정도 0~1 (0.3 미만 = 경계) */
  pStrength: number;
  rStrength: number;
  eStrength: number;
  participationSide: "있음" | "낮음" | "낮아 보임";
  readiness: Readiness;
  misconceptions: string[]; // "M1" 같은 ID만
  barriers: string[];
}

export interface Strategy {
  id: string;
  axis: "참여" | "선수 개념" | "환경" | "공통";
  title: string;
  /** 교사가 할 일 (규칙 문장) */
  act: string;
  /** 짧은 근거 (화면 출처 칸) */
  ref: string;
  url: string;
}

// 근거: 2026-11-14 검색으로 확인한 문헌. 연구 결과를 넘어서 단정하지 않게 문장을 적었다(효과가 약하거나 엇갈리는 건 그렇게 적음).
export const STRATEGIES: Record<string, Strategy> = {
  "R-REFUTE": {
    id: "R-REFUTE",
    axis: "선수 개념",
    title: "오개념은 반박 설명으로 먼저 바로잡기",
    act: "틀린 생각을 그대로 보여 주고 → 왜 틀렸는지 → 맞는 설명 순서로 짚은 뒤, O/X 반박 문항으로 바로 확인해요. 효과가 시간이 지나면 약해질 수 있어 며칠 뒤 같은 오개념을 한 번 더 물어요.",
    ref: "Tippett(2010) 반박 텍스트 20년 연구 리뷰 · 지속성은 후속 메타분석에서 논란",
    url: "https://link.springer.com/doi/10.1007/s10763-010-9203-x",
  },
  "R-HYPER": {
    id: "R-HYPER",
    axis: "선수 개념",
    title: "확신하고 틀린 답은 바로 피드백",
    act: "확신을 갖고 틀린 오답은 정답 피드백을 받으면 오히려 잘 고쳐져요. 정답과 이유를 즉시 보여 주세요.",
    ref: "Butterfield & Metcalfe(2001) 과잉 교정 효과(hypercorrection)",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4084803",
  },
  "R-WORKED": {
    id: "R-WORKED",
    axis: "선수 개념",
    title: "풀이 예시로 기초부터",
    act: "앞 개념(기본자)이 비어 있으면 혼자 풀게 하기보다 단계가 보이는 풀이 예시를 먼저 보여 주고, 익숙해지면 예시 단계를 하나씩 빼요. 처음엔 고르는 문항(선다형)으로 성공 경험을 쌓아요.",
    ref: "Kalyuga 외(2003) 전문성 역전 효과 · 초보자는 풀이 예시가 유리",
    url: "https://en.wikipedia.org/wiki/Expertise_reversal_effect",
  },
  "R-SELFEXP": {
    id: "R-SELFEXP",
    axis: "선수 개념",
    title: "경계면 스스로 설명하게 하고 직접 읽기",
    act: "맞는 생각과 틀린 생각이 섞였거나 AI가 확실히 읽지 못했으면 단정하지 말고, '어떻게 생각했는지' 짧게 설명하게 한 뒤 선생님이 직접 읽어요.",
    ref: "Dunlosky 외(2013) 자기 설명 · 중간 효용",
    url: "https://www.psychologicalscience.org/news/releases/which-study-strategies-make-the-grade.html",
  },
  "R-RETRIEVE": {
    id: "R-RETRIEVE",
    axis: "선수 개념",
    title: "직접 떠올려 쓰는 문항(서답형) 늘리기",
    act: "기초가 있으면 고르는 문항보다 직접 떠올려 쓰는 서답형이 오래 남아요. 단, 정답 피드백을 꼭 함께 주세요. 며칠 간격을 두고 다시 물으면 더 좋아요.",
    ref: "Kang·McDermott·Roediger(2007) 피드백이 있을 때 단답형 > 선다형 · Dunlosky 외(2013) 연습 시험·분산 연습 높은 효용",
    url: "https://www.gwern.net/docs/spaced-repetition/2007-kang.pdf",
  },
  "P-TEACH": {
    id: "P-TEACH",
    axis: "참여",
    title: "또래에게 설명하는 역할(희망자)",
    act: "참여도 뚜렷하고 개념도 갖췄으면 함께 놓기 때 친구에게 설명하는 역할을 권해요. 실제로 가르쳐 보면 1주 뒤 기억이 더 좋았어요. 희망자만, 결과 책임은 지우지 않아요.",
    ref: "Fiorella & Mayer(2013) 가르치며 배우기",
    url: "https://alexandria.ucsb.edu/lib/ark:/48907/f3ms3qvb",
  },
  "P-PROXIMAL": {
    id: "P-PROXIMAL",
    axis: "참여",
    title: "바로 닿는 작은 목표로 쪼개기",
    act: "큰 목표 대신 '오늘 돌 1개' 같은 가까운 목표를 주세요. 가까운 하위 목표를 받은 학생이 효능감과 실력이 함께 올랐어요.",
    ref: "Bandura & Schunk(1981) 근접 목표와 자기효능감",
    url: "https://files.eric.ed.gov/fulltext/ED199284.pdf",
  },
  "P-CHOICE": {
    id: "P-CHOICE",
    axis: "참여",
    title: "2~4개 중에서 고르게 하기",
    act: "어떤 돌부터 할지, 어떤 방식으로 할지 2~4개 선택지를 주세요. 선택이 너무 많으면 효과가 줄어요.",
    ref: "Patall·Cooper·Robinson(2008) 선택 효과 메타분석(41편)",
    url: "https://pubmed.ncbi.nlm.nih.gov/18298272/",
  },
  "P-ASK": {
    id: "P-ASK",
    axis: "참여",
    title: "판정 전에 이유부터 묻기",
    act: "참여 신호가 적어도 이유를 확인하기 전에는 의욕 문제로 보지 않아요. 안부를 묻는 짧은 대화로 무엇이 걸렸는지 먼저 들어요. 스스로 '이걸 배우면 어디에 쓸지' 한 줄 써 보게 하는 건 자신감이 낮은 학생에게 도움이 됐어요(선생님이 가치를 말로 설명하는 것보다).",
    ref: "8유형 기준 2(SPEC 8-1-2) · Hulleman & Harackiewicz(2009) 효용 가치 쓰기(재현 결과는 엇갈림)",
    url: "https://forrt.org/flora-replication-atlas/doi/10.1126/science.1177067/",
  },
  "E-INCLASS": {
    id: "E-INCLASS",
    axis: "환경",
    title: "교실 시간·종이 돌로 기회 보장",
    act: "기기·인터넷이 걸림돌이면 집에서 하는 사전 학습을 전제로 하지 말고, 수업 시간을 줄이지 않은 채 교실에서 짧은 확인 문항을 풀게 하거나 종이 돌·학교 태블릿을 쓰게 해요. 참여 판단은 환경을 푼 뒤에 다시 해요.",
    ref: "van Alten 외(2019) 거꾸로 수업 메타분석 114편: 대면 시간 유지·퀴즈 추가 시 효과 ↑ · Pew(2018) 청소년 17% 기기·인터넷 때문에 숙제 못 함",
    url: "https://doi.org/10.1016/j.edurev.2019.05.003",
  },
  "E-SPACED": {
    id: "E-SPACED",
    axis: "환경",
    title: "짧게 나눠서 여러 번",
    act: "시간이 부족하면 한 번에 몰아서 내기보다 1~2분짜리 돌로 쪼개 며칠에 나눠 주세요. 나눠서 연습하는 쪽이 오래 남아요.",
    ref: "Dunlosky 외(2013) 분산 연습 높은 효용",
    url: "https://www.psychologicalscience.org/news/releases/which-study-strategies-make-the-grade.html",
  },
  "G-MASTERY": {
    id: "G-MASTERY",
    axis: "공통",
    title: "확인 → 교정 → 다시 확인",
    act: "돌을 놓을 때마다 확인 문항으로 보고, 틀리면 교정한 뒤 다시 확인해요(완전학습). 평균 효과는 약 0.5 표준편차로 보고됐어요.",
    ref: "Kulik·Kulik·Bangert-Drowns(1990) 완전학습 메타분석",
    url: "https://doi.org/10.3102/00346543060002265",
  },
};

const ENV_HARD = ["기기 없음", "인터넷 없음", "집에서 하기 어려워요"];

/** 규칙: 세 축 위치 → 전략 카드 ID (중요한 순서) */
export function pickStrategies(g: GuideInput): string[] {
  const ids: string[] = [];
  const envHard = g.barriers.some((b) => ENV_HARD.includes(b));
  // 환경이 먼저(기준 2: 환경을 풀기 전에는 참여 판단 보류)
  if (envHard || (g.environment < 0.5 && g.eStrength >= 0.3)) ids.push("E-INCLASS");
  if (g.barriers.includes("시간 부족")) ids.push("E-SPACED");
  // 선수 개념
  if (g.readiness === "오개념") ids.push("R-REFUTE", "R-HYPER");
  else if (g.readiness === "결손" || g.barriers.includes("내용이 어려움")) ids.push("R-WORKED");
  else if (g.readiness === "경계") ids.push("R-SELFEXP");
  else ids.push("R-RETRIEVE");
  // 참여
  if (g.participationSide === "있음" && g.pStrength >= 0.6 && g.readiness === "준비") ids.push("P-TEACH");
  if (g.participationSide !== "있음" || g.pStrength < 0.3) ids.push("P-ASK", "P-PROXIMAL");
  if (g.participationSide === "낮음" && g.pStrength >= 0.3) ids.push("P-CHOICE");
  ids.push("G-MASTERY");
  return [...new Set(ids)].slice(0, 5);
}

/** 규칙: 돌에 넣을 문항 형식 비율(%) */
export function questionMix(g: GuideInput): QMix {
  const base: Record<Readiness, QMix> = {
    결손: { 선다형: 60, 서답형: 30, 서술형: 10 }, // 풀이 예시 + 고르는 문항으로 성공 경험
    오개념: { 선다형: 30, 서답형: 50, 서술형: 20 }, // O/X 반박 + "왜 틀렸는지" 한 줄
    경계: { 선다형: 30, 서답형: 40, 서술형: 30 }, // 스스로 설명(서술형)으로 생각을 드러내게
    준비: { 선다형: 20, 서답형: 50, 서술형: 30 }, // 직접 떠올리기(서답형) + 설명
  };
  const m = { ...base[g.readiness] };
  // 참여 신호가 약하면 처음 문턱을 낮춘다(근접 목표 · 빠른 성공)
  if (g.participationSide !== "있음") {
    m.선다형 += 10;
    m.서술형 -= 10;
  }
  // 선수 개념이 뚜렷하게 준비면 서술형을 조금 더(풀이 예시는 줄인다 · 전문성 역전)
  if (g.readiness === "준비" && g.rStrength >= 0.6) {
    m.선다형 -= 10;
    m.서술형 += 10;
  }
  return m;
}

/** 스펙트럼 위치를 사람 말로 */
export function readSpectrum(g: GuideInput): string {
  const w = (s: number) => (s >= 0.6 ? "뚜렷하게" : s >= 0.3 ? "어느 정도" : "경계 가까이");
  const p = `참여는 ${g.participationSide} 쪽에 ${w(g.pStrength)}`;
  const r = `선수 개념은 ${g.readiness === "준비" ? "준비" : g.readiness === "결손" ? "결손(아직 모름)" : g.readiness === "오개념" ? "오개념(틀린 생각)" : "경계"} 쪽에 ${w(g.rStrength)}`;
  const e = `환경은 ${g.environment >= 0.5 ? "양호" : "걸림돌"} 쪽에 ${w(g.eStrength)}`;
  return `${p}, ${r}, ${e} 있어요.`;
}

export interface Guide {
  summary: string;
  steps: { text: string; ids: string[] }[];
  mix: QMix;
  mixWhy: string;
  avoid: string;
  ids: string[];
  source: "llm" | "rule";
}

/** AI 없이 규칙만으로 만든 제시 방향 (대체 결과) */
export function ruleGuide(g: GuideInput): Guide {
  const ids = pickStrategies(g);
  const mix = questionMix(g);
  const mixWhy =
    g.readiness === "결손"
      ? "앞 개념이 비어 있어 고르는 문항으로 먼저 성공 경험을 쌓고, 피드백과 함께 서답형을 조금씩 늘려요."
      : g.readiness === "오개념"
        ? "O/X 반박 문항으로 틀린 생각을 드러내고, 서답형으로 '왜 아닌지'를 직접 쓰게 해요."
        : g.readiness === "경계"
          ? "생각이 섞여 있어 서술형으로 스스로 설명하게 하고 선생님이 직접 읽어요."
          : "기초가 있어 직접 떠올려 쓰는 서답형을 중심으로 내요.";
  return {
    summary: readSpectrum(g),
    steps: ids.slice(0, 3).map((id) => ({ text: STRATEGIES[id].act, ids: [id] })),
    mix,
    mixWhy,
    avoid:
      g.participationSide !== "있음"
        ? "이유를 확인하기 전에 '의욕이 없다'고 말하거나 기록하지 않아요."
        : "한 번의 답으로 유형을 굳히지 않아요. 이번 단원 가설이에요.",
    ids,
    source: "rule",
  };
}
