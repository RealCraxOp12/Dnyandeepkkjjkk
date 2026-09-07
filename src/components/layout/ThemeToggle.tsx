"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden"
      aria-label="Toggle Dark Mode"
    >
      <Sun className={`w-5 h-5 transition-all duration-300 ${theme === 'dark' ? 'scale-0 -rotate-90 opacity-0 hidden' : 'scale-100 rotate-0 opacity-100 block'}`} />
      <Moon className={`w-5 h-5 transition-all duration-300 ${theme === 'dark' ? 'scale-100 rotate-0 opacity-100 block' : 'scale-0 rotate-90 opacity-0 hidden'}`} />
    </button>
  );
}
