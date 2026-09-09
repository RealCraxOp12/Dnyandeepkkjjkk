import { BarChart3, TrendingUp, Users } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="flex-1 overflow-auto p-8 bg-transparent">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 flex flex-col transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-slate-700 dark:text-slate-300">Total Admissions</h3>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">0</p>
          <div className="mt-4 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-0"></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 flex flex-col transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-slate-700 dark:text-slate-300">Average Attendance</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">0%</p>
          <div className="mt-4 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 w-0"></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 flex flex-col transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-slate-700 dark:text-slate-300">Exam Pass Rate</h3>
            <BarChart3 className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">0%</p>
          <div className="mt-4 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 w-0"></div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-96 flex flex-col items-center justify-center text-center p-8">
        <BarChart3 className="w-12 h-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">Insufficient Data</h3>
        <p className="text-slate-500 mt-2 max-w-sm">There is not enough data in the system to generate meaningful reports. Please add more students, attendance records, and exam results.</p>
      </div>
    </div>
  );
}
