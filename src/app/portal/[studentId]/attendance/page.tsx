import { prisma } from "@/lib/prisma";
import { CalendarCheck, AlertTriangle, FileText, Loader2 } from "lucide-react";
import { LeaveApplicationForm } from "@/components/portal/LeaveApplicationForm";
import { Suspense } from "react";

// The Async Data Component
async function AttendanceData({ studentId }: { studentId: string }) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [attendance, leaveRequests] = await Promise.all([
    prisma.attendance.findMany({
      where: { 
        studentId,
        date: { gte: thirtyDaysAgo }
      },
      orderBy: { date: 'desc' }
    }),
    prisma.leaveRequest.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
      take: 5
    })
  ]);

  const totalDays = attendance.length;
  const presentDays = attendance.filter(a => a.status === 'PRESENT').length;
  const percentage = totalDays === 0 ? 100 : Math.round((presentDays / totalDays) * 100);

  return (
    <div className="space-y-6">
      {/* Analytics Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 mb-1">Attendance Rate</p>
            <h3 className={`text-4xl font-black ${percentage >= 75 ? 'text-green-500' : 'text-red-500'}`}>
              {percentage}%
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              Present {presentDays} out of {totalDays} days
            </p>
          </div>
          
          {/* Circular Progress */}
          <div className="relative w-24 h-24">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <path
                className="text-slate-100 dark:text-slate-800"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none" stroke="currentColor" strokeWidth="4"
              />
              <path
                className={percentage >= 75 ? "text-green-500" : "text-red-500"}
                strokeDasharray={`${percentage}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none" stroke="currentColor" strokeWidth="4"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Warning if low */}
      {percentage < 75 && totalDays > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-2xl p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-xs text-red-700 dark:text-red-400 font-medium">
            Attendance is below the required 75%. Please ensure regular attendance to avoid academic penalties.
          </p>
        </div>
      )}

      {/* Leave Requests */}
      {leaveRequests.length > 0 && (
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            Recent Leave Applications
          </h3>
          <div className="space-y-3">
            {leaveRequests.map(request => (
              <div key={request.id} className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {request.startDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} 
                      {request.startDate.getTime() !== request.endDate.getTime() && 
                        ` - ${request.endDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
                      }
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{request.reason}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                    request.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                    request.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {request.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Records */}
      <div>
        <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
          <CalendarCheck className="w-4 h-4 text-slate-400" />
          Recent Attendance
        </h3>
        <div className="space-y-3">
          {attendance.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">No recent attendance records found.</p>
          ) : (
            attendance.slice(0, 10).map(record => (
              <div key={record.id} className="bg-white dark:bg-slate-900 rounded-xl p-4 flex items-center justify-between shadow-sm border border-slate-200 dark:border-slate-800">
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {record.date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                  record.status === 'PRESENT' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                  record.status === 'ABSENT' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                  'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                }`}>
                  {record.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// The Instant Loading Page Shell
export default async function PortalAttendance({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-2xl flex items-center justify-center">
          <CalendarCheck className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Attendance</h2>
          <p className="text-xs text-slate-500 font-medium">Last 30 Days Overview</p>
        </div>
      </div>

      {/* Apply Leave Form Client Component - Loads Instantly */}
      <LeaveApplicationForm studentId={studentId} />

      <Suspense fallback={
        <div className="py-12 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
          <p className="text-sm font-medium animate-pulse">Loading attendance records...</p>
        </div>
      }>
        <AttendanceData studentId={studentId} />
      </Suspense>
    </div>
  );
}
