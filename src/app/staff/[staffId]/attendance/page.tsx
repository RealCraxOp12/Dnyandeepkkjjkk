import AttendanceDashboardClient from "@/app/attendance/AttendanceDashboardClient";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function StaffAttendancePage() {
  // Fetch actual distinct classes from the database
  const students = await prisma.student.findMany({
    where: { activeStatus: true },
    select: { currentClass: true },
    distinct: ['currentClass'],
  });

  const classes = students
    .map(s => s.currentClass)
    .filter(Boolean) as string[];

  // Sort classes properly (e.g. 1st, 2nd, 10th)
  classes.sort((a, b) => {
    const numA = parseInt(a) || 0;
    const numB = parseInt(b) || 0;
    
    if (numA !== numB) {
      return numA - numB;
    }
    return a.localeCompare(b);
  });

  return <AttendanceDashboardClient classes={classes} />;
}
