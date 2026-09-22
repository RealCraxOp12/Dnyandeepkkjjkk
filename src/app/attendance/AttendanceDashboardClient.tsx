"use client";

import { useState } from "react";
import AttendanceClient from "./AttendanceClient";
import UploadClient from "./UploadClient";
import ReportsClient from "./ReportsClient";
import { ClipboardCheck, UploadCloud, FileSpreadsheet } from "lucide-react";

export default function AttendanceDashboardClient({ classes }: { classes: string[] }) {
  const [activeTab, setActiveTab] = useState<"daily" | "upload" | "reports">("daily");

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-auto">
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="p-8 pb-0">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Attendance Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-6">
            Manage daily attendance, upload monthly registers, and download school reports.
          </p>

          <div className="flex gap-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab("daily")}
              className={`pb-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === "daily"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <ClipboardCheck className="w-4 h-4" /> Daily Entry
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`pb-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === "upload"
                  ? "border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400"
                  : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <UploadCloud className="w-4 h-4" /> Bulk Upload (Excel)
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`pb-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === "reports"
                  ? "border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400"
                  : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" /> Reports & Downloads
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1">
        {activeTab === "daily" && <AttendanceClient classes={classes} />}
        {activeTab === "upload" && <UploadClient classes={classes} />}
        {activeTab === "reports" && <ReportsClient classes={classes} />}
      </div>
    </div>
  );
}
