import type { Metadata, Viewport } from "next";
import "./globals.css";
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
      <body className="min-h-dvh bg-paper text-ink">
        <DemoKeys />
        {children}
        <p className="pointer-events-none fixed right-3 bottom-2 z-50 rounded bg-paper/80 px-1.5 text-xs text-mute">
          시연용 가상 학생 데이터 · 모의 인증
        </p>
      </body>
    </html>
  );
}
