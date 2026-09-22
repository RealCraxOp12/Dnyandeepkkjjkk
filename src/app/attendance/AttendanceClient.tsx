"use client";

import { useState, useEffect } from "react";
import { Calendar, Save, Loader2, UserCheck, UserX, Clock, Coffee } from "lucide-react";
import { getStudentsForAttendance, getAttendanceForDate, saveAttendance } from "@/app/actions/attendance";

interface Student {
  id: string;
  registerNo: string | null;
  firstName: string;
  surname: string;
}

interface AttendanceState {
  [studentId: string]: string; // "PRESENT", "ABSENT", "LEAVE", "HALF_DAY"
}

export default function AttendanceClient({ classes }: { classes: string[] }) {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceState>({});
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const [message, setMessage] = useState<{ text: string, type: "success" | "error" } | null>(null);

  useEffect(() => {
    const loadStudentsAndAttendance = async () => {
      if (!selectedClass || !selectedDate) {
        setStudents([]);
        return;
      }
      
      setIsLoading(true);
      setHasUnsavedChanges(false);
      setMessage(null);
      
      try {
        const [fetchedStudents, records] = await Promise.all([
          getStudentsForAttendance(selectedClass),
          getAttendanceForDate(selectedClass, undefined, new Date(selectedDate))
        ]);
        
        setStudents(fetchedStudents);
        
        const newAttendance: AttendanceState = {};
        if (records.length > 0) {
          // Load existing records
          records.forEach(r => {
            newAttendance[r.studentId] = r.status;
          });
        }
        
        setAttendance(newAttendance);
      } catch (error) {
        console.error("Failed to load attendance", error);
        setMessage({ text: "Failed to load data", type: "error" });
      }
      
      setIsLoading(false);
    };

    loadStudentsAndAttendance();
  }, [selectedClass, selectedDate]);

  const handleStatusChange = (studentId: string, status: string) => {
    setHasUnsavedChanges(true);
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    
    const records = Object.entries(attendance)
      .map(([studentId, status]) => ({
        studentId,
        status,
      }))
      .filter(r => r.status !== "");
    
    const result = await saveAttendance(new Date(selectedDate), records);
    
    if (result.success) {
      setHasUnsavedChanges(false);
      setMessage({ text: "Attendance saved successfully!", type: "success" });
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ text: "Failed to save attendance.", type: "error" });
    }
    
    setIsSaving(false);
  };

  return (
    <div className="flex-1 overflow-auto p-8 bg-transparent">
      {message && (
        <div className={`px-4 py-3 mb-6 rounded-lg font-bold text-sm shadow-sm transition-all ${message.type === 'error' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-700 border border-green-200'}`}>
          {message.text}
        </div>
      )}

      {/* Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 mb-8 flex flex-wrap gap-4 items-end transition-colors duration-300">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Class</label>
          <select 
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm outline-none font-medium text-slate-600 dark:text-slate-300 focus:border-blue-500 dark:focus:ring-2 focus:ring-blue-200 transition-colors"
          >
            <option value="">Select Class</option>
            {classes.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Date</label>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm outline-none font-medium text-slate-600 dark:text-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors" 
          />
        </div>
        
        {students.length > 0 && (
          <button 
            onClick={handleSave}
            disabled={!hasUnsavedChanges || isSaving}
            className={`px-6 py-2 text-white rounded-md text-sm font-bold shadow-sm transition-all h-[38px] flex items-center gap-2 ${
              hasUnsavedChanges ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-500 opacity-80 cursor-default'
            }`}
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? "Saving..." : hasUnsavedChanges ? "Save Attendance" : "Saved"}
          </button>
        )}
      </div>

      {/* Roster Table */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : students.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-blue-400 dark:text-blue-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Select a class to begin</h3>
            <p className="text-slate-500 mt-2 max-w-sm text-sm">The student list will load automatically once a class is selected.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Student Info</th>
                <th className="px-6 py-4 text-center">Mark Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {students.map((student) => {
                const status = attendance[student.id] || "";
                
                return (
                  <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 dark:text-slate-100 text-base">
                        {student.firstName} {student.surname}
                      </div>
                      <div className="text-xs font-semibold text-slate-500 mt-1">
                        Reg No: {student.registerNo || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-800">
                        <button
                          onClick={() => handleStatusChange(student.id, "PRESENT")}
                          className={`px-4 py-2 font-bold text-xs transition-colors flex items-center gap-1 ${
                            status === "PRESENT" 
                              ? "bg-green-500 text-white" 
                              : "text-slate-600 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-green-900/20"
                          }`}
                        >
                          P
                        </button>
                        <button
                          onClick={() => handleStatusChange(student.id, "ABSENT")}
                          className={`px-4 py-2 font-bold text-xs border-l border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1 ${
                            status === "ABSENT" 
                              ? "bg-red-500 text-white" 
                              : "text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                          }`}
                        >
                          A
                        </button>
                        <button
                          onClick={() => handleStatusChange(student.id, "LEAVE")}
                          className={`px-4 py-2 font-bold text-xs border-l border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1 ${
                            status === "LEAVE" 
                              ? "bg-yellow-500 text-white" 
                              : "text-slate-600 dark:text-slate-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                          }`}
                        >
                          L
                        </button>
                        <button
                          onClick={() => handleStatusChange(student.id, "HALF_DAY")}
                          className={`px-4 py-2 font-bold text-xs border-l border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1 ${
                            status === "HALF_DAY" 
                              ? "bg-orange-500 text-white" 
                              : "text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                          }`}
                        >
                          HD
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
