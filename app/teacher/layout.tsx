// app/teacher/layout.tsx — 교사 화면 공통: 학생 정보 잠금(SPEC 5-1 T7). /teacher ↔ /teacher/approve 사이에서는 열림이 유지되고,
// 교사 화면을 떠나면 이 레이아웃이 내려가서 다시 잠긴다.
import type { ReactNode } from "react";
import { InfoLockProvider } from "@/components/teacher/InfoLock";

export default function TeacherLayout({ children }: { children: ReactNode }) {
  return <InfoLockProvider>{children}</InfoLockProvider>;
}
