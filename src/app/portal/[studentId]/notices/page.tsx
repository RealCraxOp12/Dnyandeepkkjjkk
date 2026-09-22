import { prisma } from "@/lib/prisma";
import { Bell, Loader2, Calendar } from "lucide-react";
import { Suspense } from "react";

// Async Data Component
async function NoticesData() {
  const notices = await prisma.notice.findMany({
    orderBy: { createdAt: 'desc' }
  });

  if (notices.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600" />
        </div>
        <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-1">No Active Notices</h3>
        <p className="text-xs text-slate-500">You're all caught up!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notices.map((notice) => (
        <div key={notice.id} className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider ${
              notice.type === 'HOLIDAY' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
              notice.type === 'EXAM' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
              'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
            }`}>
              {notice.type}
            </span>
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              {notice.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-2">{notice.title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">{notice.content}</p>
        </div>
      ))}
    </div>
  );
}

// Instant Loading Page Shell
export default async function PortalNotices() {
  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl flex items-center justify-center">
          <Bell className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Notice Board</h2>
          <p className="text-xs text-slate-500 font-medium">School circulars & updates</p>
        </div>
      </div>

      <Suspense fallback={
        <div className="py-12 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-purple-500" />
          <p className="text-sm font-medium animate-pulse">Loading notices...</p>
        </div>
      }>
        <NoticesData />
      </Suspense>
    </div>
  );
}
