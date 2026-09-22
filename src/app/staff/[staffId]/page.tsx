import { Search, Bell, BookOpen, FileText, GraduationCap, ClipboardCheck, Trophy, CalendarCheck, Megaphone, User, Users, Award, CheckCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Suspense } from "react";

async function StaffDashboardData({ staffId }: { staffId: string }) {
  // Bypass Next.js Prisma memory cache using raw SQL
  const staffRecords = await prisma.$queryRaw<any[]>`SELECT * FROM "Staff" WHERE "id" = ${staffId} LIMIT 1`;
  const staff = staffRecords && staffRecords.length > 0 ? staffRecords[0] : null;

  if (!staff) return null;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-transparent">
      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-auto p-8 pt-4">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Hero Banner (Admin Aesthetic) */}
          <div className="relative bg-gradient-to-r from-[#e8f0fe] to-[#d2e3fc] dark:from-blue-900/40 dark:to-blue-800/40 rounded-2xl p-8 overflow-hidden shadow-sm border border-blue-50/50 dark:border-blue-800/30 transition-colors duration-300">
            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">👋</span>
                <h3 className="text-xl font-medium text-slate-700 dark:text-slate-200">Good Morning,</h3>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a73e8] dark:text-blue-400 mb-4">{staff.firstName} {staff.surname}</h2>
              <p className="text-slate-600 dark:text-slate-300 font-medium">Welcome to the Staff Engine. Manage class data and uploads from here.</p>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute right-10 bottom-0 top-0 hidden md:flex items-center justify-center pointer-events-none opacity-90">
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 bg-blue-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <BookOpen className="w-32 h-32 text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl z-20" />
                <CheckCircle className="w-16 h-16 text-indigo-400 absolute top-10 right-10 rotate-12 drop-shadow-xl z-10" />
                <FileText className="w-12 h-12 text-blue-400 absolute bottom-12 left-10 -rotate-12 drop-shadow-xl z-10" />
              </div>
            </div>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col transition-colors duration-300">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">My Class</h4>
                  <p className="text-xl font-bold text-slate-800 dark:text-white">{staff.assignedClass || "None"}</p>
                </div>
              </div>
              <div className="text-xs font-semibold text-blue-500 mt-auto">Current Assignment</div>
            </div>
            
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col transition-colors duration-300">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-500 flex items-center justify-center shrink-0">
                  <CalendarCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Attendance</h4>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">Pending</p>
                </div>
              </div>
              <div className="text-xs font-semibold text-green-500 mt-auto">For Today</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col transition-colors duration-300">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-500 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Homework</h4>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">3</p>
                </div>
              </div>
              <div className="text-xs font-semibold text-purple-500 mt-auto">Active this week</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col transition-colors duration-300">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/30 text-orange-500 flex items-center justify-center shrink-0">
                  <ClipboardCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Leave Requests</h4>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">2</p>
                </div>
              </div>
              <div className="text-xs font-semibold text-orange-500 mt-auto">Requires Approval</div>
            </div>
          </div>

          {/* Middle Row: Data Entry Quick Access */}
          <div className="grid grid-cols-1 gap-6 pb-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 transition-colors duration-300">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Data Entry & Uploads</h3>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                
                <Link href={`/staff/${staffId}/attendance`} className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-slate-50 dark:border-slate-800 group">
                  <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform"><CalendarCheck className="w-7 h-7" strokeWidth={1.5} /></div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 text-center">Manage<br/>Attendance</span>
                </Link>

                <Link href={`/staff/${staffId}/homework`} className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-slate-50 dark:border-slate-800 group">
                  <div className="w-14 h-14 bg-green-50 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform"><BookOpen className="w-7 h-7" strokeWidth={1.5} /></div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 text-center">Manage<br/>Homework</span>
                </Link>

                <Link href={`/staff/${staffId}/results`} className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-slate-50 dark:border-slate-800 group">
                  <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform"><Trophy className="w-7 h-7" strokeWidth={1.5} /></div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 text-center">Manage<br/>Results</span>
                </Link>

                <Link href={`/staff/${staffId}/notices`} className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-slate-50 dark:border-slate-800 group">
                  <div className="w-14 h-14 bg-rose-50 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform"><Megaphone className="w-7 h-7" strokeWidth={1.5} /></div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 text-center">Manage<br/>Notices</span>
                </Link>

                <Link href={`/staff/${staffId}/syllabus`} className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-slate-50 dark:border-slate-800 group">
                  <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform"><FileText className="w-7 h-7" strokeWidth={1.5} /></div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 text-center">Upload<br/>Syllabus</span>
                </Link>

                <Link href={`/staff/${staffId}/notes`} className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-slate-50 dark:border-slate-800 group">
                  <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform"><ClipboardCheck className="w-7 h-7" strokeWidth={1.5} /></div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 text-center">Upload<br/>Notes</span>
                </Link>

              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default async function StaffDashboard({
  params,
}: {
  params: Promise<{ staffId: string }>;
}) {
  const { staffId } = await params;
  
  return (
    <Suspense fallback={<div className="p-8">Loading dashboard...</div>}>
      <StaffDashboardData staffId={staffId} />
    </Suspense>
  );
}
