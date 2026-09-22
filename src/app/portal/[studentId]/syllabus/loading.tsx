export default function Loading() {
  return (
    <div className="flex-1 overflow-auto p-8 bg-slate-50 dark:bg-slate-950">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-64 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
          <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 space-y-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="h-12 w-full bg-slate-100 dark:bg-slate-800/50 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
