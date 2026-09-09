"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { User, Lock, ArrowRight, Heart } from "lucide-react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function ParentLogin() {
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
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .eq('role', 'parent')
        .single()

      if (error || !data) {
        throw new Error("Invalid username or password.")
      }

      router.push("/parent")
    } catch (err: any) {
      setError(err.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen relative overflow-hidden bg-[#f0f4f8] dark:bg-[#0f172a]">
      {/* Decorative liquid background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-orange-300/20 blur-[100px] mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-pink-300/20 blur-[100px] mix-blend-multiply pointer-events-none" />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-1 p-6 z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass p-8 sm:p-12 rounded-3xl w-full max-w-md"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-400 to-pink-500 flex items-center justify-center shadow-lg">
              <Heart className="text-white w-8 h-8" />
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              Parent Portal
            </h1>
            <p className="text-slate-500 mt-2">
              Stay connected with your child's progress.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-xl text-sm text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Username provided by teacher</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black/20 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all backdrop-blur-sm"
                  placeholder="e.g., p.smith123"
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
                  className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black/20 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all backdrop-blur-sm"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-semibold shadow-lg transition-all bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight size={18} />
            </motion.button>
            
            <div className="text-center mt-6">
               <Link href="/" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
                 &larr; Back to home
               </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  )
}
