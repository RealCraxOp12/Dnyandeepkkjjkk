"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function ClassFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentClass = searchParams.get("class") || "";

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newClass = e.target.value;
    if (newClass) {
      router.push(`/students?class=${newClass}`);
    } else {
      router.push(`/students`);
    }
  };

  return (
    <select 
      value={currentClass} 
      onChange={handleClassChange}
      className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm outline-none hover:bg-slate-50 cursor-pointer"
    >
      <option value="">All Classes</option>
      <option value="1st">1st Class</option>
      <option value="2nd">2nd Class</option>
      <option value="3rd">3rd Class</option>
      <option value="4th">4th Class</option>
      <option value="5th">5th Class</option>
      <option value="6th">6th Class</option>
      <option value="7th">7th Class</option>
      <option value="8th">8th Class</option>
      <option value="9th">9th Class</option>
      <option value="10th">10th Class</option>
    </select>
  );
}
