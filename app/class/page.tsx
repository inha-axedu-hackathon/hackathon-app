"use client";
// 교실 화면 · 우리 반 다리 (담당: 신재우) — docs/SPEC.md 5-0, 5-3 C1~C4, 7-5
// 디자인: 캔버스 "징검다리 · 디자인"의 Stage(1440×810). 화면 크기에 맞춰 통째로 확대·축소한다.
// 11/14: 한 화면에 한 구간(날씨 하나)씩 넘겨 본다(components/class/ClassStage.tsx). 학생도 /student/class에서 같은 화면을 보기만 한다.
// 반·모둠·친구의 숫자는 쓰지 않고 날씨로만 말한다. 숫자는 교사 화면에만.
import { ClassStage } from "@/components/class/ClassStage";

export default function ClassPage() {
  return <ClassStage viewer="class" />;
}
