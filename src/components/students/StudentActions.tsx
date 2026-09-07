"use client";

import { deleteStudent } from "@/app/actions/student";
import { Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function StudentActions({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this student? This action cannot be undone.")) {
      setIsDeleting(true);
      await deleteStudent(id);
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Link href={`/students/${id}/edit`} prefetch={true} className="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30">
        <Edit className="w-4 h-4" />
      </Link>
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 disabled:opacity-50"
      >
        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      </button>
    </div>
  );
}
