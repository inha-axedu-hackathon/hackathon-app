import Link from "next/link";

const SCREENS = [
  { href: "/student", title: "학생 · 징검런", desc: "진행 링, 돌 굳히기, 말해보기" },
  { href: "/class", title: "교실 화면", desc: "우리 반 다리, 함께 놓기, 개통과 제자표" },
  { href: "/teacher", title: "교사 · 수업 예보", desc: "막힌 지점, 예외 승인" },
  { href: "/demo", title: "시연", desc: "학생과 교실을 나란히, 단축키 안내" },
];

export default function Home() {
  return (
    <main className="mx-auto flex max-w-xl flex-col gap-6 px-4 py-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">징검다리</h1>
        <p className="text-neutral-600">같은 목적지, 다른 돌 개수. 다리가 끊긴 곳에서 수업이 시작돼요.</p>
      </header>
      <ul className="grid gap-3">
        {SCREENS.map((s) => (
          <li key={s.href}>
            <Link href={s.href} className="block rounded-lg border border-neutral-200 px-4 py-3 hover:bg-neutral-50">
              <span className="font-semibold">{s.title}</span>
              <span className="block text-sm text-neutral-500">{s.desc}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
