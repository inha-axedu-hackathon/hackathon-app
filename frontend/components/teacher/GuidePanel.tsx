"use client";
// components/teacher/GuidePanel.tsx — 학생 유형 모달의 마지막 칸 "제시 방향" (교사 전용)
// 규칙 문장(lib/rules/guideRules.ts)을 바로 보여 주고, /api/guide가 AI로 이 학생에 맞춰 다듬으면 바꿔 끼운다.
// AI 문장도 규칙이 고른 연구 근거 카드 안에서만 나온다. 아래에 근거 문헌을 붙인다.
import { useEffect, useMemo, useState } from "react";
import { STRATEGIES, ruleGuide, type Guide, type GuideInput } from "@backend/lib/rules/guideRules";

type Res = Guide & { refs?: { id: string; title: string; ref: string; url: string }[]; model?: string };

export function GuidePanel({ input }: { input: GuideInput }) {
  const key = JSON.stringify(input);
  const rule = useMemo(() => ruleGuide(JSON.parse(key) as GuideInput), [key]);
  const [ai, setAi] = useState<{ key: string; res: Res } | null>(null);
  const [failKey, setFailKey] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    // 학생을 빠르게 넘길 때 매번 부르지 않게 잠깐 기다린다
    const t = setTimeout(async () => {
      try {
        const r = await fetch("/api/guide", { method: "POST", headers: { "Content-Type": "application/json" }, body: key, signal: ctrl.signal });
        if (!r.ok) throw new Error(String(r.status));
        setAi({ key, res: (await r.json()) as Res });
      } catch {
        if (!ctrl.signal.aborted) setFailKey(key);
      }
    }, 350);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [key]);

  const res: Res = ai?.key === key ? ai.res : rule;
  const loading = ai?.key !== key && failKey !== key;
  const refs = res.refs ?? res.ids.map((id) => STRATEGIES[id]).filter(Boolean);
  const mixRows = [
    ["선다형", res.mix.선다형, "#C9B8A6"],
    ["서답형", res.mix.서답형, "#1E9E87"],
    ["서술형", res.mix.서술형, "#9B3A51"],
  ] as const;

  return (
    <section className="gd" aria-label="제시 방향" aria-busy={loading}>
      <div className="gd-top">
        <h3>제시 방향 · 이 학생에게는</h3>
        <span className={`gd-src${res.source === "llm" ? " ai" : ""}`}>
          {loading ? "AI가 이 학생에 맞춰 다듬는 중…" : res.source === "llm" ? `AI 조언 · ${res.model ?? "LLM"} · 근거 카드 안에서` : "규칙 조언 · 연구 근거 카드"}
        </span>
      </div>
      <p className="gd-sum">{res.summary}</p>
      <ol className="gd-steps">
        {res.steps.map((s, i) => (
          <li key={i} className={loading ? "dim" : ""}>
            <span>{s.text}</span>
            <span className="gd-tags">
              {s.ids.map((id) => (
                <span key={id}>{STRATEGIES[id]?.title ?? id}</span>
              ))}
            </span>
          </li>
        ))}
      </ol>

      <div className="gd-mix">
        <b>돌 문항 비율 제안</b>
        <div className="gd-bar" role="img" aria-label={`선다형 ${res.mix.선다형}%, 서답형 ${res.mix.서답형}%, 서술형 ${res.mix.서술형}%`}>
          {mixRows.map(([n, v, c]) => v > 0 && <i key={n} style={{ flex: v, background: c }}>{v >= 15 ? `${n} ${v}%` : ""}</i>)}
        </div>
        <p>{res.mixWhy}</p>
      </div>
      <p className="gd-avoid">
        <b>피할 것</b> {res.avoid}
      </p>

      <details className="gd-refs">
        <summary>근거 문헌 {refs.length}개</summary>
        <ul>
          {refs.map((r) => (
            <li key={r.id} id={`gd-${r.id}`}>
              <b>{r.title}</b> — {r.ref}{" "}
              <a href={r.url} target="_blank" rel="noreferrer noopener">
                원문
              </a>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
