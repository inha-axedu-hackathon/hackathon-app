// lib/rules/roster.ts — 교사 화면 전용 전체 명단(가짜 실명·말해보기 원문·라벨·8유형·예외 사유 포함)
// 학생·교실 화면은 이 파일을 import하지 않는다(브라우저 번들에 친구 정보가 실리지 않게). 그쪽은 lib/rules/bridge.ts의 PUBLIC_STUDENTS.
import classData from "@backend/data/class-2-3.json";
import type { Student } from "@backend/lib/types";

export const STUDENTS = classData.students as unknown as Student[];
