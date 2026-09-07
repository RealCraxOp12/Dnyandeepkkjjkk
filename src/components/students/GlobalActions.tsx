"use client";

import { deleteAllStudents } from "@/app/actions/student";
import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";

export function GlobalActions() {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAll = async () => {
    if (window.confirm("WARNING! Are you absolutely sure you want to delete ALL students from the database? This is irreversible!")) {
      setIsDeleting(true);
      await deleteAllStudents();
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDeleteAll}
      disabled={isDeleting}
      className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-md text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50"
    >
      {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Delete All
    </button>
  );
}
