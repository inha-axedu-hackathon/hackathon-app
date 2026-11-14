// components/teacher/VerifyNotice.tsx — AI 결과 바로 옆에 붙는 교사 확인 알림 (SPEC 5-1 T1, 6-4 ④)
// 뒷문장은 SPEC 그대로: "꼭 교사 본인이 직접 확인하시길 바랍니다". 붉은색은 도장·예외에만 쓰려고 알림은 먹색 테두리로 둔다
export function VerifyNotice({ source, className = "" }: { source?: string; className?: string }) {
  return (
    <p role="note" className={`flex flex-wrap items-baseline gap-x-2 gap-y-1 rounded-lg border-l-4 border-ink bg-paper-2 px-3 py-2 text-sm sm:text-base ${className}`}>
      <span>막힌 지점과 근거는 AI가 학생 답을 읽은 결과예요. 꼭 교사 본인이 직접 확인하시길 바랍니다.</span>
      {source && <span className="text-sm text-mute">출처: {source}</span>}
    </p>
  );
}
