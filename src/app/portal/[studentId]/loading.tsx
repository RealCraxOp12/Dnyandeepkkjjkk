import { Loader2 } from "lucide-react";

export default function PortalLoading() {
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500 rounded-full blur animate-pulse opacity-20"></div>
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin relative z-10" />
      </div>
      <p className="text-sm font-bold text-slate-500 animate-pulse">Loading data...</p>
    </div>
  );
}
