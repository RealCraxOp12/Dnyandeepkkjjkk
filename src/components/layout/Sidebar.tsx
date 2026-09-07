"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, UserPlus, FileText, Settings, LayoutDashboard, GraduationCap, CalendarCheck, Award, LogOut } from "lucide-react";
import clsx from "clsx";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Students", href: "/students", icon: Users },
  { name: "Admissions", href: "/admissions", icon: UserPlus },
  { name: "Attendance", href: "/attendance", icon: CalendarCheck },
  { name: "Results", href: "/results", icon: GraduationCap },
  { name: "Certificates", href: "/certificates", icon: Award },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col shrink-0 print:hidden shadow-sm z-10 transition-colors duration-300">
      {/* Top Blue Header Area */}
      <div className="h-40 bg-[#2563eb] dark:bg-blue-900 flex flex-col items-center justify-center px-6 shrink-0 relative overflow-hidden transition-colors duration-300">
        <div className="relative z-10 flex flex-col items-center">
          <GraduationCap className="w-12 h-12 text-white mb-2" />
          <h1 className="text-2xl font-bold text-white tracking-wider">DEMS</h1>
          <p className="text-blue-100 text-[10px] mt-1 text-center font-medium opacity-80 uppercase tracking-widest">Dnyandeep English<br/>Medium School</p>
        </div>
        {/* Decorative circle */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full blur-xl"></div>
      </div>
      
      {/* White rounded container effect connecting to header */}
      <div className="bg-[#2563eb] dark:bg-blue-900 shrink-0 h-4 relative transition-colors duration-300">
         <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-tl-2xl transition-colors duration-300"></div>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto bg-white dark:bg-slate-900 transition-colors duration-300">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              prefetch={true}
              className={clsx(
                "flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200",
                isActive 
                  ? "bg-[#2563eb] dark:bg-blue-600 text-white shadow-md shadow-blue-500/20 translate-x-1" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
              )}
            >
              <item.icon className={clsx("w-5 h-5", isActive ? "text-white" : "text-slate-400 dark:text-slate-500")} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0 transition-colors duration-300">
        <button className="flex w-full items-center gap-4 px-4 py-3 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100 rounded-xl transition-colors">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
