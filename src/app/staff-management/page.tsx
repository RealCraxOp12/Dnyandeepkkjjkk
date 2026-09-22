import { getStaffList } from "@/app/actions/staff";
import { prisma } from "@/lib/prisma";
import StaffClient from "./StaffClient";
import { Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StaffManagementPage() {
  const staffList = await getStaffList();
  const subjects = await prisma.subject.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="flex-1 overflow-auto p-8 bg-slate-50 dark:bg-slate-950">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-500" />
            Staff Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage staff roles and subject assignments</p>
        </div>
      </div>

      <StaffClient staffList={staffList} subjects={subjects} />
    </div>
  );
}
