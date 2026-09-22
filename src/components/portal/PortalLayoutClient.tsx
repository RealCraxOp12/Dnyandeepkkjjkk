'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Home, BookOpen, CreditCard, MessageSquare, User, Menu, Bell, Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { destroyParentSession } from "@/app/actions/portalAuth"; // Need to create a client action for this

export default function PortalLayoutClient({
  children,
  studentId,
  studentName
}: {
  children: React.ReactNode;
  studentId: string;
  studentName: string;
}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pb-20 md:pb-0 md:pl-64 transition-colors">
      
      {/* Top Header - Deep Blue style from image */}
      <header className="bg-[#1A2E5A] dark:bg-slate-900 text-white pt-12 pb-24 px-6 rounded-b-[40px] relative transition-colors">
        <div className="max-w-3xl mx-auto flex items-center justify-between relative">
          <div className="flex items-center gap-4">
            <button className="p-1 md:hidden">
              <Menu className="w-7 h-7 text-white" />
            </button>
            <div>
              <p className="text-xs text-blue-200 dark:text-slate-400 opacity-90">Good Morning,</p>
              <h1 className="font-bold text-lg tracking-wide">Parents 👋</h1>
            </div>
          </div>
          
          {/* Action Buttons Container - Highest Z-Index to avoid overlap */}
          <div className="flex items-center gap-4 relative z-50">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            )}
            <div className="relative">
              <Bell className="w-6 h-6 text-white" />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-[#1A2E5A] dark:border-slate-900 rounded-full"></div>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-[#1A2E5A] dark:text-white overflow-hidden border-2 border-white dark:border-slate-800 transition-colors hover:ring-2 hover:ring-blue-400 focus:outline-none"
              >
                 <User className="w-6 h-6 text-slate-400 dark:text-slate-300" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden py-1">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{studentName}</p>
                    </div>
                    <button 
                      onClick={() => destroyParentSession()}
                      className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Main Content Area - overlaps the header slightly */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-5 -mt-16 z-10 relative">
        {children}
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 z-50 px-2 pb-safe pt-2 rounded-t-3xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] transition-colors">
        <div className="flex items-center justify-around pb-2 pt-1">
          <Link href={`/portal/${studentId}`} className="flex flex-col items-center p-2 text-[#1A2E5A] dark:text-white">
            <Home className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold">Home</span>
          </Link>
          <Link href={`/portal/${studentId}/timetable`} className="flex flex-col items-center p-2 text-slate-400 dark:text-slate-500 hover:text-[#1A2E5A] dark:hover:text-white transition-colors">
            <BookOpen className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-semibold">Academics</span>
          </Link>
          <Link href={`/portal/${studentId}/fees`} className="flex flex-col items-center p-2 text-slate-400 dark:text-slate-500 hover:text-[#1A2E5A] dark:hover:text-white transition-colors">
            <CreditCard className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-semibold">Fees</span>
          </Link>
          <Link href={`/portal/${studentId}/notices`} className="flex flex-col items-center p-2 text-slate-400 dark:text-slate-500 hover:text-[#1A2E5A] dark:hover:text-white transition-colors">
            <MessageSquare className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-semibold">Messages</span>
          </Link>
          <button onClick={() => destroyParentSession()} className="flex flex-col items-center p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 transition-colors">
            <User className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-semibold">Logout</span>
          </button>
        </div>
      </nav>

      {/* Desktop Navigation Alternative (Hidden on Mobile) */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-40 pt-20 transition-colors">
        <div className="flex flex-col p-4 gap-2">
          <Link href={`/portal/${studentId}`} className="flex items-center gap-3 p-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors">
            <Home className="w-5 h-5 text-blue-500" /> Dashboard
          </Link>
          <Link href={`/portal/${studentId}/timetable`} className="flex items-center gap-3 p-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors">
            <BookOpen className="w-5 h-5 text-green-500" /> Academics
          </Link>
          <Link href={`/portal/${studentId}/fees`} className="flex items-center gap-3 p-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors">
            <CreditCard className="w-5 h-5 text-blue-500" /> Fees
          </Link>
          <Link href={`/portal/${studentId}/notices`} className="flex items-center gap-3 p-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors">
            <MessageSquare className="w-5 h-5 text-purple-500" /> Messages
          </Link>
        </div>
        <div className="mt-auto p-4 border-t border-slate-200 dark:border-slate-800">
           <button onClick={() => destroyParentSession()} className="w-full flex items-center gap-3 p-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-colors">
            <User className="w-5 h-5" /> Logout
          </button>
        </div>
      </nav>

    </div>
  );
}
