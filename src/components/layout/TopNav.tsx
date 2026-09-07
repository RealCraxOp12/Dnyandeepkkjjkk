"use client";

import { Search, Bell, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function TopNav() {
  const pathname = usePathname();
  
  // Create a nice title based on the current path
  let pageTitle = "Dashboard";
  if (pathname.includes("/students")) pageTitle = "Students Directory";
  if (pathname.includes("/admissions")) pageTitle = "Admissions";
  if (pathname.includes("/attendance")) pageTitle = "Attendance";
  if (pathname.includes("/results")) pageTitle = "Results & Performance";
  if (pathname.includes("/certificates")) pageTitle = "Certificates";
  if (pathname.includes("/reports")) pageTitle = "Reports & Analytics";
  if (pathname.includes("/settings")) pageTitle = "Settings";

  return (
    <header className="h-20 bg-[#2563eb] dark:bg-slate-900 flex items-center justify-between px-8 shrink-0 z-10 sticky top-0 shadow-sm transition-colors duration-300 print:hidden">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">{pageTitle}</h2>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6">
        <ThemeToggle />
        <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-white dark:bg-slate-800 rounded-full shadow-sm border border-transparent dark:border-slate-700">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-blue-400 dark:border-slate-700">
          <div className="w-10 h-10 bg-white dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold overflow-hidden border-2 border-transparent dark:border-slate-800 shadow-sm transition-colors">
            <User className="w-6 h-6" />
          </div>
          <div className="hidden md:block text-sm">
            <p className="font-bold text-white transition-colors">Hello, Admin User</p>
            <p className="text-blue-100 dark:text-slate-400 text-xs transition-colors">School Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
