import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const examId = searchParams.get("examId");
  const studentId = searchParams.get("studentId");

  if (!examId || !studentId) {
    return NextResponse.json({ error: "Missing examId or studentId" }, { status: 400 });
  }

  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });

    const exam = await prisma.exam.findUnique({
      where: { id: examId }
    });

    const marks = await prisma.marksRecord.findMany({
      where: { examId, studentId },
      include: { subject: true }
    });

    return NextResponse.json({ student, exam, marks });
  } catch (error) {
    console.error("Error fetching marksheet data", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
