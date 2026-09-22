'use client';

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { useEffect, useState } from "react";

export function GlobalLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPortal = pathname?.startsWith("/portal");
  const isStaff = pathname === "/staff" || pathname?.startsWith("/staff/");

  if (isPortal || isStaff) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 w-full overflow-y-auto">
        {children}
      </div>
    );
  }

  // Admin Layout
  return (
    <div className="min-h-full flex h-screen bg-[#f4f7fe] dark:bg-[#0f172a] overflow-hidden print:h-auto print:overflow-visible print:bg-white transition-colors duration-300 w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden print:overflow-visible print:block relative">
        <TopNav />
        {children}
      </div>
    </div>
  );
}
