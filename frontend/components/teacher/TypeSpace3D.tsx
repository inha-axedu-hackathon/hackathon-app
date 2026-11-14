"use client";
// components/teacher/TypeSpace3D.tsx — 8유형 3D 공간 (담당: 신재우, docs/SPEC.md 8-1-1·8-1-2, 시안 docs/design/student-types-octant.html)
// 끝없는 흰 공간에 8칸 입체를 띄워 마우스로 잡고 돌려 보고, 칸에 올리면 그 유형의 설명과 기본 개입이 뜬다.
// 교사 화면 전용. 숫자는 부모(app/teacher)가 잠금 규칙(1~2명 묶음)을 적용해서 넘긴다. 학생 이름·번호는 받지 않는다.
// 새 패키지 없이 canvas 2D로 원근 투영 · 화가 알고리즘 · 면 단위 마우스 판정을 직접 한다.
import { useEffect, useRef, useState } from "react";
import "./typespace.css";

export interface TypeCell {
  p: "있음" | "낮음";
  r: "준비" | "보충";
  e: "양호" | "걸림돌";
  /** 화면에 보일 인원 (잠금 중이면 "1~2") */
  count: string;
  /** 실제 인원 0명 여부 판단용 (0이면 빈 칸으로 흐리게) */
  empty: boolean;
  stones: string;
}

export type TypeKey = `${TypeCell["p"]}${TypeCell["r"]}${TypeCell["e"]}`;

// SPEC 8-1-1 기본 개입표 문구 + 한 줄 풀이(관찰 근거만, '의욕'이라는 말은 쓰지 않음 · 8-1-2)
export const TYPE_INFO: Record<TypeKey, { who: string; act: string }> = {
  있음준비양호: { who: "스스로 해 오고, 앞 개념(기본자)도 알고, 공부할 환경도 괜찮아요.", act: "심화 돌, 또래 설명 역할(희망자)" },
  있음보충양호: { who: "해 오려고 하지만 앞 개념이 비어 있어요.", act: "선수 개념 돌 추가, 소그룹 지도" },
  낮음준비양호: { who: "앞 개념은 아는데 사전 학습 신호가 적어요. 이유는 아직 몰라요.", act: "선택권 주기, 도전 돌, 동기 탐색 대화(안부 묻기)" },
  낮음보충양호: { who: "사전 학습 신호도 적고 앞 개념도 비어 있어요. 이유는 아직 몰라요.", act: "짧은 목표(작은 돌), 흥미 연결, 1:1 대화" },
  있음준비걸림돌: { who: "해 오고 개념도 알지만, 공부할 환경이 걸림돌이에요.", act: "종이 돌·학교 지급 태블릿으로 기회 보장(밤 10시 마감)" },
  있음보충걸림돌: { who: "해 오려 하지만 환경과 앞 개념이 함께 걸려요.", act: "환경 지원(기기 대여, 교내 학습 공간)을 먼저 하고 보충" },
  낮음준비걸림돌: { who: "신호가 적어 보이지만 환경 때문일 수 있어요. 참여 판단은 미뤄요.", act: "환경을 먼저 해소한 뒤 참여를 다시 판단, 그다음 도전 돌" },
  낮음보충걸림돌: { who: "환경 때문일 수 있어요. 참여 판단은 환경을 푼 뒤에 해요.", act: "환경을 해소한 뒤 참여 문제인지 다시 판단" },
};

const GOOD = [30, 158, 135] as const; // 물빛: 환경 양호(앞쪽)
const HARD = [217, 129, 79] as const; // 노을: 환경 걸림돌(뒤쪽)
const BRAND = "#9B3A51";
const FONT = `"Pretendard Variable", Pretendard, -apple-system, "Apple SD Gothic Neo", sans-serif`;

type V3 = [number, number, number];
type View = { yaw: number; pitch: number; dist: number };
const HOME: View = { yaw: -0.62, pitch: 0.42, dist: 6.4 };
const VIEWS: { id: string; label: string; v: View }[] = [
  { id: "home", label: "처음 시점", v: HOME },
  { id: "front", label: "앞에서 · 참여×선수 개념", v: { yaw: 0, pitch: 0.04, dist: 6.2 } },
  { id: "top", label: "위에서 · 참여×환경", v: { yaw: 0, pitch: 1.32, dist: 6.4 } },
  { id: "side", label: "옆에서 · 선수 개념×환경", v: { yaw: -Math.PI / 2, pitch: 0.04, dist: 6.2 } },
];

const FLOOR = -1.62;
const FACES: { idx: [number, number, number, number]; n: V3 }[] = [
  { idx: [0, 2, 6, 4], n: [-1, 0, 0] },
  { idx: [1, 3, 7, 5], n: [1, 0, 0] },
  { idx: [0, 1, 5, 4], n: [0, -1, 0] },
  { idx: [2, 3, 7, 6], n: [0, 1, 0] },
  { idx: [0, 1, 3, 2], n: [0, 0, -1] },
  { idx: [4, 5, 7, 6], n: [0, 0, 1] },
];
const LIGHT: V3 = (() => {
  const l: V3 = [0.45, 0.85, 0.55];
  const m = Math.hypot(...l);
  return [l[0] / m, l[1] / m, l[2] / m];
})();

// 멀리 떠 있는 작은 큐브들(흰 공간의 깊이감). 매번 같은 자리에 오도록 고정 값.
const DRIFT = Array.from({ length: 16 }, (_, i) => {
  const a = i * 2.399963; // 황금각으로 흩뿌림
  const r = 5.2 + ((i * 37) % 60) / 10;
  return { x: Math.cos(a) * r, z: Math.sin(a) * r, y: -0.8 + ((i * 53) % 50) / 10, s: 0.16 + ((i * 29) % 40) / 100, ph: i * 0.7 };
});

export const keyOf = (c: Pick<TypeCell, "p" | "r" | "e">) => `${c.p}${c.r}${c.e}` as TypeKey;
const titleOf = (c: TypeCell) => `참여 ${c.p === "낮음" && c.e === "걸림돌" ? "낮아 보임" : c.p} · 선수 개념 ${c.r} · 환경 ${c.e}`;
const short = (c: TypeCell) => `${c.p === "낮음" && c.e === "걸림돌" ? "낮아 보임" : `참여 ${c.p}`} · ${c.r}`;

/** 학생 점 (좌표 -1~1: x 참여, y 선수 개념, z 환경). 이름·번호 없이 위치만 */
export interface TypePoint {
  x: number;
  y: number;
  z: number;
}

const keyOfPoint = (p: TypePoint) => `${p.x > 0 ? "있음" : "낮음"}${p.y > 0 ? "준비" : "보충"}${p.z > 0 ? "양호" : "걸림돌"}` as TypeKey;

export function TypeSpace3D({
  cells,
  total,
  points,
  me,
  compact = false,
}: {
  cells: TypeCell[];
  total: number;
  /** 반 학생 점(익명). 학생 정보가 잠긴 동안에는 넘기지 않는다 */
  points?: TypePoint[];
  /** 지금 보는 학생 한 명 (모달). label은 화면에 띄울 짧은 이름표 */
  me?: TypePoint & { label: string };
  /** 모달용: 아래 8칸 목록을 숨기고 높이를 줄인다 */
  compact?: boolean;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const tip = useRef<HTMLDivElement>(null);
  const [hot, setHot] = useState<TypeKey | null>(null); // 마우스가 올라간 칸
  const [pin, setPin] = useState<TypeKey | null>(null); // 눌러서 고정한 칸
  const [listHot, setListHot] = useState<TypeKey | null>(null); // 아래 목록에서 올린 칸
  const [spin, setSpin] = useState(true);
  const [viewId, setViewId] = useState<string>("home");

  // 렌더 루프가 읽는 값 (React 다시 그리기 없이)
  const live = useRef({ cells, hot: null as TypeKey | null, pin: null as TypeKey | null, listHot: null as TypeKey | null, spin: true, points, me });
  useEffect(() => {
    live.current = { cells, hot, pin, listHot, spin, points, me };
  }, [cells, hot, pin, listHot, spin, points, me]);
  const goto = useRef<(v: View) => void>(() => {});

  useEffect(() => {
    const canvas = cv.current!;
    const box = wrap.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, dpr = 1;
    const home: View = live.current.me ? { ...HOME, dist: 5.1 } : HOME;
    const cam: View = { ...home };
    let target: View | null = null;
    let vy = 0, vp = 0; // 관성
    let drag = false, moved = 0, lx = 0, ly = 0, lastTouch = 0;
    let mx = -1, my = -1; // 마우스 위치
    let raf = 0;
    const t0 = performance.now();
    const focusT = new Map<TypeKey, number>(); // 칸별 강조 정도(0~1, 부드럽게)
    let dim = 0;

    goto.current = (v) => {
      target = { ...v };
      vy = vp = 0;
    };

    function fit() {
      const r = box.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width;
      H = r.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(box);

    // 월드 → 화면 (y축 회전 yaw, x축 회전 pitch, 카메라는 +z에서 원점을 봄)
    function P(p: V3) {
      const cy = Math.cos(cam.yaw), sy = Math.sin(cam.yaw), cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
      const x1 = p[0] * cy + p[2] * sy;
      const z1 = -p[0] * sy + p[2] * cy;
      const y2 = p[1] * cp - z1 * sp;
      const z2 = p[1] * sp + z1 * cp;
      const depth = cam.dist - z2;
      const F = Math.min(W * 0.88, H * 1.2);
      const k = F / Math.max(depth, 0.05);
      return { x: W / 2 + x1 * k, y: H * 0.55 - y2 * k, d: depth, k: k / F };
    }

    function blocks() {
      return live.current.cells.map((c) => {
        const s: V3 = [c.p === "있음" ? 1 : -1, c.r === "준비" ? 1 : -1, c.e === "양호" ? 1 : -1];
        const key = keyOf(c);
        const f = focusT.get(key) ?? 0;
        const g = 0.05;
        const off = 0.2 * f; // 강조되면 바깥쪽으로 살짝 떠오름
        const lo = s.map((v) => (v > 0 ? g : -1) + v * off) as V3;
        const hi = s.map((v) => (v > 0 ? 1 : -g) + v * off) as V3;
        const verts: V3[] = [];
        for (let i = 0; i < 8; i++) verts.push([i & 1 ? hi[0] : lo[0], i & 2 ? hi[1] : lo[1], i & 4 ? hi[2] : lo[2]]);
        const center: V3 = [(lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2, (lo[2] + hi[2]) / 2];
        return { c, key, s, f, lo, hi, verts, center };
      });
    }

    function pill(x: number, y: number, lines: [string, string?], col: string, alpha: number, scale: number) {
      const s = Math.max(0.78, Math.min(1.15, scale));
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = `700 ${13 * s}px ${FONT}`;
      const w1 = ctx.measureText(lines[0]).width;
      ctx.font = `600 ${12 * s}px ${FONT}`;
      const w2 = lines[1] ? ctx.measureText(lines[1]).width : 0;
      const w = Math.max(w1, w2) + 20 * s;
      const h = (lines[1] ? 38 : 24) * s;
      const x0 = x - w / 2, y0 = y - h / 2, r = 10 * s;
      ctx.beginPath();
      ctx.roundRect(x0, y0, w, h, r);
      ctx.fillStyle = "rgba(255,255,255,0.92)";
      ctx.shadowColor = "rgba(40,24,20,0.12)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 3;
      ctx.fill();
      ctx.shadowColor = "transparent";
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = col;
      ctx.stroke();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#1C1A18";
      ctx.font = `700 ${13 * s}px ${FONT}`;
      ctx.fillText(lines[0], x, lines[1] ? y - 8 * s : y + 0.5);
      if (lines[1]) {
        ctx.fillStyle = "#4A4641";
        ctx.font = `600 ${12 * s}px ${FONT}`;
        ctx.fillText(lines[1], x, y + 9 * s);
      }
      ctx.restore();
      return { x0, y0, w, h };
    }

    let hits: { key: TypeKey; poly?: { x: number; y: number }[]; rect?: { x0: number; y0: number; w: number; h: number } }[] = [];
    let anchors = new Map<TypeKey, { x: number; y: number }>();

    function inPoly(pts: { x: number; y: number }[], x: number, y: number) {
      let ins = false;
      for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
        const a = pts[i], b = pts[j];
        if (a.y > y !== b.y > y && x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x) ins = !ins;
      }
      return ins;
    }
    function pick(x: number, y: number): TypeKey | null {
      for (const h of hits) {
        if (h.rect && x >= h.rect.x0 && x <= h.rect.x0 + h.rect.w && y >= h.rect.y0 && y <= h.rect.y0 + h.rect.h) return h.key;
        if (h.poly && inPoly(h.poly, x, y)) return h.key;
      }
      return null;
    }

    function draw(now: number) {
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, W, H);
      const L = live.current;
      const meKey = L.me ? keyOfPoint(L.me) : null;
      const focus = L.listHot ?? L.hot ?? L.pin ?? meKey;
      const cap = L.me ? 0.4 : 0.82; // 학생 점을 볼 때는 칸을 옅게 해서 점이 보이게

      // 강조 애니메이션
      for (const c of L.cells) {
        const k = keyOf(c);
        const cur = focusT.get(k) ?? 0;
        focusT.set(k, cur + ((focus === k ? 1 : 0) - cur) * 0.16);
      }
      dim += ((focus ? 1 : 0) - dim) * 0.14;

      // 1) 바닥 격자: 멀어질수록 흐려져 끝없는 흰 바닥처럼
      const R = 11;
      ctx.lineWidth = 1;
      for (let i = -R; i <= R; i++) {
        for (let j = -R; j < R; j++) {
          for (const seg of [
            [[i, FLOOR, j], [i, FLOOR, j + 1]],
            [[j, FLOOR, i], [j + 1, FLOOR, i]],
          ] as [V3, V3][]) {
            const mxw = (seg[0][0] + seg[1][0]) / 2, mzw = (seg[0][2] + seg[1][2]) / 2;
            const dd = Math.hypot(mxw, mzw) / R;
            if (dd >= 1) continue;
            const a = P(seg[0]), b = P(seg[1]);
            if (a.d < 0.4 || b.d < 0.4) continue;
            ctx.strokeStyle = `rgba(120,104,96,${0.16 * (1 - dd) * (1 - dd)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // 2) 멀리 떠 있는 작은 큐브들
      for (const q of DRIFT) {
        const yy = q.y + Math.sin(t * 0.5 + q.ph) * 0.18;
        const ang = t * 0.25 + q.ph;
        const ca = Math.cos(ang), sa = Math.sin(ang);
        const v: V3[] = [];
        for (let i = 0; i < 8; i++) {
          const lx0 = (i & 1 ? 1 : -1) * q.s, ly0 = (i & 2 ? 1 : -1) * q.s, lz0 = (i & 4 ? 1 : -1) * q.s;
          v.push([q.x + lx0 * ca + lz0 * sa, yy + ly0, q.z - lx0 * sa + lz0 * ca]);
        }
        const pv = v.map(P);
        if (pv.some((p) => p.d < 0.6)) continue;
        ctx.strokeStyle = "rgba(155,58,81,0.13)";
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        for (const f of FACES) {
          ctx.beginPath();
          f.idx.forEach((ix, n) => (n ? ctx.lineTo(pv[ix].x, pv[ix].y) : ctx.moveTo(pv[ix].x, pv[ix].y)));
          ctx.closePath();
          ctx.stroke();
        }
      }

      const B = blocks();

      // 3) 바닥 그림자 (블록 발자국을 흐리게)
      ctx.save();
      try {
        ctx.filter = "blur(14px)";
      } catch {}
      ctx.fillStyle = "rgba(60,36,30,0.07)";
      for (const b of B) {
        const lift = b.lo[1] + 1; // 떠오른 만큼 그림자는 옅게
        const corners: V3[] = [
          [b.lo[0], FLOOR, b.lo[2]],
          [b.hi[0], FLOOR, b.lo[2]],
          [b.hi[0], FLOOR, b.hi[2]],
          [b.lo[0], FLOOR, b.hi[2]],
        ];
        const pc = corners.map(P);
        ctx.globalAlpha = b.c.empty ? 0.35 : 1 - Math.max(0, lift) * 0.3;
        ctx.beginPath();
        pc.forEach((p, n) => (n ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // 4) 축 (입체 안을 지나가므로 면보다 먼저 그린다)
      const AX = 1.62;
      const axes: { a: V3; b: V3 }[] = [
        { a: [-AX, 0, 0], b: [AX, 0, 0] },
        { a: [0, -AX, 0], b: [0, AX, 0] },
        { a: [0, 0, -AX], b: [0, 0, AX] },
      ];
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = "rgba(58,54,50,0.55)";
      for (const ax of axes) {
        const a = P(ax.a), b = P(ax.b);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        // + 쪽 화살촉
        const ang = Math.atan2(b.y - a.y, b.x - a.x);
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(b.x - 10 * Math.cos(ang - 0.4), b.y - 10 * Math.sin(ang - 0.4));
        ctx.lineTo(b.x - 10 * Math.cos(ang + 0.4), b.y - 10 * Math.sin(ang + 0.4));
        ctx.closePath();
        ctx.fillStyle = "rgba(58,54,50,0.7)";
        ctx.fill();
      }

      // 5) 블록 면: 깊이순(먼 것부터)으로 반투명하게
      type Face = { pts: { x: number; y: number }[]; d: number; b: (typeof B)[number]; nl: number; outward: boolean };
      const faces: Face[] = [];
      for (const b of B) {
        const pv = b.verts.map(P);
        for (const f of FACES) {
          const d = f.idx.reduce((s, i) => s + pv[i].d, 0) / 4;
          const nl = Math.max(0, f.n[0] * LIGHT[0] + f.n[1] * LIGHT[1] + f.n[2] * LIGHT[2]);
          const outward = f.n[0] * b.s[0] + f.n[1] * b.s[1] + f.n[2] * b.s[2] > 0;
          faces.push({ pts: f.idx.map((i) => ({ x: pv[i].x, y: pv[i].y })), d, b, nl, outward });
        }
      }
      faces.sort((a, b) => b.d - a.d);
      for (const f of faces) {
        const base = f.b.c.e === "양호" ? GOOD : HARD;
        const k = 0.62 + 0.38 * f.nl;
        const rgb = base.map((v) => Math.round(v * k + 255 * (1 - k) * 0.7));
        const ft = f.b.f;
        let a = f.b.c.empty ? 0.05 : f.outward ? 0.34 : 0.2;
        a = a * (1 - 0.6 * dim * (1 - ft)) + (cap - a) * ft;
        ctx.beginPath();
        f.pts.forEach((p, n) => (n ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
        ctx.closePath();
        ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;
        ctx.fill();
        ctx.setLineDash(f.b.c.empty ? [4, 4] : []);
        ctx.lineWidth = 1 + 1.4 * ft;
        ctx.strokeStyle = `rgba(${base[0]},${base[1]},${base[2]},${(f.b.c.empty ? 0.35 : 0.6) * (1 - 0.5 * dim * (1 - ft)) + 0.4 * ft})`;
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 5-2) 학생 점: 반 친구들은 작은 회색 점(익명), 지금 보는 학생은 큰 점 + 바닥까지 내린 선 + 축 눈금
      const SP = 1.0; // 점 좌표(-1~1)를 입체 크기에 맞춤
      if (L.points?.length) {
        const ps = L.points.map((q) => ({ q, p: P([q.x * SP, q.y * SP, q.z * SP]) })).sort((a, z) => z.p.d - a.p.d);
        for (const { q, p } of ps) {
          const rr = 4.2 * Math.max(0.7, Math.min(1.3, p.k * 6.2));
          ctx.beginPath();
          ctx.arc(p.x, p.y, rr, 0, Math.PI * 2);
          ctx.fillStyle = L.me ? "rgba(90,84,78,0.32)" : q.z > 0 ? "rgba(14,111,97,0.85)" : "rgba(170,88,44,0.85)";
          ctx.fill();
          ctx.lineWidth = 1.2;
          ctx.strokeStyle = "rgba(255,255,255,0.9)";
          ctx.stroke();
        }
      }
      // 6) 축 끝 이름 (입체 위에)
      const AL = 1.95;
      const axisLabels: { p: V3; t: string; strong: boolean }[] = [
        { p: [AL, 0, 0], t: "참여 있음 →", strong: true },
        { p: [-AL, 0, 0], t: "참여 낮음", strong: false },
        { p: [0, AL - 0.1, 0], t: "선수 개념 준비 ↑", strong: true },
        { p: [0, -AL + 0.1, 0], t: "선수 개념 보충", strong: false },
        { p: [0, 0, AL], t: "환경 양호 (앞)", strong: true },
        { p: [0, 0, -AL], t: "환경 걸림돌 (뒤)", strong: false },
      ];
      for (const l of axisLabels) {
        const p = P(l.p);
        ctx.save();
        ctx.font = `${l.strong ? 800 : 600} 13px ${FONT}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const w = ctx.measureText(l.t).width + 14;
        ctx.globalAlpha = 1 - 0.45 * dim;
        ctx.fillStyle = l.strong ? "#3A3632" : "rgba(255,255,255,0.9)";
        ctx.beginPath();
        ctx.roundRect(p.x - w / 2, p.y - 11, w, 22, 11);
        ctx.fill();
        if (!l.strong) {
          ctx.strokeStyle = "rgba(58,54,50,0.35)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.fillStyle = l.strong ? "#fff" : "#3A3632";
        ctx.fillText(l.t, p.x, p.y + 0.5);
        ctx.restore();
      }

      // 7) 칸 이름표 (먼 것부터) + 마우스 판정 영역(가까운 것부터)
      // 학생 점이 있으면 이름표를 칸 바깥쪽 모서리로 비켜 점을 가리지 않게
      const shift = L.points?.length || L.me ? 0.34 : 0;
      const tags = B.map((b) => ({ b, p: P([b.center[0] + b.s[0] * shift, b.center[1] + b.s[1] * shift, b.center[2] + b.s[2] * shift]) })).sort((a, z) => z.p.d - a.p.d);
      const newHits: typeof hits = [];
      const newAnchors = new Map<TypeKey, { x: number; y: number }>();
      const rects: { key: TypeKey; rect: { x0: number; y0: number; w: number; h: number } }[] = [];
      for (const { b, p } of tags) {
        const col = b.c.e === "양호" ? "#1E9E87" : "#D9814F";
        const alpha = (b.c.empty ? 0.55 : 1 - 0.6 * dim * (1 - b.f)) * (L.me && focus !== b.key ? 0.6 : 1);
        const rect = pill(p.x, p.y, [short(b.c), `${b.c.count}명 · ${b.c.e}`], focus === b.key ? BRAND : col, alpha, p.k * 6.2);
        rects.push({ key: b.key, rect });
        newAnchors.set(b.key, { x: p.x, y: p.y });
      }
      for (let i = rects.length - 1; i >= 0; i--) newHits.push(rects[i]);
      for (let i = faces.length - 1; i >= 0; i--) newHits.push({ key: faces[i].b.key, poly: faces[i].pts });
      hits = newHits;
      anchors = newAnchors;

      // 9) 지금 보는 학생 점은 맨 위에 (축 이름·칸 이름표에 가리지 않게)
      if (L.me) {
        const m = L.me;
        const w: V3 = [m.x * SP, m.y * SP, m.z * SP];
        const p = P(w);
        const fl = P([w[0], FLOOR, w[2]]);
        // 바닥까지 점선 + 바닥 표시
        ctx.save();
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "rgba(155,58,81,0.6)";
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(fl.x, fl.y);
        ctx.stroke();
        // 세 축 위의 눈금까지 옅은 점선 (스펙트럼 위치)
        ctx.strokeStyle = "rgba(155,58,81,0.28)";
        const ticks: V3[] = [
          [w[0], 0, 0],
          [0, w[1], 0],
          [0, 0, w[2]],
        ];
        for (const tk of ticks) {
          const tp = P(tk);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(tp.x, tp.y);
          ctx.stroke();
        }
        ctx.setLineDash([]);
        for (const tk of ticks) {
          const tp = P(tk);
          ctx.beginPath();
          ctx.arc(tp.x, tp.y, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = BRAND;
          ctx.fill();
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = "#fff";
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.ellipse(fl.x, fl.y, 14 * p.k * 6.2, 5 * p.k * 6.2, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(155,58,81,0.16)";
        ctx.fill();
        ctx.restore();
        // 숨 쉬는 빛 고리 + 점
        const pulse = reduce ? 0 : (Math.sin(t * 3) + 1) / 2;
        const R0 = 10 * Math.max(0.8, Math.min(1.3, p.k * 6.2));
        ctx.beginPath();
        ctx.arc(p.x, p.y, R0 + 6 + pulse * 6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(155,58,81,${0.14 + 0.1 * (1 - pulse)})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, R0, 0, Math.PI * 2);
        ctx.fillStyle = BRAND;
        ctx.shadowColor = "rgba(155,58,81,0.45)";
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.shadowColor = "transparent";
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#fff";
        ctx.stroke();
        // 이름표
        ctx.save();
        ctx.font = `800 14px ${FONT}`;
        const tw = ctx.measureText(m.label).width + 20;
        const ty = p.y - R0 - 24;
        ctx.beginPath();
        ctx.roundRect(p.x - tw / 2, ty - 13, tw, 26, 13);
        ctx.fillStyle = BRAND;
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(m.label, p.x, ty + 0.5);
        ctx.restore();
      }


      // 8) 설명 카드 위치: 마우스 옆, 고정이면 칸 옆
      const tipEl = tip.current;
      if (tipEl) {
        const showKey = L.hot ?? L.listHot ?? L.pin;
        let x = 0, y = 0;
        if (showKey && L.hot && mx >= 0) {
          x = mx;
          y = my;
        } else if (showKey) {
          const an = anchors.get(showKey);
          if (an) {
            x = an.x;
            y = an.y;
          }
        }
        const tw = tipEl.offsetWidth || 300, th = tipEl.offsetHeight || 200;
        let tx = x + 22, ty = y - th / 2;
        if (tx + tw > W - 10) tx = x - tw - 22;
        ty = Math.max(10, Math.min(H - th - 10, ty));
        tx = Math.max(10, tx);
        tipEl.style.transform = `translate(${tx}px, ${ty}px)`;
      }
    }

    function loop(now: number) {
      const L = live.current;
      if (target) {
        // 시점 버튼: 부드럽게 이동 (yaw는 가까운 방향으로)
        let dy = target.yaw - cam.yaw;
        dy = Math.atan2(Math.sin(dy), Math.cos(dy));
        cam.yaw += dy * 0.12;
        cam.pitch += (target.pitch - cam.pitch) * 0.12;
        cam.dist += (target.dist - cam.dist) * 0.12;
        if (Math.abs(dy) < 0.002 && Math.abs(target.pitch - cam.pitch) < 0.002 && Math.abs(target.dist - cam.dist) < 0.01) target = null;
      } else if (!drag) {
        cam.yaw += vy;
        cam.pitch = Math.max(-0.12, Math.min(1.4, cam.pitch + vp));
        vy *= 0.93;
        vp *= 0.9;
        const idle = !L.hot && !L.pin && !L.listHot && Math.abs(vy) < 0.0005;
        if (L.spin && idle && !reduce && now - lastTouch > 2500) cam.yaw += 0.0022;
      }
      draw(now);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    function local(e: PointerEvent | WheelEvent) {
      const r = canvas.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top] as const;
    }
    const down = (e: PointerEvent) => {
      drag = true;
      moved = 0;
      target = null;
      vy = vp = 0;
      [lx, ly] = local(e);
      lastTouch = performance.now();
      canvas.setPointerCapture(e.pointerId);
      canvas.classList.add("drag");
    };
    const move = (e: PointerEvent) => {
      const [x, y] = local(e);
      mx = x;
      my = y;
      if (drag) {
        const dx = x - lx, dyy = y - ly;
        cam.yaw += dx * 0.009;
        cam.pitch = Math.max(-0.12, Math.min(1.4, cam.pitch + dyy * 0.007));
        vy = dx * 0.009;
        vp = dyy * 0.007;
        moved += Math.abs(dx) + Math.abs(dyy);
        lx = x;
        ly = y;
        lastTouch = performance.now();
        if (moved > 6 && live.current.hot) setHot(null);
        return;
      }
      if (e.pointerType === "mouse") {
        const k = pick(x, y);
        if (k !== live.current.hot) setHot(k);
        canvas.classList.toggle("hot", !!k);
      }
    };
    const up = (e: PointerEvent) => {
      if (!drag) return;
      drag = false;
      canvas.classList.remove("drag");
      if (moved < 6) {
        const [x, y] = local(e);
        const k = pick(x, y);
        setPin((p) => (k && p !== k ? k : null)); // 같은 칸을 다시 누르거나 빈 곳을 누르면 고정 해제
        if (e.pointerType !== "mouse") setHot(null);
      }
      lastTouch = performance.now();
    };
    const leave = () => {
      mx = my = -1;
      if (!drag) setHot(null);
      canvas.classList.remove("hot");
    };
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      target = null;
      cam.dist = Math.max(4.2, Math.min(11, cam.dist * (1 + Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY), 60) * 0.0025)));
      lastTouch = performance.now();
    };
    const dbl = () => goto.current(home);
    const key = (e: KeyboardEvent) => {
      const step = 0.15;
      if (e.key === "ArrowLeft") cam.yaw -= step;
      else if (e.key === "ArrowRight") cam.yaw += step;
      else if (e.key === "ArrowUp") cam.pitch = Math.min(1.4, cam.pitch + step);
      else if (e.key === "ArrowDown") cam.pitch = Math.max(-0.12, cam.pitch - step);
      else if (e.key === "+" || e.key === "=") cam.dist = Math.max(4.2, cam.dist - 0.4);
      else if (e.key === "-") cam.dist = Math.min(11, cam.dist + 0.4);
      else return;
      e.preventDefault();
      e.stopPropagation(); // 시연 단축키(DemoKeys)와 겹치지 않게
      target = null;
      lastTouch = performance.now();
    };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    canvas.addEventListener("pointerleave", leave);
    canvas.addEventListener("wheel", wheel, { passive: false });
    canvas.addEventListener("dblclick", dbl);
    canvas.addEventListener("keydown", key);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      canvas.removeEventListener("pointerleave", leave);
      canvas.removeEventListener("wheel", wheel);
      canvas.removeEventListener("dblclick", dbl);
      canvas.removeEventListener("keydown", key);
    };
  }, []);

  const showKey = hot ?? listHot ?? pin;
  const sc = showKey ? cells.find((c) => keyOf(c) === showKey) : undefined;
  const info = sc ? TYPE_INFO[keyOf(sc)] : undefined;

  return (
    <div>
      <div ref={wrap} className={`ts3d${compact ? " compact" : ""}`}>
        <canvas
          ref={cv}
          tabIndex={0}
          role="img"
          aria-label={
            me
              ? `8유형 3D 공간에서 ${me.label}의 자리. 가로 참여, 세로 선수 개념, 앞뒤 환경. 옆의 막대에 같은 내용이 있어요. 화살표 키로 돌리기.`
              : `8유형 3D 공간. 가로 참여, 세로 선수 개념, 앞뒤 환경. 반 ${total}명. 아래 목록에서 칸마다 설명을 볼 수 있어요. 화살표 키로 돌리기.`
          }
        />
        <div className="ts3d-hud">
          <h3>{me ? `${me.label}의 자리` : "8유형 공간"}</h3>
          <p>
            끌어서 돌리기 · 휠로 가까이 · 칸에 올리면 설명
            <br />
            누르면 고정 · 두 번 누르면 처음 시점
          </p>
        </div>
        <div className="ts3d-views" role="group" aria-label="시점 고르기">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              aria-pressed={viewId === v.id}
              onClick={() => {
                setViewId(v.id);
                goto.current(v.v);
                if (v.id !== "home") setSpin(false);
              }}
            >
              {v.label}
            </button>
          ))}
          <button type="button" aria-pressed={spin} onClick={() => setSpin((s) => !s)}>
            {spin ? "천천히 도는 중" : "멈춤"}
          </button>
        </div>
        <div className="ts3d-key" aria-hidden="true">
          <span>
            <i style={{ background: "#1E9E87" }} />
            환경 양호 · 앞쪽
          </span>
          <span>
            <i style={{ background: "#D9814F" }} />
            환경 걸림돌 · 뒤쪽
          </span>
          {!me && (
            <span>
              <i style={{ background: "transparent", border: "1.5px dashed #9A948C" }} />
              0명
            </span>
          )}
          {(points?.length ?? 0) > 0 && (
            <span>
              <i style={{ background: me ? "rgba(90,84,78,0.4)" : "#3A3632", borderRadius: "50%" }} />
              {me ? "반 친구(익명)" : "학생 한 명"}
            </span>
          )}
          {me && (
            <span>
              <i style={{ background: BRAND, borderRadius: "50%" }} />
              가운데 면에 가까울수록 경계
            </span>
          )}
        </div>
        <span className="ts3d-hint">이번 단원 가설 · 학생에게 보이지 않아요</span>

        <div ref={tip} className={`ts3d-tip${sc && info ? " show" : ""}`} aria-hidden="true">
          {sc && info && (
            <>
              <span className="tag" style={{ background: sc.e === "양호" ? "#1E9E87" : "#D9814F" }}>
                환경 {sc.e} · {sc.e === "양호" ? "앞쪽" : "뒤쪽"}
              </span>
              <p className="tt">{titleOf(sc)}</p>
              <p className="who">{info.who}</p>
              <p className="act">
                <b>기본 개입</b>
                {info.act}
              </p>
              <div className="row">
                <span>
                  경로 규칙 · <b>{sc.stones}</b>
                </span>
                <span>
                  <span className="n">{sc.count}</span>명
                </span>
              </div>
              <p className="foot">관찰한 근거로 세운 이번 단원 가설이에요 · 선생님이 확인해서 바꿀 수 있어요</p>
            </>
          )}
        </div>
      </div>

      {!compact && (
      <div className="ts3d-list" role="list" aria-label="8유형 목록">
        {cells.map((c) => {
          const k = keyOf(c);
          return (
            <div role="listitem" key={k} style={{ display: "contents" }}>
              <button
                type="button"
                aria-pressed={pin === k}
                className={showKey === k ? "on" : ""}
                onMouseEnter={() => setListHot(k)}
                onMouseLeave={() => setListHot(null)}
                onFocus={() => setListHot(k)}
                onBlur={() => setListHot(null)}
                onClick={() => setPin((p) => (p === k ? null : k))}
                aria-label={`${titleOf(c)}, ${c.count}명, 기본 개입 ${TYPE_INFO[k].act}`}
              >
                <span className="sw" style={{ background: c.e === "양호" ? "#1E9E87" : "#D9814F", opacity: c.empty ? 0.35 : 1 }} />
                <span className="l">
                  <b>{short(c)}</b>
                  환경 {c.e} · {c.stones}
                </span>
                <span className="c">{c.count}</span>
              </button>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
