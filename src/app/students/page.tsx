import { prisma } from "@/lib/prisma";
import { Search } from "lucide-react";
import { StudentActions } from "@/components/students/StudentActions";
import { GlobalActions } from "@/components/students/GlobalActions";
import { ClassFilter } from "@/components/students/ClassFilter";
import { StudentSearch } from "@/components/students/StudentSearch";

export default async function StudentsPage({ searchParams }: { searchParams: Promise<{ class?: string, search?: string }> }) {
  const params = await searchParams;
  const classFilter = params?.class;
  const searchFilter = params?.search;

  const students = await prisma.student.findMany({
    where: {
      AND: [
        classFilter ? {
          OR: [
            { admissionClass: classFilter },
            { currentClass: classFilter }
          ]
        } : {},
        searchFilter ? {
          OR: [
            { firstName: { contains: searchFilter, mode: 'insensitive' } },
            { surname: { contains: searchFilter, mode: 'insensitive' } },
            { registerNo: { contains: searchFilter, mode: 'insensitive' } },
            { adharNo: { contains: searchFilter, mode: 'insensitive' } }
          ]
        } : {}
      ]
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="flex-1 overflow-auto p-8 bg-transparent">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center justify-end w-full gap-3">
          <GlobalActions />
          <StudentSearch />
          <ClassFilter />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-400 font-bold uppercase text-xs border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
              <tr>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Register No</th>
                <th className="px-6 py-4">Current Class</th>
                <th className="px-6 py-4">Gender</th>
                <th className="px-6 py-4">Mobile</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    No students found in the database.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-700 dark:text-slate-200">{student.firstName} {student.surname}</div>
                      <div className="text-xs text-slate-400 dark:text-slate-500">{student.adharNo || "No Adhar"}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-medium">{student.registerNo || "-"}</td>
                    <td className="px-6 py-4">
                       <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold rounded-full text-xs transition-colors">
                         {student.currentClass || "-"}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-medium">{student.gender || "-"}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-medium">{student.mobileNo || "-"}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full transition-colors">Active</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <StudentActions id={student.id} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
