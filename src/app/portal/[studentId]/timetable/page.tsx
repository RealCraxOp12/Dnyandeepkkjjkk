import { Clock } from "lucide-react";

export default async function PortalTimetable({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl flex items-center justify-center">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Class Timetable</h2>
          <p className="text-xs text-slate-500 font-medium">Weekly schedule</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl p-8 text-center shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-slate-300 dark:text-slate-600" />
        </div>
        <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-2">Timetable Pending</h3>
        <p className="text-sm text-slate-500">The class timetable has not been published yet. Once the administration uploads it, it will appear here.</p>
      </div>
    </div>
  );
}
