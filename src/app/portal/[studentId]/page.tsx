import { prisma } from "@/lib/prisma";
import { CalendarCheck, Trophy, Bell, CreditCard, BookOpen, Clock, FileText, ChevronRight, User, Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

// Async Data Component
async function DashboardData({ studentId }: { studentId: string }) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      attendance: {
        orderBy: { date: 'desc' },
        take: 1
      }
    }
  });

  if (!student) return null;

  return (
    <div className="space-y-6 pb-8">
      {/* Student Profile Card (Overlaps Header) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-slate-100 dark:border-slate-800 relative transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
               <User className="w-8 h-8 text-slate-400 dark:text-slate-500 mt-2" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-tight">{student.firstName} {student.surname}</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Class {student.currentClass || "N/A"} | Roll No. {student.registerNo}</p>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 border border-green-100 dark:border-green-800">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Present Today
          </div>
        </div>
        
        <Link href={`/portal/${studentId}/attendance`} className="block border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-between group transition-colors">
          <div className="w-full pr-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Attendance (This Month)</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">94%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '94%' }}></div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
        </Link>
      </div>

      {/* Grid Menu (7 items) */}
      <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-7 gap-y-6 gap-x-2 px-1">
        <Link href={`/portal/${studentId}/attendance`} className="flex flex-col items-center gap-2 group">
          <div className="w-[60px] h-[60px] rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-105 transition-transform">
             <CalendarCheck className="w-7 h-7 text-blue-500 dark:text-blue-400" strokeWidth={1.5} />
          </div>
          <span className="text-[10px] font-bold text-[#1A2E5A] dark:text-slate-300">Attendance</span>
        </Link>
        
        <Link href={`/portal/${studentId}/fees`} className="flex flex-col items-center gap-2 group">
          <div className="w-[60px] h-[60px] rounded-2xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center group-hover:scale-105 transition-transform">
             <CreditCard className="w-7 h-7 text-amber-500 dark:text-amber-400" strokeWidth={1.5} />
          </div>
          <span className="text-[10px] font-bold text-[#1A2E5A] dark:text-slate-300">Fees</span>
        </Link>

        <Link href={`/portal/${studentId}/homework`} className="flex flex-col items-center gap-2 group">
          <div className="w-[60px] h-[60px] rounded-2xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center group-hover:scale-105 transition-transform">
             <BookOpen className="w-7 h-7 text-purple-500 dark:text-purple-400" strokeWidth={1.5} />
          </div>
          <span className="text-[10px] font-bold text-[#1A2E5A] dark:text-slate-300">Homework</span>
        </Link>

        <Link href={`/portal/${studentId}/results`} className="flex flex-col items-center gap-2 group">
          <div className="w-[60px] h-[60px] rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center group-hover:scale-105 transition-transform">
             <Trophy className="w-7 h-7 text-emerald-500 dark:text-emerald-400" strokeWidth={1.5} />
          </div>
          <span className="text-[10px] font-bold text-[#1A2E5A] dark:text-slate-300">Results</span>
        </Link>

        <Link href={`/portal/${studentId}/timetable`} className="flex flex-col items-center gap-2 group">
          <div className="w-[60px] h-[60px] rounded-2xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center group-hover:scale-105 transition-transform">
             <Clock className="w-7 h-7 text-red-500 dark:text-red-400" strokeWidth={1.5} />
          </div>
          <span className="text-[10px] font-bold text-[#1A2E5A] dark:text-slate-300">Timetable</span>
        </Link>

        <Link href={`/portal/${studentId}/notices`} className="flex flex-col items-center gap-2 group">
          <div className="w-[60px] h-[60px] rounded-2xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center group-hover:scale-105 transition-transform">
             <Bell className="w-7 h-7 text-orange-500 dark:text-orange-400" strokeWidth={1.5} />
          </div>
          <span className="text-[10px] font-bold text-[#1A2E5A] dark:text-slate-300">Notices</span>
        </Link>
      </div>

      {/* Today's Summary List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-[#1A2E5A] dark:text-slate-300" strokeWidth={1.5} />
            <h3 className="font-bold text-[#1A2E5A] dark:text-slate-100 text-sm">Today's Summary</h3>
          </div>
          <button className="text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center hover:opacity-80">
            View All <ChevronRight className="w-3 h-3 ml-0.5" />
          </button>
        </div>

        <div className="space-y-4">
          <Link href={`/portal/${studentId}/homework`} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-purple-500 dark:text-purple-400" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-bold text-sm text-[#1A2E5A] dark:text-slate-200">Homework</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">No active assignments</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors" />
          </Link>

          <Link href={`/portal/${studentId}/results`} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center">
                <CalendarCheck className="w-4 h-4 text-orange-500 dark:text-orange-400" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-bold text-sm text-[#1A2E5A] dark:text-slate-200">Next Exam</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">To be scheduled</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors" />
          </Link>

          <Link href={`/portal/${studentId}/fees`} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-amber-500 dark:text-amber-400" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-bold text-sm text-[#1A2E5A] dark:text-slate-200">Fee Due</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">All clear</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors" />
          </Link>
        </div>
      </div>

      {/* Banner */}
      <div className="bg-[#FFF8E7] dark:bg-amber-900/20 rounded-2xl p-4 flex items-center justify-between border border-amber-100/50 dark:border-amber-800/30 relative overflow-hidden transition-colors">
        <div className="relative z-10 w-2/3">
          <h4 className="font-bold text-[#1A2E5A] dark:text-amber-100 text-sm mb-1">Your Child's<br/>Progress Matters</h4>
          <p className="text-[9px] text-[#1A2E5A]/70 dark:text-amber-200/70 font-medium">Together we build a brighter future.</p>
        </div>
        <div className="w-1/3 flex justify-end relative z-10">
           <Trophy className="w-12 h-12 text-amber-500/80 dark:text-amber-400/80" strokeWidth={1} />
        </div>
      </div>
    </div>
  );
}

export default async function PortalDashboard({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;

  return (
    <Suspense fallback={
      <div className="py-24 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
        <p className="text-sm font-medium animate-pulse">Loading dashboard...</p>
      </div>
    }>
      <DashboardData studentId={studentId} />
    </Suspense>
  );
}
