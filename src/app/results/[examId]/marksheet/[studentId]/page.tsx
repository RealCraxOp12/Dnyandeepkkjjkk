"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Printer, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

// Since it's a client component, we use fetch to get data from API (or we could use Server Action in useEffect).
// To keep it robust, I'll use a Server Action import to fetch data.
import { getStudentMarksheet } from "@/app/actions/results";

// We need a helper to fetch exam and student details. I'll just write a quick fetcher inside useEffect.
export default function PrintableMarksheetPage() {
  const params = useParams();
  const pathname = usePathname();
  const examId = params.examId as string;
  const studentId = params.studentId as string;
  const basePath = pathname.startsWith("/staff/") 
    ? `/staff/${pathname.split("/")[2]}/results`
    : "/results";

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We can fetch data via server actions or an API. I'll create a quick action fetch.
    const loadData = async () => {
      try {
        const result = await fetch(`/api/results/marksheet?examId=${examId}&studentId=${studentId}`);
        if (result.ok) {
          const json = await result.json();
          setData(json);
        }
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    loadData();
  }, [examId, studentId]);

  if (loading) {
    return <div className="flex-1 flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
  }

  if (!data || !data.student) {
    return <div className="p-8">Error loading marksheet data. Make sure API is configured.</div>;
  }

  const { student, exam, marks } = data;

  // Calculate totals
  let totalObtained = 0;
  let totalMax = 0;

  marks.forEach((m: any) => {
    if (m.marksObtained !== null) {
      totalObtained += m.marksObtained;
      totalMax += m.totalMarks || 100;
    }
  });

  const percentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : "0.00";

  return (
    <div className="flex-1 overflow-auto p-8 bg-slate-200 dark:bg-slate-900 print:bg-white print:p-0 print:overflow-visible">
      <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto print:hidden">
        <Link 
          href={`${basePath}/${examId}/marksheet`}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Students
        </Link>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-bold hover:bg-blue-700 shadow-sm"
        >
          <Printer className="w-4 h-4" /> Print Marksheet
        </button>
      </div>

      <div className="print:m-0 print:w-full">
        {/* Printable Marksheet UI */}
        <div className="w-full max-w-4xl mx-auto bg-white border-4 border-double border-blue-900 p-8 shadow-xl relative print:shadow-none print:border-4 print:p-8">
          
          {/* Header */}
          <div className="text-center border-b-2 border-blue-900 pb-4 mb-6">
            <h1 className="text-3xl font-extrabold text-blue-900 uppercase font-serif tracking-widest mb-1">Dnyandeep English Medium School</h1>
            <p className="text-sm text-slate-700 font-bold mb-1">Affiliated to CBSE, New Delhi | Affiliation No. 123456</p>
            <p className="text-xs text-slate-600">123 Education Road, Knowledge City, Maharashtra - 411001</p>
            
            <div className="mt-4 inline-block px-4 py-1 border border-slate-400 bg-slate-50 text-slate-800 font-bold uppercase tracking-wider text-sm rounded">
              REPORT CARD : {exam.academicYear}
            </div>
            <p className="font-bold text-slate-800 mt-2 uppercase">{exam.name}</p>
          </div>

          {/* Student Info */}
          <div className="flex justify-between border-b border-slate-300 pb-6 mb-6">
            <div className="space-y-2 text-sm text-slate-800 font-medium">
              <p><span className="w-32 inline-block text-slate-600">Student Name:</span> <span className="font-bold uppercase">{student.firstName} {student.surname}</span></p>
              <p><span className="w-32 inline-block text-slate-600">Mother's Name:</span> <span className="uppercase">{student.motherName || "-"}</span></p>
              <p><span className="w-32 inline-block text-slate-600">Father's Name:</span> <span className="uppercase">{student.fatherName || "-"}</span></p>
            </div>
            <div className="space-y-2 text-sm text-slate-800 font-medium">
              <p><span className="w-32 inline-block text-slate-600">Admission No:</span> <span className="font-bold">{student.registerNo || "-"}</span></p>
              <p><span className="w-32 inline-block text-slate-600">Class & Section:</span> <span className="font-bold">{student.currentClass || "-"} {student.division || ""}</span></p>
              <p><span className="w-32 inline-block text-slate-600">Date of Birth:</span> <span>{student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString('en-GB') : "-"}</span></p>
            </div>
          </div>

          {/* Marks Table */}
          <table className="w-full text-sm text-left mb-6 border border-slate-800">
            <thead className="bg-slate-100 text-slate-800 font-bold uppercase text-xs">
              <tr className="border-b border-slate-800">
                <th className="px-4 py-3 border-r border-slate-800 w-12 text-center">Sr</th>
                <th className="px-4 py-3 border-r border-slate-800">Subjects</th>
                <th className="px-4 py-3 border-r border-slate-800 text-center w-24">Max Marks</th>
                <th className="px-4 py-3 border-r border-slate-800 text-center w-32">Marks Obtained</th>
                <th className="px-4 py-3 text-center w-24">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300 text-slate-800">
              {marks.map((mark: any, index: number) => (
                <tr key={mark.id}>
                  <td className="px-4 py-2 border-r border-slate-800 text-center">{index + 1}</td>
                  <td className="px-4 py-2 border-r border-slate-800 font-bold">{mark.subject.name}</td>
                  <td className="px-4 py-2 border-r border-slate-800 text-center font-medium">
                    {mark.marksObtained !== null ? mark.totalMarks : "-"}
                  </td>
                  <td className="px-4 py-2 border-r border-slate-800 text-center font-bold">
                    {mark.marksObtained !== null ? mark.marksObtained : "-"}
                  </td>
                  <td className="px-4 py-2 text-center font-bold">
                    {mark.grade || "-"}
                  </td>
                </tr>
              ))}
              <tr className="bg-slate-50 font-bold border-t border-slate-800">
                <td className="px-4 py-3 border-r border-slate-800 text-right uppercase" colSpan={2}>Grand Total</td>
                <td className="px-4 py-3 border-r border-slate-800 text-center">{totalMax}</td>
                <td className="px-4 py-3 border-r border-slate-800 text-center text-blue-700">{totalObtained}</td>
                <td className="px-4 py-3 text-center">-</td>
              </tr>
            </tbody>
          </table>

          {/* Summary / Result */}
          <div className="flex justify-between items-center bg-blue-50 border border-blue-200 p-4 mb-16 rounded text-slate-800 text-sm">
            <p><span className="font-bold">Percentage:</span> <span className="text-lg font-bold text-blue-700 ml-2">{percentage}%</span></p>
            <p><span className="font-bold">Result:</span> <span className="font-bold text-green-600 ml-2 uppercase">PASS</span></p>
          </div>

          {/* Signatures */}
          <div className="flex justify-between items-end text-sm font-bold text-slate-800 px-8 pt-16">
            <div className="text-center border-t border-slate-800 pt-2 w-32">
              Class Teacher
            </div>
            <div className="text-center border-t border-slate-800 pt-2 w-32">
              Principal
            </div>
            <div className="text-center border-t border-slate-800 pt-2 w-32">
              Parent's Signature
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
