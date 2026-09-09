"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "@/components/Navbar"
import { 
  ClipboardCheck, BookOpen, Bell, Award, 
  FileText, CheckSquare, List, Calendar, 
  Bus, Plus, Trash2, ArrowLeft, Download, User, Navigation, Clock, CheckCircle
} from "lucide-react"
import { supabase } from "@/lib/supabase"

const modules = [
  { id: 'attendance', name: 'Attendance', icon: <ClipboardCheck /> },
  { id: 'homework', name: 'Homework', icon: <BookOpen /> },
  { id: 'notices', name: 'Notices', icon: <Bell /> },
  { id: 'results', name: 'Results', icon: <Award /> },
  { id: 'notes', name: 'Notes/Lectures', icon: <FileText /> },
  { id: 'practicals', name: 'Practicals/Assignement', icon: <CheckSquare /> },
  { id: 'syllabus', name: 'Syllabus', icon: <List /> },
  { id: 'timetable', name: 'Time-Table', icon: <Calendar /> },
  { id: 'bus', name: 'Bus & Transport Logs', icon: <Bus /> },
  { id: 'profile', name: 'Profile Settings', icon: <User /> },
]

export default function TeacherDashboard() {
  const [activeModule, setActiveModule] = useState<string | null>(null)
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newDesc, setNewDesc] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [teacherName, setTeacherName] = useState<string>("")
  const [teacherAvatar, setTeacherAvatar] = useState<string>("")
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  
  // Bus Driver form state
  const [driverName, setDriverName] = useState("")
  const [busNumber, setBusNumber] = useState("")
  const [busStatus, setBusStatus] = useState<"Leaving" | "Arriving">("Leaving")
  const [phNo, setPhNo] = useState("")
  const [busSuccess, setBusSuccess] = useState(false)

  const fetchTeacherData = async (userId: string) => {
    const { data } = await supabase.from('teachers').select('*').eq('user_id', userId).single()
    if (data) {
      setTeacherName(data.name)
      if (data.avatar_url) {
        setTeacherAvatar(data.avatar_url)
      }
    }
  }

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (user) {
      const parsed = JSON.parse(user)
      setCurrentUser(parsed)
      fetchTeacherData(parsed.id)
    }
  }, [])

  const activeModuleData = modules.find(m => m.id === activeModule)
  const canAttachFile = ['homework', 'notices', 'results', 'notes', 'practicals', 'syllabus', 'timetable'].includes(activeModule || '')

  const fetchRecords = async (moduleId: string) => {
    setLoading(true)
    if (moduleId === 'notices') {
      const { data } = await supabase.from('notices').select('*').order('created_at', { ascending: false })
      setRecords(data || [])
    } else {
      const { data } = await supabase
        .from('module_records')
        .select('*')
        .eq('module_name', moduleId)
        .order('created_at', { ascending: false })
      setRecords(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    if (activeModule) {
      fetchRecords(activeModule)
    }
  }, [activeModule])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if(!activeModule) return
    
    let uploadedFileUrl = null

    if (canAttachFile && file) {
      setLoading(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('homework_files')
        .upload(filePath, file)

      if (uploadError) {
        console.error("Upload error:", uploadError)
        alert(`Failed to upload file: ${uploadError.message || uploadError.name || JSON.stringify(uploadError)}`)
        setLoading(false)
        return
      }

      const { data } = supabase.storage
        .from('homework_files')
        .getPublicUrl(filePath)
      
      uploadedFileUrl = data.publicUrl
    }

    if (activeModule === 'notices') {
      await supabase.from('notices').insert([{ title: newTitle, content: newDesc, file_url: uploadedFileUrl, teacher_id: currentUser?.id }])
    } else {
      await supabase.from('module_records').insert([{ 
        module_name: activeModule, 
        title: newTitle, 
        description: newDesc,
        file_url: uploadedFileUrl,
        teacher_id: currentUser?.id
      }])
    }
    setNewTitle("")
    setNewDesc("")
    setFile(null)
    fetchRecords(activeModule)
  }

  const handleDelete = async (id: string) => {
    if(!activeModule) return
    if(confirm("Delete this record?")) {
      if (activeModule === 'notices') {
        await supabase.from('notices').delete().eq('id', id)
      } else {
        await supabase.from('module_records').delete().eq('id', id)
      }
      fetchRecords(activeModule)
    }
  }

  const handleBusSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const title = `${busStatus} - Bus ${busNumber} (${driverName})`;
    const desc = `Driver: ${driverName}\nPhone: ${phNo}\nStatus: ${busStatus}`;
    
    await supabase.from('module_records').insert([{ 
      module_name: 'bus', 
      title: title, 
      description: desc,
      teacher_id: currentUser?.id
    }])
    
    setLoading(false)
    setBusSuccess(true)
    fetchRecords('bus')
    
    // Reset form after a few seconds
    setTimeout(() => {
      setBusSuccess(false)
      setDriverName("")
      setBusNumber("")
      setPhNo("")
    }, 3000)
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !currentUser) return

    setUploadingAvatar(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `${currentUser.id}-${Math.random()}.${fileExt}`

    try {
      // Upload to 'avatars' bucket
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)
      
      const newAvatarUrl = urlData.publicUrl

      // Update teachers table
      const { error: updateError } = await supabase
        .from('teachers')
        .update({ avatar_url: newAvatarUrl })
        .eq('user_id', currentUser.id)

      if (updateError) throw updateError

      setTeacherAvatar(newAvatarUrl)
      alert("Profile picture updated successfully!")
    } catch (err: any) {
      console.error("Error uploading avatar:", err)
      alert(`Failed to upload avatar: ${err.message || 'Unknown error'}`)
    } finally {
      setUploadingAvatar(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f0f4f8] dark:bg-[#0f172a] relative overflow-hidden">
      <div className="absolute top-[20%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-teal-300/20 blur-[100px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto p-4 sm:p-6 relative z-10">
        <Navbar 
          title={teacherName ? `Welcome, ${teacherName}` : (currentUser ? `Welcome, ${currentUser.username}` : "Teacher Workspace")} 
          role="Sub-Admin" 
          avatarUrl={teacherAvatar}
        />
        
        <AnimatePresence mode="wait">
          {!activeModule ? (
            <motion.div 
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
            >
              {modules.map((mod) => (
                <motion.div
                  key={mod.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveModule(mod.id)}
                  className="glass p-6 rounded-3xl cursor-pointer flex flex-col items-center justify-center gap-4 text-center group hover:bg-white/40 dark:hover:bg-slate-800/40 transition-all border border-white/20 hover:border-teal-500/30"
                >
                  <div className="p-4 bg-[#13696a]/10 text-[#13696a] dark:text-teal-400 rounded-2xl group-hover:bg-[#13696a] group-hover:text-white transition-colors shadow-sm">
                    {mod.icon}
                  </div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">{mod.name}</h3>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="module-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass p-6 sm:p-8 rounded-3xl"
            >
              <div className="flex items-center gap-4 mb-8">
                <button 
                  onClick={() => setActiveModule(null)}
                  className="p-2 bg-white/50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <ArrowLeft className="text-slate-700 dark:text-slate-200" />
                </button>
                <div className="p-3 bg-[#13696a]/10 text-[#13696a] dark:text-teal-400 rounded-xl">
                  {activeModuleData?.icon}
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  Manage {activeModuleData?.name}
                </h2>
              </div>

              {activeModule === 'profile' ? (
                <div className="max-w-xl mx-auto bg-white/40 dark:bg-black/20 p-8 rounded-3xl border border-white/30 shadow-xl relative overflow-hidden text-center">
                  <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-300/10 blur-[80px] mix-blend-multiply pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="relative group w-32 h-32 mb-6">
                      {teacherAvatar ? (
                        <img 
                          src={teacherAvatar} 
                          alt="Profile" 
                          className="w-full h-full rounded-full object-cover border-4 border-white shadow-xl"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#002045] to-[#13696a] flex items-center justify-center shadow-xl border-4 border-white">
                          <span className="text-white font-bold text-5xl">
                            {teacherName?.charAt(0).toUpperCase() || currentUser?.username?.charAt(0).toUpperCase() || 'C'}
                          </span>
                        </div>
                      )}
                      
                      {uploadingAvatar && (
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                          <Clock className="animate-spin text-white w-8 h-8" />
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                      {teacherName || currentUser?.username}
                    </h3>
                    <p className="text-slate-500 mb-8">Sub-Admin (Teacher)</p>

                    <label className="relative overflow-hidden cursor-pointer w-full max-w-xs">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        disabled={uploadingAvatar}
                        className="hidden"
                      />
                      <div className={`w-full py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${uploadingAvatar ? 'bg-slate-200 text-slate-500' : 'bg-[#13696a] hover:bg-[#13696a]/90 text-white shadow-lg shadow-teal-500/20'}`}>
                        <Plus size={18} /> {uploadingAvatar ? 'Uploading...' : 'Upload New Photo'}
                      </div>
                    </label>
                    <p className="text-xs text-slate-400 mt-4">
                      Supported formats: JPG, PNG, WebP (Max 2MB)
                    </p>
                  </div>
                </div>
              ) : activeModule === 'bus' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column: Form */}
                  <div className="bg-white/40 dark:bg-black/20 p-8 rounded-3xl border border-white/30 shadow-xl relative overflow-hidden h-fit">
                    <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-amber-300/10 blur-[80px] mix-blend-multiply pointer-events-none" />
                    
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                      <Plus size={18} /> New Transport Log
                    </h3>
                  <AnimatePresence mode="wait">
                    {busSuccess ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex flex-col items-center justify-center py-12 text-center"
                      >
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                          <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Log Recorded!</h3>
                        <p className="text-slate-500">The bus movement has been successfully recorded.</p>
                      </motion.div>
                    ) : (
                      <motion.form
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={handleBusSubmit} 
                        className="space-y-5 relative z-10"
                      >
                        {/* Status Toggle */}
                        <div className="flex bg-white/50 dark:bg-black/30 p-1 rounded-xl">
                          <button
                            type="button"
                            onClick={() => setBusStatus("Leaving")}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                              busStatus === "Leaving" 
                                ? "bg-white dark:bg-slate-800 shadow-sm text-amber-600" 
                                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                            }`}
                          >
                            <Navigation size={16} /> Leaving School
                          </button>
                          <button
                            type="button"
                            onClick={() => setBusStatus("Arriving")}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                              busStatus === "Arriving" 
                                ? "bg-white dark:bg-slate-800 shadow-sm text-emerald-600" 
                                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                            }`}
                          >
                            <Navigation size={16} className="rotate-180" /> Arriving
                          </button>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Driver Name</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <User className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                              type="text"
                              value={driverName}
                              onChange={(e) => setDriverName(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 bg-white/60 dark:bg-black/20 border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all backdrop-blur-sm"
                              placeholder="Enter driver's name"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Phone Number (ph.no)</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-slate-400 font-bold text-lg leading-none pt-1">#</span>
                            </div>
                            <input
                              type="tel"
                              value={phNo}
                              onChange={(e) => setPhNo(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 bg-white/60 dark:bg-black/20 border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all backdrop-blur-sm"
                              placeholder="Enter driver's phone number"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Bus Number / Route</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Bus className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                              type="text"
                              value={busNumber}
                              onChange={(e) => setBusNumber(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 bg-white/60 dark:bg-black/20 border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all backdrop-blur-sm"
                              placeholder="e.g. Bus 42 - North Route"
                              required
                            />
                          </div>
                        </div>

                        <div className="pt-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={loading}
                            className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-white font-semibold shadow-xl shadow-teal-500/20 transition-all bg-[#13696a] hover:bg-[#13696a]/90 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                          >
                            {loading ? (
                              <span className="flex items-center gap-2">
                                <Clock className="animate-spin" size={18} /> Recording...
                              </span>
                            ) : (
                              <span className="flex items-center gap-2">
                                Submit Log
                              </span>
                            )}
                          </motion.button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Right Column: Recent Logs */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <List size={18} /> Recent Bus Logs
                  </h3>
                  {loading ? (
                    <div className="text-center text-slate-500 py-8">Loading logs...</div>
                  ) : records.length === 0 ? (
                    <div className="text-center text-slate-500 py-12 bg-white/30 dark:bg-black/10 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                      No transport logs recorded yet.
                    </div>
                  ) : (
                    records.map(r => (
                      <div key={r.id} className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-2xl border border-white/30 shadow-sm flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {r.title.includes('Leaving') ? (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded">LEAVING</span>
                            ) : (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">ARRIVING</span>
                            )}
                            <h4 className="font-semibold text-slate-800 dark:text-slate-100">{r.title.replace(/Leaving - |Arriving - /, '')}</h4>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 mt-2 whitespace-pre-wrap text-sm">
                            {r.description}
                          </p>
                          <span className="text-xs text-slate-400 mt-2 block">
                            {new Date(r.created_at).toLocaleString()}
                          </span>
                        </div>
                        <button 
                          onClick={() => handleDelete(r.id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors ml-4 shrink-0"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
              ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Form */}
                <div className="bg-white/40 dark:bg-black/20 p-6 rounded-2xl border border-white/20 h-fit">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <Plus size={18} /> Add New Entry
                  </h3>
                  <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                      <input 
                        type="text" required value={newTitle} onChange={e => setNewTitle(e.target.value)}
                        className="w-full px-4 py-2 bg-white/50 dark:bg-black/20 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                        placeholder="Title or Heading"
                      />
                    </div>
                    <div>
                      <textarea 
                        required value={newDesc} onChange={e => setNewDesc(e.target.value)}
                        className="w-full px-4 py-2 bg-white/50 dark:bg-black/20 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 min-h-[100px]"
                        placeholder="Details, content, or description..."
                      />
                    </div>
                    {canAttachFile && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Attach File (Optional)
                        </label>
                        <input 
                          type="file" 
                          onChange={(e) => setFile(e.target.files?.[0] || null)}
                          className="w-full px-3 py-2 text-sm text-slate-600 dark:text-slate-300 bg-white/50 dark:bg-black/20 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50
                                     file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 
                                     file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 
                                     dark:file:bg-teal-900/30 dark:file:text-teal-400
                                     hover:file:bg-teal-100 dark:hover:file:bg-teal-900/50"
                        />
                      </div>
                    )}
                    <button className="w-full py-2 bg-[#13696a] hover:bg-[#13696a]/90 text-white rounded-xl font-medium transition-colors">
                      Save Entry
                    </button>
                  </form>
                </div>

                {/* List */}
                <div className="lg:col-span-2 space-y-4">
                  {loading ? (
                    <div className="text-center text-slate-500 py-8">Loading data...</div>
                  ) : records.length === 0 ? (
                    <div className="text-center text-slate-500 py-12 bg-white/30 dark:bg-black/10 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                      No entries found for {activeModuleData?.name}.
                    </div>
                  ) : (
                    records.map(r => (
                      <div key={r.id} className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-2xl border border-white/30 shadow-sm flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-slate-800 dark:text-slate-100">{r.title}</h4>
                          <p className="text-slate-600 dark:text-slate-400 mt-1 whitespace-pre-wrap">
                            {r.description || r.content}
                          </p>
                          <span className="text-xs text-slate-400 mt-2 block">
                            {new Date(r.created_at).toLocaleString()}
                          </span>
                          {r.file_url && (
                            <a 
                              href={r.file_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 mt-3 text-sm text-teal-600 dark:text-teal-400 hover:underline font-medium"
                            >
                              <Download size={14} /> View Attached File
                            </a>
                          )}
                        </div>
                        <button 
                          onClick={() => handleDelete(r.id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors ml-4 shrink-0"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
