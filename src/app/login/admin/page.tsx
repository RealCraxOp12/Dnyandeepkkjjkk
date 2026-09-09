"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { User, Lock, ArrowRight, ShieldCheck, GraduationCap } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function AdminLogin() {
  const [isAdmin, setIsAdmin] = useState(true)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Functional mock authentication against our schema
      const roleToMatch = isAdmin ? 'main_admin' : 'sub_admin'
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .eq('role', roleToMatch)
        .single()

      if (error || !data) {
        throw new Error("Invalid username or password.")
      }

      // Handle successful login
      // Save to localStorage so dashboard can know who is logged in
      localStorage.setItem("currentUser", JSON.stringify(data))
      
      if (isAdmin) {
        router.push("/admin")
      } else {
        router.push("/teacher")
      }
    } catch (err: any) {
      setError(err.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen relative overflow-hidden bg-[#f0f4f8] dark:bg-[#0f172a]">
      {/* Decorative liquid background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-300/30 blur-[100px] mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-teal-300/20 blur-[100px] mix-blend-multiply pointer-events-none" />

      {/* Top Right Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <div className="glass flex items-center p-1 rounded-full border border-white/20">
          <button
            onClick={() => setIsAdmin(true)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isAdmin ? 'bg-[#002045] text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-white/20'}`}
          >
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} /> Principal
            </div>
          </button>
          <button
            onClick={() => setIsAdmin(false)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!isAdmin ? 'bg-[#13696a] text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-white/20'}`}
          >
            <div className="flex items-center gap-2">
              <GraduationCap size={16} /> Teacher
            </div>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-1 p-6 z-10">
        <motion.div 
          key={isAdmin ? 'admin' : 'teacher'}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass p-8 sm:p-12 rounded-3xl w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              {isAdmin ? 'Main Admin' : 'Sub-Admin'}
            </h1>
            <p className="text-slate-500 mt-2">
              {isAdmin ? 'Login to manage the institution.' : 'Login to manage your classes.'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-xl text-sm text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black/20 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002045]/50 transition-all backdrop-blur-sm"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black/20 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002045]/50 transition-all backdrop-blur-sm"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-semibold shadow-lg transition-all ${
                isAdmin ? 'bg-[#002045] hover:bg-[#002045]/90' : 'bg-[#13696a] hover:bg-[#13696a]/90'
              } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight size={18} />
            </motion.button>
          </form>
        </motion.div>
      </div>
    </main>
  )
}
