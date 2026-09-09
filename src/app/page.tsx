"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative liquid background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-300/30 blur-[100px] mix-blend-multiply" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-teal-300/30 blur-[100px] mix-blend-multiply" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="glass p-12 rounded-3xl max-w-2xl w-full text-center z-10"
      >
        <motion.h1 
          className="text-5xl md:text-7xl font-bold mb-6 text-slate-800 dark:text-slate-100 tracking-tight"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        >
          Cadets Connectia
        </motion.h1>
        <p className="text-xl mb-12 text-slate-600 dark:text-slate-300 font-light">
          Bridging the gap between educators and parents.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link href="/login/admin" className="w-full sm:w-auto">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-8 py-4 bg-[#002045]/80 hover:bg-[#002045] text-white rounded-2xl font-semibold text-lg transition-colors backdrop-blur-md border border-white/10 shadow-xl"
            >
              School Portal (Staff)
            </motion.button>
          </Link>
          <Link href="/login/parent" className="w-full sm:w-auto">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-8 py-4 bg-[#13696a]/80 hover:bg-[#13696a] text-white rounded-2xl font-semibold text-lg transition-colors backdrop-blur-md border border-white/10 shadow-xl"
            >
              Parent Portal
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </main>
  )
}
