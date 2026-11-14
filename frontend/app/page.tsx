import Link from "next/link";

// 시작 화면 (담당: 신재우) — 시연 진입점
const SCREENS = [
  { href: "/demo", title: "시연", desc: "학생과 교실을 나란히 · 90초 시연", primary: true },
  { href: "/class", title: "교실 화면", desc: "우리 반 다리 · 함께 놓기 · 제자표" },
  { href: "/student", title: "학생 · 징검런", desc: "진행 링 · 돌 굳히기 · 도착 관문" },
  { href: "/teacher", title: "교사 · 수업 예보", desc: "막힌 지점 · 예외 확인" },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center gap-8 px-5 py-12">
      <header className="grid gap-3">
        <p className="text-sm font-semibold tracking-widest text-water">팀 다이버 · 2026 INHA AX-EDU</p>
        <h1 className="text-5xl font-bold tracking-tight">징검다리</h1>
        <p className="text-xl text-mute">
          같은 목적지, 다른 돌 개수.
          <br />
          다리가 끊긴 곳에서 수업이 시작돼요.
        </p>
      </header>
      <ul className="grid gap-3">
        {SCREENS.map((s) => (
          <li key={s.href}>
            <Link
              href={s.href}
              className={`flex items-center justify-between rounded-2xl border px-5 py-4 transition ${
                s.primary ? "border-water bg-water text-white hover:bg-water-deep" : "border-line bg-white hover:border-water"
              }`}
            >
              <span>
                <span className="block text-lg font-bold">{s.title}</span>
                <span className={`block text-sm ${s.primary ? "text-white/80" : "text-mute"}`}>{s.desc}</span>
              </span>
              <span aria-hidden="true">→</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="text-sm text-mute">단축키 · N 다음 · T 수업 시작 · A 승인 · O 오프라인 · Shift+R 처음부터 · 1 학생 · 2 교실 · 3 교사</p>
      <p className="mt-auto pt-6 text-center text-xs text-mute">시연용 가상 학생 데이터 · 모의 인증</p>
    </main>
  );
}
