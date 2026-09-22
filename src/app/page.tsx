import { Search, Bell, BookOpen, FileText, GraduationCap, ClipboardCheck, Trophy, CalendarCheck, Megaphone, User, Award } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Dashboard() {
  const totalStudents = await prisma.student.count();
  const recentAdmissions = await prisma.student.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-transparent">
      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-auto p-8 pt-4">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Hero Banner */}
          <div className="relative bg-gradient-to-r from-[#e8f0fe] to-[#d2e3fc] dark:from-blue-900/40 dark:to-blue-800/40 rounded-2xl p-8 overflow-hidden shadow-sm border border-blue-50/50 dark:border-blue-800/30 transition-colors duration-300">
            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">👋</span>
                <h3 className="text-xl font-medium text-slate-700 dark:text-slate-200">Good Morning,</h3>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a73e8] dark:text-blue-400 mb-4">Admin User!</h2>
              <p className="text-slate-600 dark:text-slate-300 font-medium">Stay updated with your school management journey.</p>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute right-10 bottom-0 top-0 hidden md:flex items-center justify-center pointer-events-none opacity-90">
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 bg-blue-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <BookOpen className="w-32 h-32 text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl z-20" />
                <GraduationCap className="w-16 h-16 text-indigo-400 absolute top-10 right-10 rotate-12 drop-shadow-xl z-10" />
                <FileText className="w-12 h-12 text-blue-400 absolute bottom-12 left-10 -rotate-12 drop-shadow-xl z-10" />
              </div>
            </div>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col transition-colors duration-300">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Students</h4>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">{totalStudents}</p>
                </div>
              </div>
              <div className="text-xs font-semibold text-blue-500 mt-auto">Current Database</div>
            </div>
            
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col transition-colors duration-300">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-500 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active Classes</h4>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">10</p>
                </div>
              </div>
              <div className="text-xs font-semibold text-green-500 mt-auto">1st to 10th Standard</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col transition-colors duration-300">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-500 flex items-center justify-center shrink-0">
                  <ClipboardCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-wider">Admissions</h4>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">{recentAdmissions.length}</p>
                </div>
              </div>
              <div className="text-xs font-semibold text-purple-500 mt-auto">This Academic Year</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col transition-colors duration-300">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/30 text-orange-500 flex items-center justify-center shrink-0">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active Staff</h4>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">24</p>
                </div>
              </div>
              <div className="text-xs font-semibold text-orange-500 mt-auto">Teaching & Non-Teaching</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col transition-colors duration-300">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-900/30 text-rose-500 flex items-center justify-center shrink-0">
                  <CalendarCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-wider">Attendance</h4>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">92%</p>
                </div>
              </div>
              <div className="text-xs font-semibold text-rose-500 mt-auto">Today's Average</div>
            </div>
          </div>

          {/* Middle Row: Recent Results & Notice Board */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 flex flex-col transition-colors duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Recent Admissions</h3>
                <Link href="/students" className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All Directory</Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase border-b border-slate-100">
                    <tr>
                      <th className="pb-3 font-semibold">Student Name</th>
                      <th className="pb-3 font-semibold">Reg No</th>
                      <th className="pb-3 font-semibold">Class</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentAdmissions.length === 0 ? (
                      <tr><td colSpan={5} className="py-8 text-center text-slate-400 dark:text-slate-500">No admissions yet.</td></tr>
                    ) : (
                      recentAdmissions.map((student) => (
                        <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="py-3 font-bold text-slate-700 dark:text-slate-200">{student.firstName} {student.surname}</td>
                          <td className="py-3 text-slate-500 dark:text-slate-400 dark:text-slate-500">{student.registerNo || "-"}</td>
                          <td className="py-3">
                            <span className="px-2.5 py-1 bg-green-50 dark:bg-green-900/30 text-green-600 font-bold rounded-full text-xs">
                              {student.admissionClass || student.currentClass || "-"}
                            </span>
                          </td>
                          <td className="py-3 text-slate-600 dark:text-slate-300 font-medium">Active</td>
                          <td className="py-3 text-slate-500 dark:text-slate-400 dark:text-slate-500">{student.createdAt.toLocaleDateString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 transition-colors duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Notice Board</h3>
                <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All Notices</button>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center shrink-0">
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm">End Semester Exam Schedule</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">The end semester exams will begin from 25th May 2024.</p>
                    <p className="text-xs font-bold text-blue-600 mt-1">15 May 2024</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center shrink-0">
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm">Result Declaration Notice</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">Results for Mid Semester Exams has been declared.</p>
                    <p className="text-xs font-bold text-blue-600 mt-1">12 May 2024</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center shrink-0">
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm">Project Submission Deadline</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">Final year project submission is due on 30th May 2024.</p>
                    <p className="text-xs font-bold text-blue-600 mt-1">10 May 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Calendar, Quick Access, Performance Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">
            
            {/* Academic Calendar */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 transition-colors duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Academic Calendar</h3>
                <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">View Calendar</button>
              </div>
              <div className="text-center font-bold text-slate-800 dark:text-white mb-4">May 2024</div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                <div className="font-bold text-slate-400 dark:text-slate-500">Mon</div>
                <div className="font-bold text-slate-400 dark:text-slate-500">Tue</div>
                <div className="font-bold text-slate-400 dark:text-slate-500">Wed</div>
                <div className="font-bold text-slate-400 dark:text-slate-500">Thu</div>
                <div className="font-bold text-slate-400 dark:text-slate-500">Fri</div>
                <div className="font-bold text-slate-400 dark:text-slate-500">Sat</div>
                <div className="font-bold text-red-400">Sun</div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium">
                {/* Dummy calendar dates to match UI */}
                <div className="py-1.5 text-slate-300">29</div>
                <div className="py-1.5 text-slate-300">30</div>
                <div className="py-1.5 text-slate-700 dark:text-slate-200">1</div>
                <div className="py-1.5 text-slate-700 dark:text-slate-200">2</div>
                <div className="py-1.5 text-slate-700 dark:text-slate-200">3</div>
                <div className="py-1.5 text-slate-700 dark:text-slate-200">4</div>
                <div className="py-1.5 text-red-500">5</div>
                
                <div className="py-1.5 text-slate-700 dark:text-slate-200">6</div>
                <div className="py-1.5 text-slate-700 dark:text-slate-200">7</div>
                <div className="py-1.5 text-slate-700 dark:text-slate-200">8</div>
                <div className="py-1.5 text-slate-700 dark:text-slate-200">9</div>
                <div className="py-1.5 text-slate-700 dark:text-slate-200">10</div>
                <div className="py-1.5 text-slate-700 dark:text-slate-200">11</div>
                <div className="py-1.5 text-red-500">12</div>
                
                <div className="py-1.5 bg-blue-600 text-white rounded-md shadow-md shadow-blue-500/30">13</div>
                <div className="py-1.5 text-slate-700 dark:text-slate-200">14</div>
                <div className="py-1.5 text-slate-700 dark:text-slate-200">15</div>
                <div className="py-1.5 text-slate-700 dark:text-slate-200">16</div>
                <div className="py-1.5 text-slate-700 dark:text-slate-200">17</div>
                <div className="py-1.5 text-slate-700 dark:text-slate-200">18</div>
                <div className="py-1.5 text-red-500">19</div>
                
                <div className="py-1.5 text-slate-700 dark:text-slate-200">20</div>
                <div className="py-1.5 text-slate-700 dark:text-slate-200">21</div>
                <div className="py-1.5 text-slate-700 dark:text-slate-200">22</div>
                <div className="py-1.5 text-slate-700 dark:text-slate-200">23</div>
                <div className="py-1.5 text-slate-700 dark:text-slate-200">24</div>
                <div className="py-1.5 text-slate-700 dark:text-slate-200">25</div>
                <div className="py-1.5 text-red-500">26</div>
                
                <div className="py-1.5 text-slate-700 dark:text-slate-200">27</div>
                <div className="py-1.5 text-slate-700 dark:text-slate-200">28</div>
                <div className="py-1.5 text-slate-700 dark:text-slate-200">29</div>
                <div className="py-1.5 text-slate-700 dark:text-slate-200">30</div>
                <div className="py-1.5 text-slate-700 dark:text-slate-200">31</div>
                <div className="py-1.5 text-slate-300">1</div>
                <div className="py-1.5 text-slate-300">2</div>
              </div>
            </div>

            {/* Quick Access */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 transition-colors duration-300">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Quick Access</h3>
              <div className="grid grid-cols-3 gap-4">
                <Link href="/admissions" prefetch={true} className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-500"><User className="w-6 h-6" /></div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Admissions</span>
                </Link>
                <Link href="/staff-management" prefetch={true} className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-12 h-12 bg-teal-50 dark:bg-teal-900/30 rounded-xl flex items-center justify-center text-teal-500"><User className="w-6 h-6" /></div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Staff</span>
                </Link>
                <Link href="/students" prefetch={true} className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-500"><BookOpen className="w-6 h-6" /></div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Students</span>
                </Link>
                <Link href="/attendance" prefetch={true} className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-500"><CalendarCheck className="w-6 h-6" /></div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Attendance</span>
                </Link>
                <Link href="/results" prefetch={true} className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-500"><Trophy className="w-6 h-6" /></div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Results</span>
                </Link>
                <Link href="/certificates" prefetch={true} className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-500"><Award className="w-6 h-6" /></div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Certificates</span>
                </Link>
                <Link href="/reports" prefetch={true} className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/30 rounded-xl flex items-center justify-center text-rose-500"><FileText className="w-6 h-6" /></div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Reports</span>
                </Link>
              </div>
            </div>

            {/* Performance Overview (Student Stats Chart) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 transition-colors duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">System Overview</h3>
                <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">View Details</button>
              </div>
              
              <div className="flex items-center justify-between h-40">
                {/* Pure CSS Donut Chart representation */}
                <div className="relative w-32 h-32 shrink-0">
                  <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    <path
                      className="text-green-500"
                      strokeDasharray="60, 100"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none" stroke="currentColor" strokeWidth="4"
                    />
                    <path
                      className="text-blue-500"
                      strokeDasharray="20, 100"
                      strokeDashoffset="-60"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none" stroke="currentColor" strokeWidth="4"
                    />
                    <path
                      className="text-orange-400"
                      strokeDasharray="12, 100"
                      strokeDashoffset="-80"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none" stroke="currentColor" strokeWidth="4"
                    />
                    <path
                      className="text-red-500"
                      strokeDasharray="8, 100"
                      strokeDashoffset="-92"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none" stroke="currentColor" strokeWidth="4"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-slate-800 dark:text-white">100%</span>
                    <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 dark:text-slate-500 text-center leading-tight">Total<br/>Capacity</span>
                  </div>
                </div>

                <div className="flex-1 pl-6 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-50 dark:bg-green-900/300"></div>
                      <span className="font-semibold text-slate-600 dark:text-slate-300">Active</span>
                    </div>
                    <span className="font-bold text-slate-800 dark:text-white">60%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-50 dark:bg-blue-900/300"></div>
                      <span className="font-semibold text-slate-600 dark:text-slate-300">Pending</span>
                    </div>
                    <span className="font-bold text-slate-800 dark:text-white">20%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                      <span className="font-semibold text-slate-600 dark:text-slate-300">Inactive</span>
                    </div>
                    <span className="font-bold text-slate-800 dark:text-white">12%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span className="font-semibold text-slate-600 dark:text-slate-300">Alumni</span>
                    </div>
                    <span className="font-bold text-slate-800 dark:text-white">8%</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
          
        </div>
      </div>
    </div>
  );
}
