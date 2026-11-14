// components/teacher/Highlight.tsx — 학생 답에서 AI가 든 근거 구절만 표시한다(근거가 글에 없으면 표시하지 않음)
export function Highlight({ text, quote }: { text: string; quote: string }) {
  const q = quote.trim();
  const i = q ? text.indexOf(q) : -1;
  if (i < 0 || q === text) {
    return q === text ? <mark className="rounded bg-gold/25 px-0.5 text-ink">{text}</mark> : <>{text}</>;
  }
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded bg-gold/25 px-0.5 text-ink">{q}</mark>
      {text.slice(i + q.length)}
    </>
  );
}
