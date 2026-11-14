// 학생 · 도착 관문 바로가기 (담당: 신재우). 흐름은 StudentFlow
import { StudentFlow } from "@/components/student/StudentFlow";

export default function ExplainPage() {
  return <StudentFlow initial="gate" />;
}
