"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { saveMarks, getMarksForExamAndSubject } from "@/app/actions/results";

interface Student {
  id: string;
  firstName: string;
  surname: string;
  currentClass: string | null;
  registerNo: string | null;
}

interface Subject {
  id: string;
  name: string;
}

interface Exam {
  id: string;
  name: string;
}

interface MarksState {
  [studentId: string]: {
    marksObtained: string;
    grade: string;
  };
}

export default function MarksEntryClient({
  exam,
  subjects,
  students,
}: {
  exam: Exam;
  subjects: Subject[];
  students: Student[];
}) {
  const [selectedSubject, setSelectedSubject] = useState<string>(subjects[0]?.id || "");
  const [marks, setMarks] = useState<MarksState>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Group students by class for better UI organization
  const groupedStudents = students.reduce((acc, student) => {
    const className = student.currentClass || "Unassigned";
    if (!acc[className]) acc[className] = [];
    acc[className].push(student);
    return acc;
  }, {} as Record<string, Student[]>);

  // Load existing marks when subject changes
  useEffect(() => {
    if (!selectedSubject) return;

    const loadExistingMarks = async () => {
      setIsLoading(true);
      try {
        const existingRecords = await getMarksForExamAndSubject(exam.id, selectedSubject);
        const newMarksState: MarksState = {};
        
        existingRecords.forEach(record => {
          newMarksState[record.studentId] = {
            marksObtained: record.marksObtained?.toString() || "",
            grade: record.grade || "",
          };
        });
        
        setMarks(newMarksState);
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error("Failed to load existing marks", error);
      }
      setIsLoading(false);
    };

    loadExistingMarks();
  }, [selectedSubject, exam.id]);

  const handleMarksChange = (studentId: string, field: "marksObtained" | "grade", value: string) => {
    setHasUnsavedChanges(true);
    setMarks(prev => {
      const current = prev[studentId] || { marksObtained: "", grade: "" };
      
      if (field === "marksObtained") {
        const num = parseFloat(value);
        if (num > 100) {
          setErrorMsg("Marks cannot exceed 100");
          setTimeout(() => setErrorMsg(null), 3000);
          return prev;
        }
      }

      return {
        ...prev,
        [studentId]: {
          ...current,
          [field]: value
        }
      };
    });
  };

  // Debounced Auto-Save
  useEffect(() => {
    if (!hasUnsavedChanges || Object.keys(marks).length === 0) return;

    const timer = setTimeout(() => {
      handleSave(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [marks, hasUnsavedChanges]);

  const handleSave = async (showUI = true) => {
    if (showUI) {
      setIsSaving(true);
    } else {
      setIsAutoSaving(true);
    }
    
    // Format data for server action safely
    const marksData = Object.entries(marks)
      .map(([studentId, data]) => ({
        studentId,
        marksObtained: data.marksObtained && data.marksObtained.trim() !== "" ? parseFloat(data.marksObtained) : null,
        grade: data.grade ? data.grade.trim() : "",
        totalMarks: 100
      }))
      .filter(m => m.marksObtained !== null || m.grade !== ""); // Only save non-empty entries

    const result = await saveMarks({
      examId: exam.id,
      subjectId: selectedSubject,
      marksData
    });

    if (result.success) {
      setHasUnsavedChanges(false);
      if (showUI) {
        setSuccessMsg("Marks saved successfully!");
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } else {
      if (showUI) {
        setErrorMsg("Failed to save marks");
        setTimeout(() => setErrorMsg(null), 3000);
      }
    }
    
    if (showUI) {
      setIsSaving(false);
    } else {
      setIsAutoSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      {(errorMsg || successMsg) && (
        <div className={`px-4 py-2 text-center font-bold text-sm transition-all ${errorMsg ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
          {errorMsg || successMsg}
        </div>
      )}
      
      {/* Top Controls */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
        <div className="flex items-center gap-4">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Select Subject:</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium w-64"
          >
            {subjects.map(subject => (
              <option key={subject.id} value={subject.id}>{subject.name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => handleSave(true)}
          disabled={!hasUnsavedChanges || isSaving || isLoading}
          className={`flex items-center gap-2 px-6 py-2 text-white rounded-lg font-bold shadow-sm transition-all ${
            hasUnsavedChanges 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-emerald-500 opacity-80 cursor-default'
          }`}
        >
          {isSaving || isAutoSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : hasUnsavedChanges ? (
            <Save className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? "Saving..." : isAutoSaving ? "Auto-saving..." : hasUnsavedChanges ? "Save Marks" : "All Saved"}
        </button>
      </div>

      {/* Grid Container */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedStudents).map(([className, classStudents]) => (
              <div key={className} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 font-bold text-slate-700 dark:text-slate-300">
                  Class: {className}
                </div>
                <table className="w-full text-sm text-left">
                  <thead className="bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-bold uppercase text-xs border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-4 py-3 w-16 text-center">Sr.</th>
                      <th className="px-4 py-3">Student Name</th>
                      <th className="px-4 py-3 w-32">Reg No</th>
                      <th className="px-4 py-3 w-48 text-center">Marks (out of 100)</th>
                      <th className="px-4 py-3 w-32 text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                    {classStudents.map((student, idx) => (
                      <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="px-4 py-3 text-center text-slate-400 font-medium">{idx + 1}</td>
                        <td className="px-4 py-3 font-bold text-slate-700 dark:text-slate-200">{student.firstName} {student.surname}</td>
                        <td className="px-4 py-3 text-slate-500">{student.registerNo || "-"}</td>
                        <td className="px-4 py-3 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="-"
                            value={marks[student.id]?.marksObtained || ""}
                            onChange={(e) => handleMarksChange(student.id, "marksObtained", e.target.value)}
                            className="w-20 px-2 py-1.5 text-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 font-bold"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input
                            type="text"
                            maxLength={2}
                            placeholder="-"
                            value={marks[student.id]?.grade || ""}
                            onChange={(e) => handleMarksChange(student.id, "grade", e.target.value.toUpperCase())}
                            className="w-16 px-2 py-1.5 text-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 font-bold uppercase"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
