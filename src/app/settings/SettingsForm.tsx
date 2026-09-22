'use client';

import { useState } from "react";
import { Building2, GraduationCap, FileText, Monitor, ShieldCheck, Settings as SettingsIcon, UploadCloud, Save, Building } from "lucide-react";
import { updateSettings } from "../actions/settings";

export default function SettingsForm({ initialData }: { initialData: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await updateSettings(formData);
      if (res.success) {
        alert("Settings saved successfully!");
      } else {
        alert("Failed to save settings: " + res.error);
      }
    } catch (e) {
      alert("An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-[#e8f0fe] to-[#d2e3fc] dark:from-blue-900/40 dark:to-blue-800/40 rounded-2xl p-8 overflow-hidden shadow-sm border border-blue-50/50 dark:border-blue-800/30 transition-colors duration-300">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <SettingsIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xl font-medium text-slate-700 dark:text-slate-200">System Preferences</h3>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a73e8] dark:text-blue-400 mb-4">Settings & Configuration</h2>
          <p className="text-slate-600 dark:text-slate-300 font-medium">Manage your school profile, academic years, and system preferences.</p>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute right-10 bottom-0 top-0 hidden md:flex items-center justify-center pointer-events-none opacity-90">
          <div className="relative w-64 h-64">
            <div className="absolute inset-0 bg-blue-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <SettingsIcon className="w-32 h-32 text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl z-20 animate-[spin_10s_linear_infinite]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Main Settings) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* General Institute Profile */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 transition-colors duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Institute Profile</h3>
              </div>
              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">School Name</label>
                <input name="schoolName" value={formData.schoolName} onChange={handleChange} type="text" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">UDISE Code</label>
                <input name="udiseCode" value={formData.udiseCode} onChange={handleChange} type="text" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Board Affiliation No.</label>
                <input name="boardAffiliation" value={formData.boardAffiliation} onChange={handleChange} type="text" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Medium of Instruction</label>
                <select name="mediumOfInstruction" value={formData.mediumOfInstruction} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                  <option value="English">English</option>
                  <option value="Marathi">Marathi</option>
                  <option value="Semi-English">Semi-English</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">School Address</label>
                <textarea name="address" value={formData.address} onChange={handleChange} rows={2} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"></textarea>
              </div>
            </div>
          </div>

          {/* Academic Settings */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/30 text-green-500 flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Academic Settings</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Current Academic Year</label>
                <select name="academicYear" value={formData.academicYear} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500/50">
                  <option value="2023-2024">2023-2024</option>
                  <option value="2024-2025">2024-2025</option>
                  <option value="2025-2026">2025-2026</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Grading System</label>
                <select name="gradingSystem" value={formData.gradingSystem} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500/50">
                  <option value="CBSE 9-Point Scale">CBSE 9-Point Scale</option>
                  <option value="State Board (Percentage)">State Board (Percentage)</option>
                  <option value="CGPA (10-Point)">CGPA (10-Point)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Media & Signatures */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-500 flex items-center justify-center shrink-0">
                <Building className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Logos & Signatures</h3>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center shrink-0 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors">
                  <UploadCloud className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">School Logo</h4>
                  <p className="text-xs text-slate-500 mt-1">Coming soon (R2 Integration)</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center shrink-0 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors">
                  <UploadCloud className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">Principal's Signature</h4>
                  <p className="text-xs text-slate-500 mt-1">Coming soon (R2 Integration)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Certificate Settings */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/30 text-orange-500 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Document Formats</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">LC / TC Starting Serial No.</label>
                <input name="lcStartingSerialNo" value={formData.lcStartingSerialNo} onChange={handleChange} type="number" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Bonafide Prefix</label>
                <input name="bonafidePrefix" value={formData.bonafidePrefix} onChange={handleChange} type="text" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50" />
              </div>
            </div>
          </div>

          {/* System Preferences */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-900/30 text-rose-500 flex items-center justify-center shrink-0">
                <Monitor className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">System Defaults</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">Timezone</h4>
                  <p className="text-xs text-slate-500">Asia/Kolkata (IST)</p>
                </div>
                <ShieldCheck className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">Date Format</h4>
                  <p className="text-xs text-slate-500">DD/MM/YYYY</p>
                </div>
                <ShieldCheck className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
