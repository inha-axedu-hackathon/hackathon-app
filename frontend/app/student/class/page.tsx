"use client";
// 학생 · 우리 반 다리 보기 (11/14 피드백: 학생도 반 현황을 볼 수 있게) — 교실 화면과 같은 그림을 보기만 한다.
// 숫자 없이 날씨로만. 반 전체 명단(lib/rules/roster)은 불러오지 않는다(bridgeState는 공개 명단만 씀).
import { ClassStage } from "@/components/class/ClassStage";

export default function StudentClassPage() {
  return <ClassStage viewer="student" />;
}
