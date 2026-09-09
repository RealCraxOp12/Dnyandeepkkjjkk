"use client";

import { useState, useEffect, useMemo } from "react";
import { Award, FileText, ArrowLeft, Printer, Search, Loader2 } from "lucide-react";
import { BonafideTemplate } from "@/components/certificates/BonafideTemplate";
import { LeavingCertificateTemplate } from "@/components/certificates/LeavingCertificateTemplate";
import { getAllStudents } from "@/app/actions/student";

export default function CertificatesPage() {
  const [activeView, setActiveView] = useState<"menu" | "bonafide" | "lc">("menu");
  const [searchQuery, setSearchQuery] = useState("");
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // Fetch all students once on mount for instant searching
  useEffect(() => {
    getAllStudents().then((data) => {
      setAllStudents(data);
      setIsLoading(false);
    });
  }, []);

  // Lightning fast client-side filtering in-memory (0ms latency)
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allStudents.filter(s => 
      s.firstName?.toLowerCase().includes(q) || 
      s.surname?.toLowerCase().includes(q) || 
      s.registerNo?.toLowerCase().includes(q) ||
      s.adharNo?.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [searchQuery, allStudents]);

  const isSearching = false; // no longer needed since it's instant

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const selectStudentAndGenerate = (student: any, type: "bonafide" | "lc") => {
    setSelectedStudent(student);
    setActiveView(type);
  };

  if (activeView === "bonafide" || activeView === "lc") {
    return (
      <div className="flex-1 overflow-auto p-8 bg-slate-200 dark:bg-slate-900 print:bg-white print:p-0 print:overflow-visible">
        <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto print:hidden">
          <button 
            onClick={() => setActiveView("menu")}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Certificates
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 shadow-sm" onClick={() => window.print()}>
            <Printer className="w-4 h-4" /> Print Document
          </button>
        </div>
        
        {/* Render the selected template with real student data */}
        <div className="print:m-0 print:w-full">
          {activeView === "bonafide" ? <BonafideTemplate student={selectedStudent} /> : <LeavingCertificateTemplate student={selectedStudent} />}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-8 bg-transparent">
      <div className="flex flex-col md:flex-row md:items-center justify-end mb-8 gap-4">
        <form onSubmit={handleSearch} className="relative flex w-full md:w-96 shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-l-md leading-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors duration-300"
            placeholder="Search student by name, Reg No, Aadhar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            type="submit"
            disabled={isSearching}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-r-md text-sm font-medium transition-colors disabled:opacity-70"
          >
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
          </button>
        </form>
      </div>

      {searchResults.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 mb-8 overflow-hidden transition-colors duration-300">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 transition-colors duration-300">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">Search Results</h3>
          </div>
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {searchResults.map((student) => (
              <li key={student.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100">{student.firstName} {student.surname}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Reg No: {student.registerNo || "N/A"} | Class: {student.currentClass || student.admissionClass || "N/A"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => selectStudentAndGenerate(student, "bonafide")}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded text-sm font-medium transition-colors"
                  >
                    Generate Bonafide
                  </button>
                  <button 
                    onClick={() => selectStudentAndGenerate(student, "lc")}
                    className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded text-sm font-medium transition-colors"
                  >
                    Generate LC
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {searchResults.length === 0 && searchQuery !== "" && !isSearching && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 mb-8 p-8 text-center text-slate-500 dark:text-slate-400 font-medium transition-colors duration-300">
          No students found matching "{searchQuery}".
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div 
          onClick={() => setActiveView("bonafide")}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-8 flex flex-col items-center text-center hover:border-blue-500 dark:hover:border-blue-500 transition-colors duration-300 cursor-pointer group"
        >
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Bonafide Certificate</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            Generate a standard bonafide certificate for any active student.
          </p>
          <button className="px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md font-medium group-hover:bg-blue-600 group-hover:text-white transition-colors">
            View Blank Template
          </button>
        </div>

        <div 
          onClick={() => setActiveView("lc")}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-8 flex flex-col items-center text-center hover:border-blue-500 dark:hover:border-blue-500 transition-colors duration-300 cursor-pointer group"
        >
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Leaving Certificate (LC)</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            Generate an official LC. This action will mark the student as inactive.
          </p>
          <button className="px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md font-medium group-hover:bg-red-600 group-hover:text-white transition-colors">
            View Blank Template
          </button>
        </div>
      </div>
    </div>
  );
}
