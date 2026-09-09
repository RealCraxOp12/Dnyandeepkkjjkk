"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "@/components/Navbar"
import { Bell, BookOpen, ClipboardCheck, Calendar, Award, Bus, Download } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function ParentDashboard() {
  const [activeTab, setActiveTab] = useState('notices')
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const tabs = [
    { id: 'notices', name: 'Notices', icon: <Bell size={18} /> },
    { id: 'attendance', name: 'Attendance', icon: <ClipboardCheck size={18} /> },
    { id: 'homework', name: 'Homework', icon: <BookOpen size={18} /> },
    { id: 'results', name: 'Results', icon: <Award size={18} /> },
    { id: 'timetable', name: 'Time-Table', icon: <Calendar size={18} /> },
    { id: 'bus', name: 'Transport Info', icon: <Bus size={18} /> },
  ]

  const fetchRecords = async (tabId: string) => {
    setLoading(true)
    if (tabId === 'notices') {
      const { data } = await supabase.from('notices').select('*').order('created_at', { ascending: false })
      setRecords(data || [])
    } else {
      const { data } = await supabase
        .from('module_records')
        .select('*')
        .eq('module_name', tabId)
        .order('created_at', { ascending: false })
      setRecords(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchRecords(activeTab)
  }, [activeTab])

  return (
    <main className="min-h-screen bg-[#f0f4f8] dark:bg-[#0f172a] relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-orange-300/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-pink-300/20 blur-[100px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto p-4 sm:p-6 relative z-10">
        <Navbar title="Parent Portal" role="Parent" />
        
        <div className="glass rounded-3xl overflow-hidden shadow-xl border border-white/20">
          
          {/* Tabs */}
          <div className="flex overflow-x-auto scrollbar-hide border-b border-slate-200/50 dark:border-slate-700/50 p-2 gap-2 bg-white/40 dark:bg-black/20 backdrop-blur-md">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl whitespace-nowrap font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-md' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-white/10'
                }`}
              >
                {tab.icon} {tab.name}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : records.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-slate-500 py-16 bg-white/30 dark:bg-black/10 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700"
              >
                No updates posted for {tabs.find(t => t.id === activeTab)?.name?.toLowerCase()} yet.
              </motion.div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {records.map((r, i) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={r.id} 
                      className="p-5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl border border-white/40 shadow-sm"
                    >
                      <h4 className="text-xl font-semibold text-slate-800 dark:text-slate-100">{r.title}</h4>
                      <p className="text-slate-600 dark:text-slate-300 mt-2 whitespace-pre-wrap leading-relaxed">
                        {r.description || r.content}
                      </p>
                      {r.file_url && (
                        <div className="mt-4">
                          <a 
                            href={r.file_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 hover:bg-pink-500/20 text-pink-600 dark:text-pink-400 rounded-xl text-sm font-medium transition-colors"
                          >
                            <Download size={16} /> Download Attached File
                          </a>
                        </div>
                      )}
                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-sm text-slate-400">
                        <span>Posted by Teacher</span>
                        <span>{new Date(r.created_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  )
}
