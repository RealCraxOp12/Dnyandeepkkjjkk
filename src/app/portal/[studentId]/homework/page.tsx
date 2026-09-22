import { BookOpen, Calendar, Clock, FileText, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function PortalHomework({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;

  // 1. Fetch Student to get their Class
  let student;
  try {
    student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { currentClass: true }
    });
  } catch (error) {
    // Fallback if DB hangs
    const result = await prisma.$queryRaw`SELECT "currentClass" FROM "Student" WHERE id = ${studentId}`;
    if (Array.isArray(result) && result.length > 0) student = result[0] as any;
  }

  // 2. Fetch Assignments for that class
  let assignments: any[] = [];
  if (student?.currentClass) {
    try {
      assignments = await prisma.assignment.findMany({
        where: { targetClass: student.currentClass },
        orderBy: { dueDate: 'desc' }
      });
    } catch (error) {
      const result = await prisma.$queryRaw`SELECT * FROM "Assignment" WHERE "targetClass" = ${student.currentClass} ORDER BY "dueDate" DESC`;
      if (Array.isArray(result)) assignments = result as any[];
    }
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl flex items-center justify-center">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Homework & Assignments</h2>
          <p className="text-xs text-slate-500 font-medium">Daily tasks from teachers for Class {student?.currentClass || "..."}</p>
        </div>
      </div>

      {assignments.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-8 text-center shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-slate-300 dark:text-slate-600" />
          </div>
          <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-2">No Homework Today</h3>
          <p className="text-sm text-slate-500">There are currently no active assignments. Once teachers post homework, you will see it here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment) => {
            const isOverdue = new Date(assignment.dueDate) < new Date();
            
            return (
              <div key={assignment.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 transition-all hover:shadow-md hover:border-purple-200 dark:hover:border-purple-800">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="inline-block px-2 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-bold rounded-lg mb-2">
                      {assignment.subject}
                    </span>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-tight">
                      {assignment.title}
                    </h3>
                  </div>
                  {assignment.fileUrl && (
                    <a href={assignment.fileUrl} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors">
                      <FileText className="w-4 h-4" />
                    </a>
                  )}
                </div>
                
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                  {assignment.description}
                </p>
                
                <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className={`flex items-center gap-1.5 text-xs font-bold ${isOverdue ? 'text-red-500' : 'text-slate-500'}`}>
                    <Clock className="w-3.5 h-3.5" />
                    Due: {new Date(assignment.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
