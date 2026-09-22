"use client";

import { useState } from "react";
import { updateStaffAssignment, createStaff, deleteStaff } from "@/app/actions/staff";
import { Save, User, Loader2, Plus, X, Trash2, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StaffClient({ staffList, subjects }: { staffList: any[], subjects: any[] }) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [localStaff, setLocalStaff] = useState(staffList);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleUpdate = async (staffId: string, assignedSubject: string) => {
    setUpdatingId(staffId);
    
    // Optimistic update
    setLocalStaff(prev => prev.map(s => s.id === staffId ? { ...s, assignedSubject: assignedSubject || null } : s));
    
    await updateStaffAssignment(staffId, assignedSubject || null);
    
    setUpdatingId(null);
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get("firstName"),
      surname: formData.get("surname"),
      employeeId: formData.get("employeeId"),
      password: formData.get("password"),
      assignedSubject: formData.get("assignedSubject"),
    };

    const result = await createStaff(data);
    if (result.success) {
      setIsCreating(false);
      router.refresh();
      // Also update local list so it feels instant
      setLocalStaff(prev => [...prev, { ...data, id: "temp", role: "TEACHER" }]);
    } else {
      setErrorMsg(result.error || "Failed to create staff");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20"
        >
          <Plus className="w-5 h-5" /> Add Staff Member
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Assigned Subject (Locked)</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {localStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{staff.firstName} {staff.surname}</p>
                        <p className="text-xs text-slate-500">ID: {staff.employeeId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">
                    {staff.role}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={staff.assignedSubject || ""}
                      onChange={(e) => handleUpdate(staff.id, e.target.value)}
                      disabled={updatingId === staff.id || staff.id === "temp"}
                      className="w-full max-w-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 font-medium text-slate-800 dark:text-slate-200"
                    >
                      <option value="">-- No Subject (General Access) --</option>
                      {subjects.map(sub => (
                        <option key={sub.id} value={sub.name}>{sub.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 flex items-center gap-4">
                    {updatingId === staff.id ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-blue-500">
                        <Loader2 className="w-3 h-3 animate-spin" /> Saving...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-500">
                        <Save className="w-3 h-3" /> Saved
                      </span>
                    )}
                    <button
                      onClick={async () => {
                        if (confirm("Are you sure you want to remove this staff member?")) {
                          const result = await deleteStaff(staff.id);
                          if (result.success) {
                            setLocalStaff(prev => prev.filter(s => s.id !== staff.id));
                            router.refresh();
                          } else {
                            alert("Failed to delete staff member.");
                          }
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      title="Remove Staff"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {localStaff.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500 font-medium">
                    No staff members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Staff Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Add New Staff Member</h3>
              <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-semibold">
                  {errorMsg}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">First Name</label>
                  <input type="text" name="firstName" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Surname</label>
                  <input type="text" name="surname" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Employee ID</label>
                <input type="text" name="employeeId" required placeholder="e.g. EMP1029" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white font-mono" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} name="password" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Assigned Subject (Optional)</label>
                <select name="assignedSubject" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white font-medium">
                  <option value="">-- General Teacher (No Subject Lock) --</option>
                  {subjects.map(sub => (
                    <option key={sub.id} value={sub.name}>{sub.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsCreating(false)} className="px-5 py-2.5 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center gap-2 shadow-md shadow-blue-500/20">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Create Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
