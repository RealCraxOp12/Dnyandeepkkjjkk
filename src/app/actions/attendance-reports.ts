"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getMonthlyAttendanceData(year: number, month: number, currentClass?: string) {
  try {
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0)); // last day of month

    const students = await prisma.student.findMany({
      where: {
        activeStatus: true,
        ...(currentClass ? { currentClass } : {}),
      },
      select: {
        id: true,
        registerNo: true,
        firstName: true,
        surname: true,
        currentClass: true,
        division: true,
        attendance: {
          where: {
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
      },
      orderBy: [
        { currentClass: "asc" },
        { firstName: "asc" },
      ],
    });

    return students;
  } catch (error) {
    console.error("Error fetching monthly attendance data:", error);
    return [];
  }
}

export async function getYearlyAttendanceData(year: number, currentClass?: string) {
  try {
    // Assuming academic year starts in June (common in India). But let's just do standard year for simplicity, or 
    // better yet, just Jan 1 to Dec 31 of given year.
    const startDate = new Date(Date.UTC(year, 0, 1));
    const endDate = new Date(Date.UTC(year, 11, 31));

    const students = await prisma.student.findMany({
      where: {
        activeStatus: true,
        ...(currentClass ? { currentClass } : {}),
      },
      select: {
        id: true,
        registerNo: true,
        firstName: true,
        surname: true,
        currentClass: true,
        attendance: {
          where: {
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
      },
      orderBy: [
        { currentClass: "asc" },
        { firstName: "asc" },
      ],
    });

    return students;
  } catch (error) {
    console.error("Error fetching yearly attendance data:", error);
    return [];
  }
}

export async function bulkUploadMonthlyAttendance(year: number, month: number, records: { studentId: string, day: number, status: string }[]) {
  try {
    // Convert to Date objects
    const attendanceData = records.map(r => {
      const date = new Date(Date.UTC(year, month - 1, r.day));
      return {
        studentId: r.studentId,
        date: date,
        status: r.status
      };
    });

    // We use a transaction of upserts. For a whole class (e.g. 50 students * 25 days = 1250 records), 
    // this can be a bit heavy but $transaction handles it well enough.
    
    await prisma.$transaction(
      attendanceData.map((record) =>
        prisma.attendance.upsert({
          where: {
            studentId_date: {
              studentId: record.studentId,
              date: record.date,
            },
          },
          update: {
            status: record.status,
          },
          create: {
            studentId: record.studentId,
            date: record.date,
            status: record.status,
          },
        })
      )
    );

    revalidatePath("/attendance");
    return { success: true, count: attendanceData.length };
  } catch (error) {
    console.error("Error bulk uploading attendance:", error);
    return { success: false, error: "Failed to upload bulk attendance" };
  }
}
