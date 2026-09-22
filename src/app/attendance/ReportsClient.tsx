"use client";

import { useState } from "react";
import { Download, Loader2, FileSpreadsheet, BarChart2 } from "lucide-react";
import * as XLSX from "xlsx";
import { getMonthlyAttendanceData, getYearlyAttendanceData } from "@/app/actions/attendance-reports";

export default function ReportsClient({ classes }: { classes: string[] }) {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const months = [
    { value: 1, label: "January" }, { value: 2, label: "February" }, { value: 3, label: "March" },
    { value: 4, label: "April" }, { value: 5, label: "May" }, { value: 6, label: "June" },
    { value: 7, label: "July" }, { value: 8, label: "August" }, { value: 9, label: "September" },
    { value: 10, label: "October" }, { value: 11, label: "November" }, { value: 12, label: "December" }
  ];

  const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();

  // Helper to generate a sheet for a specific class's monthly data
  const generateMonthlySheetForClass = (students: any[], year: number, month: number, className: string) => {
    const daysInMonth = getDaysInMonth(year, month);
    
    const data = students.map(student => {
      const row: any = {
        "Reg No": student.registerNo || "-",
        "Student Name": `${student.firstName} ${student.surname}`,
        "Class": student.currentClass,
      };

      let presentCount = 0;
      let totalCount = 0; // Days marked (ignoring empty)

      // Map existing records
      const recordMap: Record<number, string> = {};
      student.attendance.forEach((att: any) => {
        const date = new Date(att.date);
        recordMap[date.getUTCDate()] = att.status;
      });

      for (let i = 1; i <= daysInMonth; i++) {
        const status = recordMap[i];
        let cellVal = "";
        if (status === "PRESENT") { cellVal = "P"; presentCount++; totalCount++; }
        else if (status === "ABSENT") { cellVal = "A"; totalCount++; }
        else if (status === "LEAVE") { cellVal = "L"; totalCount++; }
        else if (status === "HALF_DAY") { cellVal = "HD"; presentCount += 0.5; totalCount++; }
        
        row[`${i}`] = cellVal;
      }

      row["Total Present"] = presentCount;
      row["Total Absent"] = totalCount - presentCount; // simplifying
      row["Attendance %"] = totalCount > 0 ? ((presentCount / totalCount) * 100).toFixed(2) + "%" : "0%";

      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Auto-size columns slightly
    worksheet['!cols'] = [
      { wch: 15 }, // Reg No
      { wch: 30 }, // Name
      { wch: 10 }, // Class
      ...Array.from({ length: daysInMonth }).map(() => ({ wch: 4 })), // Days
      { wch: 15 }, // Total Present
      { wch: 15 }, // Total Absent
      { wch: 15 }, // %
    ];

    return worksheet;
  };

  const handleDownloadClassMonthly = async () => {
    if (!selectedClass) return;
    setIsGenerating('class_monthly');
    try {
      const students = await getMonthlyAttendanceData(selectedYear, selectedMonth, selectedClass);
      const worksheet = generateMonthlySheetForClass(students, selectedYear, selectedMonth, selectedClass);
      
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, `Class_${selectedClass}`);
      XLSX.writeFile(workbook, `Attendance_Monthly_${selectedClass}_${selectedMonth}_${selectedYear}.xlsx`);
    } catch (error) {
      console.error(error);
    }
    setIsGenerating(null);
  };

  const handleDownloadAllStandardsMonthly = async () => {
    setIsGenerating('all_monthly');
    try {
      const allStudents = await getMonthlyAttendanceData(selectedYear, selectedMonth);
      const workbook = XLSX.utils.book_new();

      // Group students by class
      const grouped: Record<string, any[]> = {};
      allStudents.forEach(s => {
        const c = s.currentClass || "Unassigned";
        if (!grouped[c]) grouped[c] = [];
        grouped[c].push(s);
      });

      // Sort classes and add sheets
      const sortedClasses = Object.keys(grouped).sort((a, b) => parseInt(a) - parseInt(b));
      
      for (const className of sortedClasses) {
        const worksheet = generateMonthlySheetForClass(grouped[className], selectedYear, selectedMonth, className);
        // Excel sheet names max length is 31 chars
        let safeName = `Class_${className}`.substring(0, 31);
        XLSX.utils.book_append_sheet(workbook, worksheet, safeName);
      }

      XLSX.writeFile(workbook, `Attendance_All_Standards_Monthly_${selectedMonth}_${selectedYear}.xlsx`);
    } catch (error) {
      console.error(error);
    }
    setIsGenerating(null);
  };

  const handleDownloadClassYearly = async () => {
    if (!selectedClass) return;
    setIsGenerating('class_yearly');
    try {
      const students = await getYearlyAttendanceData(selectedYear, selectedClass);
      
      const data = students.map(student => {
        let presentCount = 0;
        let totalCount = student.attendance.length;

        student.attendance.forEach((att: any) => {
          if (att.status === "PRESENT") presentCount++;
          else if (att.status === "HALF_DAY") presentCount += 0.5;
        });

        return {
          "Reg No": student.registerNo || "-",
          "Student Name": `${student.firstName} ${student.surname}`,
          "Class": student.currentClass,
          "Total Working Days (Marked)": totalCount,
          "Total Days Present": presentCount,
          "Total Days Absent/Leave": totalCount - presentCount,
          "Yearly Attendance %": totalCount > 0 ? ((presentCount / totalCount) * 100).toFixed(2) + "%" : "0%",
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(data);
      worksheet['!cols'] = [
        { wch: 15 }, { wch: 30 }, { wch: 10 }, { wch: 25 }, { wch: 20 }, { wch: 25 }, { wch: 20 }
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, `Yearly_${selectedYear}`);
      XLSX.writeFile(workbook, `Attendance_Yearly_${selectedClass}_${selectedYear}.xlsx`);
    } catch (error) {
      console.error(error);
    }
    setIsGenerating(null);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
            <BarChart2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Global Report Settings</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Select parameters to apply to the downloads below.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-700">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Class (For Class-specific reports)</label>
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm outline-none font-medium text-slate-600 dark:text-slate-300 focus:border-purple-500"
            >
              <option value="">Select Class</option>
              {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Month</label>
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm outline-none font-medium text-slate-600 dark:text-slate-300 focus:border-purple-500"
            >
              {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Year</label>
            <input 
              type="number" 
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm outline-none font-medium text-slate-600 dark:text-slate-300 focus:border-purple-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Class Monthly */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">Class Monthly Report</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Detailed day-by-day attendance for the selected class and month.</p>
          </div>
          <button 
            onClick={handleDownloadClassMonthly}
            disabled={!selectedClass || !!isGenerating}
            className="w-full flex justify-center items-center gap-2 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-md text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-50"
          >
            {isGenerating === 'class_monthly' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Download .xlsx
          </button>
        </div>

        {/* All Standards Monthly */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-purple-200 dark:border-purple-900/50 p-6 flex flex-col justify-between ring-1 ring-purple-100 dark:ring-purple-900/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-[10px] font-bold px-2 py-1 rounded-bl-lg">MULTI-SHEET</div>
          <div>
            <h3 className="font-bold text-purple-900 dark:text-purple-300 mb-2">All Standards Monthly</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">One massive Excel file containing a separate sheet for every class in the school for the selected month.</p>
          </div>
          <button 
            onClick={handleDownloadAllStandardsMonthly}
            disabled={!!isGenerating}
            className="w-full flex justify-center items-center gap-2 py-2 bg-purple-600 text-white rounded-md text-sm font-bold hover:bg-purple-700 transition-all disabled:opacity-50"
          >
            {isGenerating === 'all_monthly' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
            Download Master File
          </button>
        </div>

        {/* Class Yearly */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">Class Yearly Summary</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Total days present vs total working days for the selected class over the entire year.</p>
          </div>
          <button 
            onClick={handleDownloadClassYearly}
            disabled={!selectedClass || !!isGenerating}
            className="w-full flex justify-center items-center gap-2 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-md text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-50"
          >
            {isGenerating === 'class_yearly' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Download Summary
          </button>
        </div>

      </div>
    </div>
  );
}
