"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getStudentsForAttendance(currentClass: string, division?: string) {
  try {
    const students = await prisma.student.findMany({
      where: {
        currentClass,
        ...(division ? { division } : {}),
        activeStatus: true,
      },
      select: {
        id: true,
        registerNo: true,
        firstName: true,
        surname: true,
      },
      orderBy: [
        { firstName: "asc" },
        { surname: "asc" },
      ],
    });
    return students;
  } catch (error) {
    console.error("Error fetching students for attendance:", error);
    return [];
  }
}

export async function getAttendanceForDate(currentClass: string, division: string | undefined, date: Date) {
  try {
    const dateQuery = new Date(date);
    dateQuery.setUTCHours(0, 0, 0, 0);

    const records = await prisma.attendance.findMany({
      where: {
        student: {
          currentClass,
          ...(division ? { division } : {}),
          activeStatus: true,
        },
        date: dateQuery,
      },
    });
    
    return records;
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    return [];
  }
}

export async function saveAttendance(date: Date, records: { studentId: string; status: string }[]) {
  try {
    const dateQuery = new Date(date);
    dateQuery.setUTCHours(0, 0, 0, 0);

    // Upsert attendance records
    await prisma.$transaction(
      records.map((record) =>
        prisma.attendance.upsert({
          where: {
            studentId_date: {
              studentId: record.studentId,
              date: dateQuery,
            },
          },
          update: {
            status: record.status,
          },
          create: {
            studentId: record.studentId,
            date: dateQuery,
            status: record.status,
          },
        })
      )
    );

    revalidatePath("/attendance");
    return { success: true };
  } catch (error) {
    console.error("Error saving attendance:", error);
    return { success: false, error: "Failed to save attendance" };
  }
}
