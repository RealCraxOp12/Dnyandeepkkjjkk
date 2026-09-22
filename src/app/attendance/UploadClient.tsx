"use client";

import { useState } from "react";
import { Upload, Download, Loader2, FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";
import { getStudentsForAttendance } from "@/app/actions/attendance";
import { bulkUploadMonthlyAttendance } from "@/app/actions/attendance-reports";

export default function UploadClient({ classes }: { classes: string[] }) {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string } | null>(null);

  const months = [
    { value: 1, label: "January" }, { value: 2, label: "February" }, { value: 3, label: "March" },
    { value: 4, label: "April" }, { value: 5, label: "May" }, { value: 6, label: "June" },
    { value: 7, label: "July" }, { value: 8, label: "August" }, { value: 9, label: "September" },
    { value: 10, label: "October" }, { value: 11, label: "November" }, { value: 12, label: "December" }
  ];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const handleDownloadTemplate = async () => {
    if (!selectedClass) return;
    setIsGenerating(true);
    
    try {
      const students = await getStudentsForAttendance(selectedClass);
      const days = getDaysInMonth(selectedYear, selectedMonth);
      
      // Prepare Excel Data
      const data = students.map(student => {
        const row: any = {
          "Student ID": student.id,
          "Reg No": student.registerNo || "",
          "Name": `${student.firstName} ${student.surname}`,
        };
        
        // Add columns for each day
        for (let i = 1; i <= days; i++) {
          row[`${i}`] = ""; // Blank for teacher to fill 'P', 'A', 'L', 'HD'
        }
        return row;
      });

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, `Attendance_${selectedMonth}_${selectedYear}`);
      
      // Auto-size columns slightly
      worksheet['!cols'] = [
        { wch: 30 }, // ID (can be hidden, but we leave it for parsing)
        { wch: 15 }, // Reg No
        { wch: 30 }, // Name
        ...Array.from({ length: days }).map(() => ({ wch: 5 })) // Days
      ];

      XLSX.writeFile(workbook, `Attendance_Template_${selectedClass}_${selectedYear}_${selectedMonth}.xlsx`);
    } catch (error) {
      console.error("Template generation failed", error);
    }
    
    setIsGenerating(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadResult(null);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json<any>(worksheet);

      const recordsToSave: { studentId: string, day: number, status: string }[] = [];
      const days = getDaysInMonth(selectedYear, selectedMonth);

      // Parse JSON back into our schema
      for (const row of jsonData) {
        const studentId = row["Student ID"];
        if (!studentId) continue;

        for (let day = 1; day <= days; day++) {
          const val = row[`${day}`]?.toString().trim().toUpperCase();
          if (val) {
            let status = "";
            if (val === "P") status = "PRESENT";
            else if (val === "A") status = "ABSENT";
            else if (val === "L") status = "LEAVE";
            else if (val === "HD" || val === "H") status = "HALF_DAY";
            else continue; // Ignore unknown/blank

            recordsToSave.push({
              studentId,
              day,
              status
            });
          }
        }
      }

      if (recordsToSave.length === 0) {
        setUploadResult({ success: false, message: "No valid attendance data (P/A/L/HD) found in file." });
      } else {
        const result = await bulkUploadMonthlyAttendance(selectedYear, selectedMonth, recordsToSave);
        if (result.success) {
          setUploadResult({ success: true, message: `Successfully saved ${result.count} attendance records!` });
        } else {
          setUploadResult({ success: false, message: result.error || "Upload failed." });
        }
      }
    } catch (error) {
      console.error("File parsing error", error);
      setUploadResult({ success: false, message: "Failed to parse the Excel file. Please ensure you used the downloaded template." });
    }

    setIsUploading(false);
    // Reset file input
    e.target.value = '';
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Bulk Upload Monthly Attendance</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Download an Excel template, fill it offline, and upload it back to save an entire month's attendance instantly.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-8 flex flex-col md:flex-row gap-8">
        
        {/* Step 1: Download Template */}
        <div className="flex-1 border-r-0 md:border-r border-slate-100 dark:border-slate-800 md:pr-8">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6">
            <Download className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Step 1: Get Template</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Select the class and month to generate an empty Excel sheet pre-filled with the students' names.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Class</label>
              <select 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm outline-none font-medium text-slate-600 dark:text-slate-300 focus:border-blue-500"
              >
                <option value="">Select Class</option>
                {classes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Month</label>
                <select 
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm outline-none font-medium text-slate-600 dark:text-slate-300 focus:border-blue-500"
                >
                  {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Year</label>
                <input 
                  type="number" 
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm outline-none font-medium text-slate-600 dark:text-slate-300 focus:border-blue-500"
                />
              </div>
            </div>
            
            <button 
              onClick={handleDownloadTemplate}
              disabled={!selectedClass || isGenerating}
              className="w-full flex justify-center items-center gap-2 py-2 mt-2 bg-slate-800 dark:bg-slate-700 text-white rounded-md text-sm font-bold hover:bg-slate-900 dark:hover:bg-slate-600 transition-all disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
              Download Template
            </button>
          </div>
        </div>

        {/* Step 2: Upload Excel */}
        <div className="flex-1 flex flex-col">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-6">
            <Upload className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Step 2: Upload Filled Excel</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Fill the columns with <strong className="text-slate-700 dark:text-slate-300">P</strong> (Present), <strong className="text-slate-700 dark:text-slate-300">A</strong> (Absent), or <strong className="text-slate-700 dark:text-slate-300">L</strong> (Leave) and upload the file back here.
          </p>
          
          <div className="flex-1 flex flex-col justify-center items-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 bg-slate-50 dark:bg-slate-800/50 relative hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            {isUploading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <span className="text-sm font-bold text-slate-500">Processing file...</span>
              </div>
            ) : (
              <>
                <FileSpreadsheet className="w-10 h-10 text-slate-400 mb-3" />
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Click to Browse Excel File</span>
                <span className="text-xs text-slate-400 mt-1">.xlsx format only</span>
                <input 
                  type="file" 
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </>
            )}
          </div>
          
          {uploadResult && (
            <div className={`mt-4 p-4 rounded-lg text-sm font-bold flex items-center gap-2 ${
              uploadResult.success ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {uploadResult.message}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
