'use client';

import { useState } from "react";
import { loginStaff } from "@/app/actions/staffAuth";
import { useRouter } from "next/navigation";
import { GraduationCap, Shield, User, Lock, ArrowRight } from "lucide-react";

export default function StaffLoginPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await loginStaff(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else if (result?.success && result.redirectUrl) {
      router.push(result.redirectUrl);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#f4f7fe] dark:bg-[#0f172a] font-sans selection:bg-blue-500/30 transition-colors duration-300">
      
      {/* Left Side: Solid Branding Panel (Admin Aesthetic) */}
      <div className="hidden lg:flex flex-col justify-between w-full max-w-lg bg-blue-600 dark:bg-blue-900 text-white p-12 relative overflow-hidden transition-colors duration-300">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight">DEMS Admin</h1>
          </div>
          
          <h2 className="text-4xl font-bold mb-6 leading-tight">Welcome to the<br />Staff Portal</h2>
          <p className="text-blue-100 text-lg leading-relaxed max-w-sm">
            Manage your daily classes, enter student marks, update attendance, and securely communicate with parents.
          </p>
        </div>

        {/* Decorative background elements matching admin aesthetic */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/4 -right-24 w-64 h-64 bg-blue-400 opacity-20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 text-sm font-medium text-blue-200">
          &copy; {new Date().getFullYear()} Dnyandeep English Medium School
        </div>
      </div>

      {/* Right Side: Clean Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 relative">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="lg:hidden flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 bg-blue-600 dark:bg-blue-900 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">DEMS Staff Portal</h1>
        </div>

        <div className="w-full max-w-[440px] bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none p-10 border border-slate-100 dark:border-slate-800 transition-colors duration-300">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Secure Login</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Enter your Employee ID and password to access your dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-semibold rounded-2xl border border-red-100 dark:border-red-800/50 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
                {error}
              </div>
            )}
            
            <div className="space-y-5">
              {/* Employee ID Input */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">Employee ID</label>
                <div className="relative flex items-center border-2 border-slate-100 dark:border-slate-800 rounded-2xl focus-within:border-blue-500 dark:focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all bg-slate-50 dark:bg-slate-950">
                  <div className="pl-4 pr-3 py-3.5 flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                  <input 
                    type="text" 
                    name="employeeId"
                    required
                    placeholder="Enter Employee ID"
                    className="w-full px-2 py-3.5 text-base font-bold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-2 ml-1">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Password</label>
                  <a href="#" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700">Forgot?</a>
                </div>
                <div className="relative flex items-center border-2 border-slate-100 dark:border-slate-800 rounded-2xl focus-within:border-blue-500 dark:focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all bg-slate-50 dark:bg-slate-950">
                  <div className="pl-4 pr-3 py-3.5 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-slate-400" />
                  </div>
                  <input 
                    type="password" 
                    name="password"
                    required
                    placeholder="Enter your password"
                    className="w-full px-2 py-3.5 text-base font-bold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 bg-transparent focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 active:translate-y-0"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Access Dashboard <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>
          
        </div>
      </div>
      
    </div>
  );
}
