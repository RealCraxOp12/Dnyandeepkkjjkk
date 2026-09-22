import { prisma } from "@/lib/prisma";
import { Trophy, Loader2 } from "lucide-react";
import { Suspense } from "react";

// Async Data Component
async function ResultsData({ studentId }: { studentId: string }) {
  // Group marks by Exam
  const marks = await prisma.marksRecord.findMany({
    where: { studentId },
    include: { subject: true, exam: true },
    orderBy: { exam: { createdAt: 'desc' } }
  });

  const groupedByExam = marks.reduce((acc, curr) => {
    if (!acc[curr.exam.id]) {
      acc[curr.exam.id] = {
        examName: curr.exam.name,
        records: []
      };
    }
    acc[curr.exam.id].records.push(curr);
    return acc;
  }, {} as Record<string, any>);

  if (Object.keys(groupedByExam).length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-slate-300 dark:text-slate-600" />
        </div>
        <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-1">No Results Yet</h3>
        <p className="text-xs text-slate-500">Marks will appear here once exams are completed and evaluated.</p>
      </div>
    );
  }

  return (
    <>
      {Object.entries(groupedByExam).map(([examId, data]: [string, any]) => {
        let totalObtained = 0;
        let totalMax = 0;
        data.records.forEach((r: any) => {
          if (r.marksObtained !== null && r.totalMarks !== null) {
            totalObtained += r.marksObtained;
            totalMax += r.totalMarks;
          }
        });
        const percentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(1) : "N/A";

        return (
          <div key={examId} className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden mb-6">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 dark:text-slate-200">{data.examName}</h3>
              {percentage !== "N/A" && (
                <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold">
                  {percentage}%
                </div>
              )}
            </div>
            
            <div className="p-0">
              <table className="w-full text-sm">
                <thead className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                  <tr className="text-left text-xs text-slate-400 uppercase tracking-wider font-bold">
                    <th className="p-4">Subject</th>
                    <th className="p-4 text-right">Marks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  {data.records.map((record: any) => (
                    <tr key={record.id}>
                      <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                        {record.subject.name}
                      </td>
                      <td className="p-4 text-right font-medium text-slate-600 dark:text-slate-400">
                        {record.grade ? (
                          <span className="font-bold text-blue-600 dark:text-blue-400">{record.grade}</span>
                        ) : (
                          <span><span className="font-bold text-slate-800 dark:text-white">{record.marksObtained}</span> / {record.totalMarks}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {totalMax > 0 && (
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 flex justify-between items-center border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total</span>
                <span className="font-black text-slate-800 dark:text-white text-lg">{totalObtained} / {totalMax}</span>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

// Instant Loading Page Shell
export default async function PortalResults({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-2xl flex items-center justify-center">
          <Trophy className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Results</h2>
          <p className="text-xs text-slate-500 font-medium">Academic Performance</p>
        </div>
      </div>

      <Suspense fallback={
        <div className="py-12 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-orange-500" />
          <p className="text-sm font-medium animate-pulse">Loading academic records...</p>
        </div>
      }>
        <ResultsData studentId={studentId} />
      </Suspense>
    </div>
  );
}
