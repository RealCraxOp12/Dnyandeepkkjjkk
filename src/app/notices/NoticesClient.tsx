"use client";

import { useState } from "react";
import { Megaphone, Plus, Trash2, FileText, Calendar } from "lucide-react";
import { createNotice, deleteNotice } from "@/app/actions/notices";

export default function NoticesClient({ initialNotices }: { initialNotices: any[] }) {
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notices, setNotices] = useState(initialNotices);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File | null;
    
    if (file && file.size > 0) {
      // Fast API upload
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("folder", "notices");
      
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

    const res = await createNotice(formData);
    
    if (res.success) {
      setIsCreating(false);
      window.location.reload(); 
    } else {
      alert(res.error || "Failed to create notice");
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this notice?")) {
      const res = await deleteNotice(id);
      if (res.success) {
        setNotices(notices.filter(n => n.id !== id));
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex justify-between items-end bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-xl flex items-center justify-center">
              <Megaphone className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Notice Board</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400">Publish school-wide announcements, holidays, and exam schedules.</p>
        </div>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-md shadow-blue-500/20"
        >
          {isCreating ? "Cancel" : <><Plus className="w-4 h-4" /> New Notice</>}
        </button>
      </div>

      {/* Create Form */}
      {isCreating && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-blue-100 dark:border-blue-900/50 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Create New Notice</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Title</label>
              <input type="text" name="title" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Diwali Holidays" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Notice Type</label>
              <select name="type" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium">
                <option value="GENERAL">General Notice</option>
                <option value="HOLIDAY">Holiday</option>
                <option value="EXAM">Examination</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Description</label>
              <textarea name="description" required rows={4} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Detailed description of the notice..."></textarea>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Attach File (Optional)</label>
              <input type="file" name="file" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button type="submit" disabled={isLoading} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-70 transition-colors">
              {isLoading ? "Publishing..." : "Publish Notice"}
            </button>
          </div>
        </form>
      )}

      {/* Notices List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notices.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No notices published yet.</p>
          </div>
        ) : (
          notices.map(notice => (
            <div key={notice.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col group relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-1 h-full ${notice.type === 'HOLIDAY' ? 'bg-emerald-500' : notice.type === 'EXAM' ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider mb-2 inline-block
                    ${notice.type === 'HOLIDAY' ? 'bg-emerald-100 text-emerald-700' : notice.type === 'EXAM' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}
                  `}>
                    {notice.type}
                  </span>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">{notice.title}</h3>
                </div>
                <button onClick={() => handleDelete(notice.id)} className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 flex-1 line-clamp-3 whitespace-pre-wrap">{notice.description}</p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <Calendar className="w-4 h-4" />
                  {new Date(notice.createdAt).toLocaleDateString()}
                </div>
                {notice.fileUrl && (
                  <a href={notice.fileUrl} target="_blank" className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                    <FileText className="w-3.5 h-3.5" /> View Attachment
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
