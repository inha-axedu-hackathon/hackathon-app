"use client";
// 교사 · 징검돌 문제 만들기 (예비교사 11/14 흐름): ① 성취기준 → ② 대단원·소단원·차시 → ③ 서술형/서답형/선다형 → ④ 생성 → ⑤ 교사 검토 → ⑥ 징검다리
// 성취기준은 2022 개정 교육과정 [9국01]~[9국06](data/curriculum/standards-9kuk.json)에서 코드로 고른다. 전문은 서버가 넣는다(app/api/generate).
// AI 결과는 초안이다: 교사가 고치고 뺀 뒤 [징검다리에 올리기]를 눌러야 저장된다(SPEC 6-1 사람 감독). 학생 정보는 쓰지 않는다.
import Link from "next/link";
import { useMemo, useState } from "react";
import std from "@backend/data/curriculum/standards-9kuk.json";
import units from "@backend/data/curriculum/units.json";
import "@/components/teacher/console.css";

type QType = "choice" | "short" | "essay";
type Q = { id: string; type: QType; prompt: string; explain: string; options?: string[]; answer?: number; accepted?: string[]; model?: string; rubric?: string[] };
type Stone = { id: string; char: string; section: string; card: string; concepts: string[]; type: QType; questions: Q[]; off?: boolean };
type Std = { code: string; area: string; text: string; pdfPage: number; note?: string };

const STANDARDS = std.standards as Std[];
const AREAS = std.areas as string[];
const TYPE_INFO: { id: QType; name: string; desc: string; per: string }[] = [
  { id: "choice", name: "선다형", desc: "보기 3개 중 고르기 · 틀리면 비슷한 문제", per: "돌마다 3문항" },
  { id: "short", name: "서답형", desc: "낱말·짧은 구로 답하기 · 허용 답 함께", per: "돌마다 2문항" },
  { id: "essay", name: "서술형", desc: "까닭·원리를 한두 문장으로 · 채점 요소 함께", per: "돌마다 1문항" },
];
const SAVE_KEY = "jingum:generated"; // 시연: 이 브라우저에만 저장(실제 도입 땐 학교 서버)

const STEP_NAMES = ["성취기준", "단원·차시", "문항 유형", "만들기", "교사 검토", "징검다리"];

export default function GeneratePage() {
  const [area, setArea] = useState("문법");
  const [codes, setCodes] = useState<string[]>(["9국04-01"]);
  const [bigId, setBigId] = useState(units.units[0]?.id ?? "");
  const [smallId, setSmallId] = useState("u4-2");
  const [lessonId, setLessonId] = useState("u4-2-2");
  const [type, setType] = useState<QType>("choice");
  const [count, setCount] = useState(2);
  const [memo, setMemo] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [basis, setBasis] = useState("");
  const [tokens, setTokens] = useState(0);
  const [stones, setStones] = useState<Stone[] | null>(null);
  const [saved, setSaved] = useState<number | null>(null);

  const bigs = useMemo(() => units.units.filter((u) => u.codes.some((c) => codes.includes(c))), [codes]);
  const big = bigs.find((u) => u.id === bigId) ?? bigs[0];
  const small = big?.small.find((s) => s.id === smallId) ?? big?.small[0];
  const lesson = small?.lessons.find((l) => l.id === lessonId) ?? small?.lessons[0];

  const step = saved !== null ? 5 : stones ? 4 : busy ? 3 : !codes.length ? 0 : !lesson ? 1 : 2;

  const toggleCode = (c: string) => {
    setCodes((cs) => (cs.includes(c) ? cs.filter((x) => x !== c) : cs.length >= 3 ? cs : [...cs, c]));
    setStones(null);
    setSaved(null);
  };

  const make = async () => {
    if (!lesson || !codes.length || busy) return;
    setBusy(true);
    setErr("");
    setStones(null);
    setSaved(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codes, lessonId: lesson.id, type, count, memo: memo.trim() || undefined }),
        signal: AbortSignal.timeout(40_000),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j?.error ?? "초안을 만들지 못했어요");
      setStones(j.stones);
      setBasis(j.basis?.lesson ?? "");
      setTokens(j.tokens?.used ?? 0);
    } catch (e) {
      setErr(e instanceof Error && e.name !== "TimeoutError" ? e.message : "시간이 오래 걸려 멈췄어요. 다시 눌러 주세요");
    }
    setBusy(false);
  };

  // 검토: 교사가 직접 고친다
  const edit = (si: number, fn: (s: Stone) => Stone) => setStones((all) => (all ? all.map((s, i) => (i === si ? fn(s) : s)) : all));
  const editQ = (si: number, qi: number, fn: (q: Q) => Q) => edit(si, (s) => ({ ...s, questions: s.questions.map((q, i) => (i === qi ? fn(q) : q)) }));
  const kept = stones?.filter((s) => !s.off) ?? [];

  const publish = () => {
    if (!kept.length) return;
    try {
      const prev = JSON.parse(localStorage.getItem(SAVE_KEY) ?? "[]");
      const at = new Date().toISOString();
      localStorage.setItem(SAVE_KEY, JSON.stringify([...prev, ...kept.map((s) => ({ ...s, codes, lesson: basis, reviewed: "teacher", at }))]));
    } catch {
      /* 저장 공간을 못 써도 화면은 이어진다 */
    }
    setSaved(kept.length);
  };

  const input = "w-full rounded-lg border border-[#E6DADC] bg-white px-3 py-2 text-[15px] outline-none focus:border-[#9B3A51]";

  return (
    <div className="on-light" style={{ minHeight: "100dvh", background: "#fff", color: "#1C1A18", fontFamily: "'Pretendard Variable', Pretendard, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 40px", borderBottom: "1px solid #F1E9E9", fontSize: 13, color: "#6B665F" }}>
        <span style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <b style={{ color: "#9B3A51", fontSize: 18, fontFamily: "var(--g-font-title)", fontWeight: 400 }}>징검다리</b>
          <span>2학년 3반 · 국어</span>
        </span>
        <Link href="/teacher" className="btn bs">
          ← 오늘의 수업 예보
        </Link>
      </div>

      <div style={{ maxWidth: 1376, margin: "0 auto", padding: "28px 40px 48px", display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 className="serif" style={{ margin: 0, fontSize: 34, fontWeight: 700, letterSpacing: "-0.02em" }}>징검돌 문제 만들기</h1>
            <p style={{ margin: "6px 0 0", fontSize: 15, color: "#4A4641" }}>성취기준과 차시를 고르면 AI가 징검돌 초안을 만들어요. 선생님이 고친 것만 학생에게 가요.</p>
          </div>
          <ol aria-label="진행 단계" style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: 0, padding: 0, listStyle: "none" }}>
            {STEP_NAMES.map((n, i) => (
              <li key={n} aria-current={i === step ? "step" : undefined} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {i > 0 && <span aria-hidden="true" style={{ width: 12, height: 2, background: i <= step ? "#E2AEBA" : "#EDE8E0" }} />}
                <span style={{ padding: "6px 12px", borderRadius: 999, fontSize: 13, fontWeight: 800, background: i === step ? "#9B3A51" : i < step ? "#F9ECEF" : "#F7F6F2", color: i === step ? "#fff" : i < step ? "#7E2C42" : "#8C8A85" }}>
                  {i < step ? "✓" : i + 1} {n}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 520px) minmax(0, 1fr)", gap: 20, alignItems: "start" }}>
          {/* 왼쪽: ①~④ 고르기 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <section className="bx" aria-labelledby="h1" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <h2 id="h1" style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>① 성취기준 <span style={{ fontSize: 13, fontWeight: 600, color: "#6B665F" }}>코드로 고르기 · 최대 3개</span></h2>
              <div role="tablist" aria-label="영역" style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {AREAS.map((a) => (
                  <button key={a} type="button" role="tab" aria-selected={area === a} onClick={() => setArea(a)} className={`btn ${area === a ? "bp" : "bs"}`} style={{ minHeight: 32, padding: "0 12px", fontSize: 13 }}>
                    {a}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 260, overflowY: "auto", paddingRight: 4 }}>
                {STANDARDS.filter((s) => s.area === area).map((s) => {
                  const on = codes.includes(s.code);
                  return (
                    <label key={s.code} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 10px", borderRadius: 10, cursor: "pointer", background: on ? "#FCF5F6" : "transparent", boxShadow: on ? "inset 0 0 0 1.5px #9B3A51" : "inset 0 0 0 1px #F1E9E9" }}>
                      <input type="checkbox" checked={on} onChange={() => toggleCode(s.code)} style={{ marginTop: 3, accentColor: "#9B3A51" }} />
                      <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <b className="num" style={{ fontSize: 14, color: "#9B3A51" }}>[{s.code}] <span style={{ fontSize: 11, color: "#8C8A85", fontWeight: 600 }}>교육과정 PDF {s.pdfPage}쪽</span></b>
                        <span style={{ fontSize: 14, lineHeight: 1.5 }}>{s.text}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
              {codes.length > 0 && <p style={{ margin: 0, fontSize: 13, color: "#4A4641" }}>고른 기준: {codes.map((c) => `[${c}]`).join(" ")}</p>}
            </section>

            <section className="bx" aria-labelledby="h2" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <h2 id="h2" style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>② 교과서 단원·차시</h2>
              {bigs.length === 0 ? (
                <p style={{ margin: 0, fontSize: 14, color: "#8A5A00", background: "#FBF0D6", borderRadius: 10, padding: "10px 12px" }}>
                  이 성취기준에 연결된 예시 단원이 아직 없어요. 시연은 [9국04-01]로 해 주세요.
                </p>
              ) : (
                <>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "#6B665F" }}>
                    대단원
                    <select className={input} value={big?.id} onChange={(e) => (setBigId(e.target.value), setStones(null))}>
                      {bigs.map((u) => <option key={u.id} value={u.id}>{u.big}</option>)}
                    </select>
                  </label>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "#6B665F" }}>
                    소단원
                    <select className={input} value={small?.id} onChange={(e) => (setSmallId(e.target.value), setLessonId(""), setStones(null))}>
                      {big?.small.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </label>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "#6B665F" }}>
                    차시
                    <select className={input} value={lesson?.id} onChange={(e) => (setLessonId(e.target.value), setStones(null))}>
                      {small?.lessons.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}
                    </select>
                  </label>
                  {lesson && <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "#4A4641", background: "#F7F6F2", borderRadius: 10, padding: "10px 12px" }}>{lesson.content}</p>}
                  <span style={{ fontSize: 12, color: "#8C8A85" }}>{units.note}</span>
                </>
              )}
            </section>

            <section className="bx" aria-labelledby="h3" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <h2 id="h3" style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>③ 문항 유형</h2>
              <div role="radiogroup" aria-label="문항 유형" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 8 }}>
                {TYPE_INFO.map((t) => (
                  <button key={t.id} type="button" role="radio" aria-checked={type === t.id} onClick={() => (setType(t.id), setStones(null))} style={{ textAlign: "left", padding: "10px 12px", borderRadius: 12, border: "none", cursor: "pointer", background: type === t.id ? "#FCF5F6" : "#fff", boxShadow: type === t.id ? "inset 0 0 0 2px #9B3A51" : "inset 0 0 0 1px #E6DADC" }}>
                    <b style={{ display: "block", fontSize: 16 }}>{t.name}</b>
                    <span style={{ display: "block", fontSize: 12, color: "#6B665F", lineHeight: 1.4 }}>{t.desc}</span>
                    <span style={{ display: "block", fontSize: 11, color: "#9B3A51", fontWeight: 700, marginTop: 2 }}>{t.per}</span>
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
                <span style={{ fontWeight: 700 }}>징검돌 수</span>
                <button type="button" className="btn bs" style={{ minHeight: 32, width: 32, padding: 0 }} onClick={() => setCount((c) => Math.max(1, c - 1))} aria-label="하나 줄이기">−</button>
                <b className="num" style={{ minWidth: 16, textAlign: "center" }}>{count}</b>
                <button type="button" className="btn bs" style={{ minHeight: 32, width: 32, padding: 0 }} onClick={() => setCount((c) => Math.min(5, c + 1))} aria-label="하나 늘리기">+</button>
                <span style={{ color: "#8C8A85", fontSize: 12 }}>약 {(count * 2200).toLocaleString()}토큰 · 10~15초</span>
              </div>
              <textarea className={input} rows={2} maxLength={500} value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="덧붙이는 말(선택) · 예) ㄲ을 가획으로 아는 오개념을 꼭 넣어 주세요" style={{ resize: "vertical" }} />
            </section>

            <button type="button" className="btn bp" onClick={make} disabled={busy || !lesson || !codes.length} style={{ minHeight: 52, fontSize: 17 }}>
              {busy ? "AI가 초안을 만드는 중… (약 10초)" : stones ? "④ 다시 만들기" : "④ 문제 만들기 · AI 초안"}
            </button>
            {err && <p role="alert" style={{ margin: 0, fontSize: 14, color: "#A1203B", background: "#FBE6EB", borderRadius: 10, padding: "10px 12px" }}>{err}</p>}
          </div>

          {/* 오른쪽: ⑤ 검토 → ⑥ 징검다리 */}
          <section aria-labelledby="h5" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <h2 id="h5" style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>⑤ 교사 검토 <span style={{ fontSize: 13, fontWeight: 600, color: "#6B665F" }}>글을 눌러 바로 고칠 수 있어요</span></h2>
            {!stones && !busy && (
              <div className="bx" style={{ color: "#6B665F", fontSize: 15, lineHeight: 1.7 }}>
                왼쪽에서 ①~③을 고르고 [문제 만들기]를 누르면 여기에 초안이 나와요.
                <br />
                예시: <b>[9국04-01]</b> › 한글의 창제 원리 › 2차시 가획과 병서 › 선다형
              </div>
            )}
            {busy && <div className="bx" style={{ fontSize: 15, color: "#4A4641" }}>성취기준과 차시 내용을 읽고 징검돌을 만드는 중이에요…</div>}
            {stones && (
              <>
                <div role="note" style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", background: "#FBF1F3", color: "#6E2536", border: "1px solid #F2DDE2", borderRadius: 14, padding: "12px 16px", fontSize: 14 }}>
                  <b>AI 초안이에요. 꼭 교사 본인이 직접 확인하시길 바랍니다.</b>
                  <span className="num">근거: {codes.map((c) => `[${c}]`).join(" ")} · {basis} · {tokens.toLocaleString()}토큰</span>
                </div>
                {stones.map((s, si) => (
                  <article key={s.id} className="bx" style={{ display: "flex", flexDirection: "column", gap: 10, opacity: s.off ? 0.45 : 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span className="serif" style={{ width: 44, height: 44, display: "grid", placeItems: "center", borderRadius: 12, background: "#F7F6F2", fontSize: 22, fontWeight: 900 }}>{s.char || "·"}</span>
                      <b style={{ fontSize: 16 }}>징검돌 {si + 1}</b>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#9B3A51", background: "#F9ECEF", borderRadius: 999, padding: "2px 8px" }}>{s.section}</span>
                      {s.concepts.map((c) => <span key={c} style={{ fontSize: 12, color: "#6B665F" }}>#{c}</span>)}
                      <button type="button" className="btn bs" style={{ marginLeft: "auto", minHeight: 32, fontSize: 13 }} onClick={() => edit(si, (x) => ({ ...x, off: !x.off }))}>
                        {s.off ? "다시 넣기" : "이 돌 빼기"}
                      </button>
                    </div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#6B665F" }}>
                      개념 카드
                      <textarea className={input} rows={2} value={s.card} onChange={(e) => edit(si, (x) => ({ ...x, card: e.target.value }))} />
                    </label>
                    {s.questions.map((q, qi) => (
                      <div key={q.id} style={{ display: "flex", flexDirection: "column", gap: 6, padding: "10px 12px", borderRadius: 12, background: "#FBFAF7", boxShadow: "inset 0 0 0 1px #F1E9E9" }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: "#9B3A51" }}>
                          {TYPE_INFO.find((t) => t.id === q.type)?.name} {q.type === "choice" && qi === 2 ? "· 틀렸을 때 비슷한 문제" : `${qi + 1}`}
                        </span>
                        <input className={input} value={q.prompt} onChange={(e) => editQ(si, qi, (x) => ({ ...x, prompt: e.target.value }))} aria-label="질문" />
                        {q.type === "choice" &&
                          q.options?.map((o, oi) => (
                            <label key={oi} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
                              <input type="radio" name={`${s.id}-${q.id}`} checked={q.answer === oi} onChange={() => editQ(si, qi, (x) => ({ ...x, answer: oi }))} style={{ accentColor: "#0E6F61" }} aria-label={`${oi + 1}번을 정답으로`} />
                              <input className={input} value={o} onChange={(e) => editQ(si, qi, (x) => ({ ...x, options: x.options?.map((v, k) => (k === oi ? e.target.value : v)) }))} style={{ borderColor: q.answer === oi ? "#0E6F61" : undefined }} />
                            </label>
                          ))}
                        {q.type === "short" && (
                          <label style={{ fontSize: 12, fontWeight: 700, color: "#0E6F61" }}>
                            정답·허용 답(쉼표로 구분)
                            <input className={input} value={(q.accepted ?? []).join(", ")} onChange={(e) => editQ(si, qi, (x) => ({ ...x, accepted: e.target.value.split(",").map((v) => v.trim()).filter(Boolean) }))} />
                          </label>
                        )}
                        {q.type === "essay" && (
                          <>
                            <label style={{ fontSize: 12, fontWeight: 700, color: "#0E6F61" }}>
                              모범 답안
                              <textarea className={input} rows={2} value={q.model} onChange={(e) => editQ(si, qi, (x) => ({ ...x, model: e.target.value }))} />
                            </label>
                            <label style={{ fontSize: 12, fontWeight: 700, color: "#0E6F61" }}>
                              채점 요소(줄마다 하나)
                              <textarea className={input} rows={3} value={(q.rubric ?? []).join("\n")} onChange={(e) => editQ(si, qi, (x) => ({ ...x, rubric: e.target.value.split("\n") }))} />
                            </label>
                          </>
                        )}
                        <label style={{ fontSize: 12, fontWeight: 700, color: "#6B665F" }}>
                          {q.type === "essay" ? "교사용 메모" : "해설"}
                          <input className={input} value={q.explain} onChange={(e) => editQ(si, qi, (x) => ({ ...x, explain: e.target.value }))} />
                        </label>
                      </div>
                    ))}
                  </article>
                ))}
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <button type="button" className="btn bp" onClick={publish} disabled={!kept.length || saved !== null} style={{ minHeight: 52, fontSize: 17 }}>
                    ⑥ 검토 끝 · 징검다리에 올리기 ({kept.length}개)
                  </button>
                  {saved !== null && (
                    <span role="status" style={{ fontSize: 15, fontWeight: 700, color: "#0E6F61" }}>
                      ✓ 징검돌 {saved}개를 올렸어요 · 다음 단원 경로를 짤 때 돌 목록에 들어가요
                    </span>
                  )}
                </div>
              </>
            )}
          </section>
        </div>
        <p style={{ margin: 0, fontSize: 12, color: "#8C8A85" }}>성취기준: 2022 개정 국어과 교육과정(중학교) · 시연용 예시 단원 · 시연에서는 이 브라우저에만 저장</p>
      </div>
    </div>
  );
}
