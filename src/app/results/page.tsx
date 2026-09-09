import { getExams } from "@/app/actions/results";
import { prisma } from "@/lib/prisma";
import ResultsDashboardClient from "./ResultsDashboardClient";

export default async function ResultsPage() {
  const exams = await getExams();
  const totalStudents = await prisma.student.count();

  return (
    <div className="flex-1 overflow-auto p-8 bg-transparent">
      <ResultsDashboardClient exams={exams} totalStudents={totalStudents} />
    </div>
  );
}
