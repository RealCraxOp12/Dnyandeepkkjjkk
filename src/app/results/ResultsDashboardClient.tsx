"use client";

import { useState } from "react";
import { GraduationCap, Table2, FileText, Plus, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { deleteExam } from "@/app/actions/results";

type Exam = {
  id: string;
  name: string;
  academicYear: string;
  targetClass: string | null;
  status: string;
};

export default function ResultsDashboardClient({
  exams,
  totalStudents,
}: {
  exams: Exam[];
  totalStudents: number;
}) {
  const pathname = usePathname();
  const basePath = pathname.startsWith("/staff/") 
    ? `/staff/${pathname.split("/")[2]}/results`
    : "/results";

  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"? All associated marks will be permanently lost.`)) {
      setIsDeleting(id);
      await deleteExam(id);
      setIsDeleting(null);
      router.refresh();
    }
  };

  // Extract unique academic years for the dropdown
  const uniqueYears = Array.from(new Set(exams.map((e) => e.academicYear))).sort().reverse();
  
  // Available classes
  const classes = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"];

  // Filter exams based on selections
  const filteredExams = exams.filter((exam) => {
    const matchClass = selectedClass === "" || exam.targetClass === selectedClass || exam.targetClass === null;
    const matchYear = selectedYear === "" || exam.academicYear === selectedYear;
    return matchClass && matchYear;
  });

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Results & Examination</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage terms, marks, and generate CBSE report cards.</p>
        </div>
        <div className="flex gap-3">
          <Link href={`${basePath}/setup`} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-bold hover:bg-blue-700 shadow-sm transition-all">
            <Plus className="w-4 h-4" /> Create Exam Term
          </Link>
        </div>
      </div>

      {/* Filters */}
      {exams.length > 0 && (
        <div className="mb-6 flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Filter by Class:</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
            >
              <option value="">All Classes</option>
              {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Filter by Year:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
            >
              <option value="">All Years</option>
              {uniqueYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
      )}

      {exams.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors duration-300">
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">No Exams Scheduled</h3>
            <p className="text-slate-500 mt-2 max-w-sm">Create an exam term (e.g. Term 1, Half Yearly) first before you can enter student marks.</p>
            <Link href={`${basePath}/setup`} className="mt-6 px-6 py-2 bg-blue-50 text-blue-600 font-semibold rounded-md hover:bg-blue-100 transition-colors">
              Setup First Exam
            </Link>
          </div>
        </div>
      ) : filteredExams.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors duration-300 p-16 text-center">
          <p className="text-slate-500 dark:text-slate-400 font-medium">No exams found for the selected filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredExams.map((exam) => (
            <div key={exam.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 flex flex-col transition-colors duration-300 group hover:border-blue-300 dark:hover:border-blue-700">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    {exam.name}
                  </h3>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded uppercase tracking-wider">
                      {exam.academicYear}
                    </span>
                    <span className="text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-400 px-2 py-1 rounded uppercase tracking-wider">
                      {exam.targetClass ? `Class: ${exam.targetClass}` : "All Classes"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold rounded-full uppercase tracking-wider">
                    {exam.status}
                  </span>
                  <button
                    onClick={() => handleDelete(exam.id, exam.name)}
                    disabled={isDeleting === exam.id}
                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors"
                    title="Delete Exam"
                  >
                    {isDeleting === exam.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div className="flex-1 mt-4 space-y-3">
                <div className="flex justify-between text-sm text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span>Eligible Students</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {exam.targetClass ? "Class specific" : totalStudents}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-slate-500 pb-2">
                  <span>Marks Entered</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">--</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <Link href={`${basePath}/${exam.id}/enter-marks`} className="flex flex-col items-center justify-center gap-2 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-colors group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 text-slate-600 dark:text-slate-300">
                  <Table2 className="w-5 h-5" />
                  <span className="text-xs font-bold">Enter Marks</span>
                </Link>
                <Link href={`${basePath}/${exam.id}/marksheet`} className="flex flex-col items-center justify-center gap-2 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-600 transition-colors text-slate-600 dark:text-slate-300">
                  <FileText className="w-5 h-5" />
                  <span className="text-xs font-bold">View Marksheets</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
