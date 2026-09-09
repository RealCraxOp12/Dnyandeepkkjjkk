import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default async function MarksheetSelectionPage({ params }: { params: Promise<{ examId: string }> }) {
  const resolvedParams = await params;
  const examId = resolvedParams.examId;
  
  const exam = await prisma.exam.findUnique({ where: { id: examId } });
  if (!exam) return <div>Exam not found</div>;

  const students = await prisma.student.findMany({
    where: { 
      activeStatus: true,
      ...(exam.targetClass ? { currentClass: { equals: exam.targetClass, mode: 'insensitive' } } : {})
    },
    orderBy: [{ currentClass: 'asc' }, { firstName: 'asc' }]
  });

  return (
    <div className="flex-1 overflow-auto p-8 bg-transparent">
      <div className="flex items-center justify-between mb-8 max-w-5xl mx-auto">
        <Link 
          href="/results"
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Results
        </Link>
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white text-right">{exam.name}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Select student for marksheet</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors duration-300">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200">Students Directory</h3>
        </div>
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {students.map((student) => (
            <li key={student.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100">{student.firstName} {student.surname}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Class: {student.currentClass || "Unassigned"} | Reg No: {student.registerNo || "N/A"}
                </p>
              </div>
              <Link 
                href={`/results/${examId}/marksheet/${student.id}`}
                className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50 rounded-lg text-sm font-bold transition-colors"
              >
                <FileText className="w-4 h-4" /> View Marksheet
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
