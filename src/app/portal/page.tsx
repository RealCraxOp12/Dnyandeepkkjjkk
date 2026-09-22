'use client';

import { useState, useEffect } from "react";
import { loginParent } from "@/app/actions/portal";
import { useRouter } from "next/navigation";
import { GraduationCap, User, Calendar, Moon, Sun, ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";

export default function PortalLoginPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await loginParent(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else if (result?.success && result.redirectUrl) {
      router.push(result.redirectUrl);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative font-sans selection:bg-blue-500/30">
      
      {/* Full Screen Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-slate-900"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Dynamic Gradient Overlay - lighter in light mode, darker in dark mode */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-[#1A2E5A]/90 to-black/90 dark:from-slate-950/95 dark:via-black/95 dark:to-slate-900/95 backdrop-blur-[2px]"></div>
      </div>

      {/* Theme Toggle Button */}
      {mounted && (
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="absolute top-6 right-6 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white shadow-lg backdrop-blur-md transition-all hover:scale-105"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      )}

      {/* Main Container - Centered */}
      <div className="relative z-10 w-full max-w-[1000px] flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 px-6 py-12 h-full overflow-y-auto">
        
        {/* Left Side: Branding */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left text-white max-w-sm mt-8 md:mt-0">
          <div className="w-20 h-20 bg-white/10 border border-white/20 rounded-3xl flex items-center justify-center mb-6 backdrop-blur-md shadow-2xl">
            <GraduationCap className="w-10 h-10 text-blue-300" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">DEMS</h1>
          <h2 className="text-lg md:text-xl font-medium text-blue-200 mb-6 tracking-wide">Dnyandeep English Medium School</h2>
          
          <div className="h-1 w-12 bg-blue-500 rounded-full mb-6"></div>
          
          <p className="text-lg font-light text-slate-300 leading-relaxed hidden md:block">
            Welcome to the Parent Portal. Stay instantly connected with your child's academic progress, attendance, and daily school activities.
          </p>
        </div>

        {/* Right Side: Glassmorphism Form Card */}
        <div className="w-full max-w-[420px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] p-8 md:p-10 border border-white/40 dark:border-slate-700/50">
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Parent Login</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-semibold rounded-2xl border border-red-100 dark:border-red-800/50 flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
                {error}
              </div>
            )}
            
            <div className="space-y-5">
              
              {/* Register Number Input */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">Student Register No.</label>
                <div className="relative flex items-center border-2 border-slate-100 dark:border-slate-800 rounded-2xl focus-within:border-blue-500 dark:focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all bg-white dark:bg-slate-800">
                  <div className="pl-4 pr-3 py-3.5 flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                  <input 
                    type="text" 
                    name="registerNo"
                    required
                    placeholder="e.g. 1029"
                    className="w-full px-2 py-3.5 text-base font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-500 bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              {/* Date of Birth Input */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">Date of Birth</label>
                <div className="relative border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-1 flex items-center focus-within:border-blue-500 dark:focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all bg-white dark:bg-slate-800">
                  <div className="pl-3 pr-2 py-2 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="flex w-full gap-1">
                    <select 
                      name="day" 
                      required 
                      defaultValue=""
                      className="w-1/3 px-1 py-3 text-sm font-semibold text-slate-800 dark:text-slate-100 bg-transparent focus:outline-none appearance-none text-center cursor-pointer"
                    >
                      <option value="" disabled>Day</option>
                      {Array.from({length: 31}, (_, i) => i + 1).map(d => (
                        <option key={d} value={d} className="text-black">{d}</option>
                      ))}
                    </select>
                    <span className="text-slate-200 dark:text-slate-700 py-3">|</span>
                    <select 
                      name="month" 
                      required 
                      defaultValue=""
                      className="w-1/3 px-1 py-3 text-sm font-semibold text-slate-800 dark:text-slate-100 bg-transparent focus:outline-none appearance-none text-center cursor-pointer"
                    >
                      <option value="" disabled>Mth</option>
                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
                        <option key={m} value={i + 1} className="text-black">{m}</option>
                      ))}
                    </select>
                    <span className="text-slate-200 dark:text-slate-700 py-3">|</span>
                    <select 
                      name="year" 
                      required 
                      defaultValue=""
                      className="w-1/3 px-1 py-3 text-sm font-semibold text-slate-800 dark:text-slate-100 bg-transparent focus:outline-none appearance-none text-center cursor-pointer"
                    >
                      <option value="" disabled>Year</option>
                      {Array.from({length: 25}, (_, i) => new Date().getFullYear() - i).map(y => (
                        <option key={y} value={y} className="text-black">{y}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-4 rounded-2xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-[0_10px_20px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_15px_30px_-10px_rgba(37,99,235,0.6)] hover:-translate-y-0.5"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Secure Login <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>
          
        </div>
      </div>
    </div>
  );
}
