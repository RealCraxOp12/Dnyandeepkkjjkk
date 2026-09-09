import { Calendar, Search, CheckCircle2, XCircle } from "lucide-react";

export default function AttendancePage() {
  return (
    <div className="flex-1 overflow-auto p-8 bg-transparent">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 mb-8 flex gap-4 items-end transition-colors duration-300">
        <div className="flex-1">
          <label className="block text-sm font-bold text-slate-700 mb-2">Admission Class</label>
          <select className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm outline-none font-medium text-slate-600 dark:text-slate-300 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/30 transition-colors duration-300">
            <option value="">Select Class</option>
            <option value="1st">1st</option>
            <option value="2nd">2nd</option>
            <option value="3rd">3rd</option>
            <option value="4th">4th</option>
            <option value="5th">5th</option>
            <option value="6th">6th</option>
            <option value="7th">7th</option>
            <option value="8th">8th</option>
            <option value="9th">9th</option>
            <option value="10th">10th</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 transition-colors duration-300">Date</label>
          <input type="date" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm outline-none font-medium text-slate-600 dark:text-slate-300 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/30 transition-colors duration-300" />
        </div>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-bold hover:bg-blue-700 shadow-sm transition-all h-[38px]">
          Load Students
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Select a class and date to begin</h3>
          <p className="text-slate-500 mt-2 max-w-sm text-sm">Once loaded, you'll be able to mark students present or absent for the selected day.</p>
        </div>
      </div>
    </div>
  );
}
