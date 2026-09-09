import { prisma } from "@/lib/prisma";
import { getSubjects } from "@/app/actions/results";
import MarksEntryClient from "./MarksEntryClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EnterMarksPage({ params }: { params: Promise<{ examId: string }> }) {
  const resolvedParams = await params;
  const examId = resolvedParams.examId;
  
  const exam = await prisma.exam.findUnique({ where: { id: examId } });
  if (!exam) return <div>Exam not found</div>;

  const subjects = await getSubjects();
  
  // We fetch all active students. In a real app, this might be filtered by class/section.
  const students = await prisma.student.findMany({
    where: { 
      activeStatus: true,
      ...(exam.targetClass ? { currentClass: { equals: exam.targetClass, mode: 'insensitive' } } : {})
    },
    orderBy: [{ currentClass: 'asc' }, { firstName: 'asc' }]
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-transparent p-8">
      <div className="flex items-center justify-between mb-8 max-w-5xl mx-auto w-full shrink-0">
        <Link 
          href="/results"
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Results
        </Link>
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white text-right">{exam.name}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Marks Entry</p>
        </div>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full flex flex-col min-h-0 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors duration-300">
        <MarksEntryClient exam={exam} subjects={subjects} students={students} />
      </div>
    </div>
  );
}
