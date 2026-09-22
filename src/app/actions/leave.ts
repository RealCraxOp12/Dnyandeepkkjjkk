'use server';

import { prisma } from "@/lib/prisma";
import { getParentSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function submitLeaveRequest(formData: FormData) {
  const sessionStudentId = await getParentSession();
  
  if (!sessionStudentId) {
    return { error: "Unauthorized" };
  }

  const studentId = formData.get("studentId") as string;
  const startDateStr = formData.get("startDate") as string;
  const endDateStr = formData.get("endDate") as string;
  const reason = formData.get("reason") as string;

  if (studentId !== sessionStudentId) {
    return { error: "Unauthorized access" };
  }

  if (!startDateStr || !endDateStr || !reason) {
    return { error: "All fields are required" };
  }

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  if (startDate > endDate) {
    return { error: "End date cannot be before start date" };
  }

  try {
    await prisma.leaveRequest.create({
      data: {
        studentId,
        startDate,
        endDate,
        reason,
        status: "PENDING"
      }
    });

    revalidatePath(`/portal/${studentId}/attendance`);
    return { success: true };
  } catch (error) {
    console.error("Error submitting leave request:", error);
    return { error: "Failed to submit request. Please try again." };
  }
}
