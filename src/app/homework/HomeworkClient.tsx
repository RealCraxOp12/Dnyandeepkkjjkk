"use client";

import { useState } from "react";
import { BookOpen, Plus, Trash2, FileText, Calendar, Filter } from "lucide-react";
import { createAssignment, deleteAssignment } from "@/app/actions/homework";

export default function HomeworkClient({ 
  initialAssignments, 
  classes, 
  subjects, 
  lockedSubject 
}: { 
  initialAssignments: any[], 
  classes: string[], 
  subjects?: { id: string, name: string }[], 
  lockedSubject?: string 
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [assignments, setAssignments] = useState(initialAssignments);
  const [selectedClass, setSelectedClass] = useState("ALL");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File | null;
    
    if (file && file.size > 0) {
      // Fast API upload
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("folder", "homework");
      
      try {
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });
        const uploadResult = await uploadRes.json();
        
        if (uploadResult.success) {
          formData.delete("file");
          formData.append("fileUrl", uploadResult.fileUrl);
        } else {
          alert("Failed to upload file");
          setIsLoading(false);
          return;
        }
      } catch (err) {
        alert("Upload error");
        setIsLoading(false);
        return;
      }
    }

    const res = await createAssignment(formData);
    
    if (res.success) {
      setIsCreating(false);
      window.location.reload(); 
    } else {
      alert(res.error || "Failed to create assignment");
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this assignment?")) {
      const res = await deleteAssignment(id);
      if (res.success) {
        setAssignments(assignments.filter(a => a.id !== id));
      }
    }
  };

  const filteredAssignments = selectedClass === "ALL" 
    ? assignments 
    : assignments.filter(a => a.targetClass === selectedClass);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex justify-between items-end bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Homework & Assignments</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400">Manage daily homework uploads and subject assignments.</p>
        </div>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-md shadow-blue-500/20"
        >
          {isCreating ? "Cancel" : <><Plus className="w-4 h-4" /> Upload Homework</>}
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-3">
        <div className="bg-white dark:bg-slate-900 p-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center">
          <Filter className="w-4 h-4 text-slate-400 ml-2 mr-1" />
          <select 
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-1 bg-transparent text-slate-900 dark:text-white text-sm font-bold focus:outline-none"
          >
            <option value="ALL" className="bg-white dark:bg-slate-900">All Classes</option>
            {classes.map(c => (
              <option key={c} value={c} className="bg-white dark:bg-slate-900">Class {c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Create Form */}
      {isCreating && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-blue-100 dark:border-blue-900/50 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Upload New Assignment</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Assignment Title</label>
              <input type="text" name="title" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Algebra Chapter 2 Exercises" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Class</label>
                <select name="targetClass" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium">
                  {classes.map(c => (
                    <option key={c} value={c}>Class {c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Subject</label>
                {lockedSubject ? (
                  <input type="text" name="subject" value={lockedSubject} readOnly className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none cursor-not-allowed font-medium" />
                ) : (
                  <input type="text" name="subject" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Math" />
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Instructions / Details</label>
              <textarea name="description" rows={3} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Solve problems 1 through 15..."></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Due Date</label>
              <input type="date" name="dueDate" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Attach Worksheet (Optional)</label>
              <input type="file" name="file" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button type="submit" disabled={isLoading} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-70 transition-colors">
              {isLoading ? "Uploading..." : "Upload Assignment"}
            </button>
          </div>
        </form>
      )}

      {/* Assignments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAssignments.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No assignments found for this class.</p>
          </div>
        ) : (
          filteredAssignments.map(assignment => (
            <div key={assignment.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      Class {assignment.targetClass}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      {assignment.subject}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">{assignment.title}</h3>
                </div>
                <button onClick={() => handleDelete(assignment.id)} className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 flex-1 line-clamp-2 whitespace-pre-wrap">{assignment.description}</p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Due Date</span>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-500">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(assignment.dueDate).toLocaleDateString()}
                  </div>
                </div>
                {assignment.fileUrl && (
                  <a href={assignment.fileUrl} target="_blank" className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                    <FileText className="w-3.5 h-3.5" /> View Worksheet
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
