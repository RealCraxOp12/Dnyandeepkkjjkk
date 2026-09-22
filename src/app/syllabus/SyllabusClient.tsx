"use client";

import { useState } from "react";
import { FileText, Plus, Trash2, Filter } from "lucide-react";
import { createMaterial, deleteMaterial } from "@/app/actions/academicMaterials";

export default function SyllabusClient({ 
  initialSyllabus, 
  classes, 
  lockedSubject 
}: { 
  initialSyllabus: any[], 
  classes: string[], 
  lockedSubject?: string 
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [syllabusList, setSyllabusList] = useState(initialSyllabus);
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
      uploadData.append("folder", "syllabus");
      
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

    const res = await createMaterial(formData, "syllabus");
    
    if (res.success) {
      setIsCreating(false);
      window.location.reload(); 
    } else {
      alert(res.error || "Failed to upload syllabus");
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this syllabus?")) {
      const res = await deleteMaterial(id, "syllabus");
      if (res.success) {
        setSyllabusList(syllabusList.filter(s => s.id !== id));
      }
    }
  };

  const filtered = selectedClass === "ALL" ? syllabusList : syllabusList.filter(s => s.targetClass === selectedClass);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex justify-between items-end bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Syllabus Management</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400">Upload and manage syllabus documents for all classes.</p>
        </div>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2"
        >
          {isCreating ? "Cancel" : <><Plus className="w-4 h-4" /> Upload Syllabus</>}
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="bg-white dark:bg-slate-900 p-2 rounded-xl shadow-sm border border-slate-200 flex items-center">
          <Filter className="w-4 h-4 text-slate-400 ml-2 mr-1" />
          <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="px-3 py-1 bg-transparent text-slate-900 dark:text-white text-sm font-bold focus:outline-none">
            <option value="ALL" className="bg-white dark:bg-slate-900">All Classes</option>
            {classes.map(c => <option key={c} value={c} className="bg-white dark:bg-slate-900">Class {c}</option>)}
          </select>
        </div>
      </div>

      {isCreating && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-blue-100 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-lg font-bold mb-4">Upload New Syllabus</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Title</label>
              <input type="text" name="title" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Science Term 1 Syllabus" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Class</label>
                <select name="targetClass" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {classes.map(c => <option key={c} value={c} className="bg-white dark:bg-slate-900">Class {c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Subject</label>
                {lockedSubject ? (
                  <input type="text" name="subject" value={lockedSubject} readOnly className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none cursor-not-allowed font-medium" />
                ) : (
                  <input type="text" name="subject" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Science" />
                )}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Attach Document</label>
              <input type="file" name="file" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={isLoading} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold">
              {isLoading ? "Uploading..." : "Upload Syllabus"}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map(item => (
          <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative group">
            <div className="absolute top-0 left-0 w-full h-1 bg-orange-500 rounded-t-2xl"></div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 rounded-md uppercase">Class {item.targetClass} • {item.subject}</span>
              <button onClick={() => handleDelete(item.id)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-4">{item.title}</h3>
            {item.fileUrl && (
              <a href={item.fileUrl} target="_blank" className="flex items-center justify-center gap-2 text-sm font-bold text-orange-600 bg-orange-50 py-2 rounded-xl">
                <FileText className="w-4 h-4" /> Download PDF
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
