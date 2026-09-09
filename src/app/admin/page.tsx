"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Navbar from "@/components/Navbar"
import { UserPlus, Users, Search, Trash2, ArrowLeft, Download, Bus, List } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function AdminDashboard() {
  const [teachers, setTeachers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newUsername, setNewUsername] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newName, setNewName] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null)
  const [teacherActivity, setTeacherActivity] = useState<any[]>([])
  const [loadingActivity, setLoadingActivity] = useState(false)
  const [activityFilter, setActivityFilter] = useState('All')
  
  const [activeView, setActiveView] = useState<'teachers' | 'busLogs'>('teachers')
  const [allBusLogs, setAllBusLogs] = useState<any[]>([])
  const [loadingBusLogs, setLoadingBusLogs] = useState(false)

  const fetchBusLogs = async () => {
    setLoadingBusLogs(true)
    const { data } = await supabase
      .from('module_records')
      .select('*, users(username, teachers(name))')
      .eq('module_name', 'bus')
      .order('created_at', { ascending: false })
      
    if (data) {
      setAllBusLogs(data)
    }
    setLoadingBusLogs(false)
  }

  useEffect(() => {
    if (activeView === 'busLogs') {
      fetchBusLogs()
    }
  }, [activeView])

  const fetchTeachers = async () => {
    setLoading(true)
    const { data: users, error } = await supabase
      .from('users')
      .select('*, teachers(*)')
      .eq('role', 'sub_admin')
    
    if (!error && users) {
      setTeachers(users)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeacherActivity = async (teacherId: string) => {
    setLoadingActivity(true)
    
    // Fetch notices
    const { data: noticesData } = await supabase
      .from('notices')
      .select('*')
      .eq('teacher_id', teacherId)

    // Fetch module records
    const { data: recordsData } = await supabase
      .from('module_records')
      .select('*')
      .eq('teacher_id', teacherId)

    // Merge and sort
    const merged = [
      ...(noticesData?.map(n => ({ ...n, type: 'Notice' })) || []),
      ...(recordsData?.map(r => ({ ...r, type: r.module_name })) || [])
    ]
    
    merged.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    
    setTeacherActivity(merged)
    setLoadingActivity(false)
  }

  useEffect(() => {
    if (selectedTeacher) {
      fetchTeacherActivity(selectedTeacher.id)
    }
  }, [selectedTeacher])

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAdding(true)

    // Insert user first
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([{ username: newUsername, password: newPassword, role: 'sub_admin' }])
      .select()
      .single()

    if (!userError && userData) {
      // Insert profile
      await supabase
        .from('teachers')
        .insert([{ user_id: userData.id, name: newName }])
      
      setNewUsername("")
      setNewPassword("")
      setNewName("")
      fetchTeachers()
    } else {
      alert("Error adding teacher: " + (userError?.message || "Unknown error"))
    }
    setIsAdding(false)
  }

  const handleDelete = async (id: string) => {
    if(confirm("Are you sure you want to remove this teacher?")) {
      await supabase.from('users').delete().eq('id', id)
      fetchTeachers()
    }
  }

  return (
    <main className="min-h-screen bg-[#f0f4f8] dark:bg-[#0f172a] relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-300/20 blur-[100px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto p-4 sm:p-6 relative z-10">
        <Navbar title="Principal Dashboard" role="Main Admin" />
        
        <div className="flex gap-4 mb-8 border-b border-white/20 pb-4">
          <button 
            onClick={() => setActiveView('teachers')}
            className={`px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 transition-all ${activeView === 'teachers' ? 'bg-[#002045] text-white shadow-lg' : 'bg-white/40 dark:bg-black/20 text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-black/40'}`}
          >
            <Users size={18} /> Manage Sub-Admins
          </button>
          <button 
            onClick={() => setActiveView('busLogs')}
            className={`px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 transition-all ${activeView === 'busLogs' ? 'bg-[#002045] text-white shadow-lg' : 'bg-white/40 dark:bg-black/20 text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-black/40'}`}
          >
            <Bus size={18} /> Global Bus Logs
          </button>
        </div>
        
        {activeView === 'teachers' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Add Teacher Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-6 rounded-3xl h-fit"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[#002045]/10 rounded-xl">
                <UserPlus className="text-[#002045] dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Add Sub-Admin</h2>
            </div>
            
            <form onSubmit={handleAddTeacher} className="space-y-4">
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-400 ml-1">Full Name</label>
                <input 
                  type="text" required value={newName} onChange={e => setNewName(e.target.value)}
                  className="w-full mt-1 px-4 py-2 bg-white/50 dark:bg-black/20 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002045]/50"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-400 ml-1">Username</label>
                <input 
                  type="text" required value={newUsername} onChange={e => setNewUsername(e.target.value)}
                  className="w-full mt-1 px-4 py-2 bg-white/50 dark:bg-black/20 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002045]/50"
                  placeholder="Unique login ID"
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-400 ml-1">Password</label>
                <input 
                  type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  className="w-full mt-1 px-4 py-2 bg-white/50 dark:bg-black/20 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002045]/50"
                  placeholder="Initial password"
                />
              </div>
              <button 
                disabled={isAdding}
                className="w-full mt-4 py-3 bg-[#002045] hover:bg-[#002045]/90 text-white rounded-xl font-medium transition-colors"
              >
                {isAdding ? "Adding..." : "Create Sub-Admin"}
              </button>
            </form>
          </motion.div>

          {/* Teacher List or Activity Report */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 glass p-6 rounded-3xl"
          >
            {!selectedTeacher ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-teal-500/10 rounded-xl">
                      <Users className="text-teal-600 dark:text-teal-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Manage Teachers</h2>
                  </div>
                </div>

                {loading ? (
                  <div className="py-12 text-center text-slate-500">Loading teachers...</div>
                ) : teachers.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 bg-white/30 dark:bg-black/10 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                    No teachers added yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {teachers.map((t: any) => (
                      <div 
                        key={t.id} 
                        onClick={() => setSelectedTeacher(t)}
                        className="flex items-center justify-between p-4 bg-white/60 dark:bg-slate-800/60 rounded-2xl border border-white/30 shadow-sm transition-all hover:shadow-md cursor-pointer hover:bg-white/80 dark:hover:bg-slate-800/80"
                      >
                        <div className="flex items-center gap-4">
                          {t.teachers?.[0]?.avatar_url ? (
                            <img 
                              src={t.teachers[0].avatar_url} 
                              alt="Profile" 
                              className="w-12 h-12 rounded-full object-cover border-2 border-white/50 shadow-sm"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#13696a]/20 to-[#002045]/20 flex items-center justify-center border-2 border-white/50 shadow-sm">
                              <span className="text-slate-700 dark:text-slate-300 font-bold text-lg">
                                {(t.teachers?.[0]?.name || t.username).charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                              {t.teachers?.[0]?.name || 'Unknown Name'}
                            </h3>
                            <p className="text-sm text-slate-500">@{t.username}</p>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(t.id); }}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                          title="Remove teacher"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <button 
                    onClick={() => setSelectedTeacher(null)}
                    className="p-2 bg-white/50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <ArrowLeft className="text-slate-700 dark:text-slate-200" />
                  </button>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                      {selectedTeacher.teachers?.[0]?.name || 'Unknown Name'}'s Activity
                    </h2>
                    <p className="text-sm text-slate-500">@{selectedTeacher.username}</p>
                  </div>
                </div>

                {loadingActivity ? (
                  <div className="py-12 text-center text-slate-500">Loading activity...</div>
                ) : teacherActivity.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 bg-white/30 dark:bg-black/10 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                    No activity recorded yet.
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar hide-scrollbar">
                      {['All', ...Array.from(new Set(teacherActivity.map(r => r.type)))].map(m => (
                        <button 
                          key={m as string}
                          onClick={() => setActivityFilter(m as string)}
                          className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all shadow-sm ${
                            activityFilter === m 
                              ? 'bg-[#13696a] text-white' 
                              : 'bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80 border border-white/20'
                          }`}
                        >
                          {m === 'All' ? 'All Activity' : String(m).toUpperCase()}
                        </button>
                      ))}
                    </div>
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                      {(activityFilter === 'All' ? teacherActivity : teacherActivity.filter(r => r.type === activityFilter)).map((r: any) => (
                        <div key={r.id} className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-2xl border border-white/30 shadow-sm flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                          <span className="px-2 py-1 bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-xs font-semibold rounded-lg uppercase tracking-wider">
                            {r.type}
                          </span>
                          <span className="text-xs text-slate-400">
                            {new Date(r.created_at).toLocaleString()}
                          </span>
                        </div>
                        <h4 className="font-semibold text-slate-800 dark:text-slate-100 mt-1">{r.title}</h4>
                        <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap text-sm">
                          {r.description || r.content}
                        </p>
                        {r.file_url && (
                          <a 
                            href={r.file_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-2 text-sm text-teal-600 dark:text-teal-400 hover:underline font-medium w-fit"
                          >
                            <Download size={14} /> View Attached File
                          </a>
                        )}
                      </div>
                    ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>

        </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-8 rounded-3xl"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-amber-500/10 rounded-xl">
                <List className="text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">All Bus & Transport Logs</h2>
            </div>

            {loadingBusLogs ? (
              <div className="py-12 text-center text-slate-500">Loading bus logs...</div>
            ) : allBusLogs.length === 0 ? (
              <div className="py-12 text-center text-slate-500 bg-white/30 dark:bg-black/10 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                No transport logs have been recorded yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allBusLogs.map((r: any) => (
                  <div key={r.id} className="p-5 bg-white/60 dark:bg-slate-800/60 rounded-2xl border border-white/30 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {r.title?.includes('Leaving') ? (
                          <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded uppercase">Leaving</span>
                        ) : (
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded uppercase">Arriving</span>
                        )}
                        <h4 className="font-semibold text-slate-800 dark:text-slate-100">{r.title?.replace(/Leaving - |Arriving - /, '')}</h4>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 mt-3 whitespace-pre-wrap text-sm leading-relaxed">
                        {r.description}
                      </p>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-col gap-1">
                      <span className="text-xs text-slate-500">
                        Logged by: {r.users?.teachers?.[0]?.name || r.users?.username || 'Unknown Admin'}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {new Date(r.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </main>
  )
}
