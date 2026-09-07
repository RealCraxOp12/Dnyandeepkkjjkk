"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createExam(data: { name: string; academicYear: string; targetClass?: string }) {
  if (!data.targetClass) {
    return { success: false, error: "Target class is required" };
  }

  try {
    const exam = await prisma.exam.create({
      data: {
        name: data.name,
        academicYear: data.academicYear,
        targetClass: data.targetClass,
        status: "ACTIVE",
      },
    });
    revalidatePath("/results");
    return { success: true, exam };
  } catch (error) {
    console.error("Error creating exam:", error);
    return { success: false, error: "Failed to create exam" };
  }
}

export async function getExams() {
  return await prisma.exam.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteExam(examId: string) {
  try {
    await prisma.exam.delete({
      where: { id: examId },
    });
    revalidatePath("/results");
    return { success: true };
  } catch (error) {
    console.error("Error deleting exam:", error);
    return { success: false, error: "Failed to delete exam" };
  }
}

export async function seedDefaultSubjects() {
  const defaultSubjects = [
    { name: "English", code: "ENG", type: "SCHOLASTIC" },
    { name: "Hindi", code: "HIN", type: "SCHOLASTIC" },
    { name: "Mathematics", code: "MATH", type: "SCHOLASTIC" },
    { name: "Science", code: "SCI", type: "SCHOLASTIC" },
    { name: "Social Science", code: "SST", type: "SCHOLASTIC" },
  ];

  try {
    const count = await prisma.subject.count();
    if (count === 0) {
      await prisma.subject.createMany({
        data: defaultSubjects,
      });
      return { success: true, message: "Default subjects added" };
    }
    return { success: true, message: "Subjects already exist" };
  } catch (error) {
    console.error("Error seeding subjects:", error);
    return { success: false, error: "Failed to seed subjects" };
  }
}

export async function getSubjects() {
  return await prisma.subject.findMany({
    orderBy: { name: "asc" },
  });
}

export async function saveMarks(data: {
  examId: string;
  subjectId: string;
  marksData: { studentId: string; marksObtained: number | null; totalMarks: number; grade: string }[];
}) {
  try {
    const validMarks = data.marksData.filter((m) => m.marksObtained !== null || m.grade !== "");

    // Use a single round-trip transaction with upserts for maximum speed
    await prisma.$transaction(
      validMarks.map((m) => 
        prisma.marksRecord.upsert({
          where: {
            studentId_examId_subjectId_type: {
              studentId: m.studentId,
              examId: data.examId,
              subjectId: data.subjectId,
              type: "THEORY",
            }
          },
          update: {
            marksObtained: m.marksObtained !== null ? Math.min(m.marksObtained, 100) : null,
            grade: m.grade || null,
          },
          create: {
            studentId: m.studentId,
            examId: data.examId,
            subjectId: data.subjectId,
            type: "THEORY",
            marksObtained: m.marksObtained !== null ? Math.min(m.marksObtained, 100) : null,
            totalMarks: m.totalMarks || 100,
            grade: m.grade || null,
          }
        })
      )
    );

    revalidatePath(`/results/${data.examId}/enter-marks`);
    return { success: true };
  } catch (error) {
    console.error("Error saving marks:", error);
    return { success: false, error: "Failed to save marks" };
  }
}

export async function getMarksForExamAndSubject(examId: string, subjectId: string) {
  return await prisma.marksRecord.findMany({
    where: { examId, subjectId },
  });
}

export async function getStudentMarksheet(studentId: string, examId: string) {
  return await prisma.marksRecord.findMany({
    where: { studentId, examId },
    include: { subject: true },
  });
}
