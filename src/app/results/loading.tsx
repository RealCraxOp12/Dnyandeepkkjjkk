import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full bg-transparent p-8">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-[#1a73e8] dark:text-blue-400 animate-spin" />
        <p className="text-slate-500 dark:text-slate-400 font-medium">Loading results module...</p>
      </div>
    </div>
  );
}
