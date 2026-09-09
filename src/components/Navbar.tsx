"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

export default function Navbar({ title, role, avatarUrl }: { title: string, role: string, avatarUrl?: string }) {
  const router = useRouter()

  const handleLogout = () => {
    // Basic logout handling
    router.push("/")
  }

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center mb-8 border-b border-white/20">
      <div className="flex items-center gap-4">
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt="Profile Avatar" 
            className="w-10 h-10 rounded-full object-cover border-2 border-white/20 shadow-lg"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#002045] to-[#13696a] flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">{title.replace("Welcome, ", "").charAt(0).toUpperCase() || 'C'}</span>
          </div>
        )}
        <div>
          <h1 className="font-bold text-slate-800 dark:text-slate-100">{title}</h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest">{role}</p>
        </div>
      </div>
      
      <button 
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
      >
        <LogOut size={16} /> Logout
      </button>
    </nav>
  )
}
