import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./game-skin.css";
import "./anime-skin.css";
import { DemoKeys } from "@/components/DemoKeys";

export const metadata: Metadata = {
  title: "징검다리",
  description: "같은 목적지, 다른 돌 개수. 다리가 끊긴 곳에서 수업이 시작돼요.",
};

export const viewport: Viewport = {
  themeColor: "#fafaf7",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <head>
        {/* 글꼴: 인터넷이 없으면 시스템 글꼴로 바뀌고 동작은 같다 */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Noto+Serif+KR:wght@500;700;900&display=swap" />
      </head>
      <body className="min-h-dvh bg-paper text-ink">
        <DemoKeys />
        {children}
      </body>
    </html>
  );
}
