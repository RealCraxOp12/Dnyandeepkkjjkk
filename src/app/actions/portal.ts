'use server';

import { prisma } from "@/lib/prisma";
import { createParentSession, destroyParentSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function loginParent(formData: FormData) {
  const registerNo = formData.get("registerNo") as string;
  const day = formData.get("day") as string;
  const month = formData.get("month") as string;
  const year = formData.get("year") as string;
  
  if (!registerNo || !day || !month || !year) {
    return { error: "Please provide both Register Number and Date of Birth" };
  }

  const dobStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`; // YYYY-MM-DD

  try {
    // 1. Find the student by register number
    const student = await prisma.student.findUnique({
      where: { registerNo }
    });

    if (!student || !student.dateOfBirth) {
      return { error: "Invalid Register Number or Date of Birth not recorded" };
    }

    // 2. Compare DOB (ignoring time component)
    const dbDobStr = student.dateOfBirth.toISOString().split('T')[0]; // YYYY-MM-DD
    
    if (dbDobStr !== dobStr) {
      return { error: "Incorrect Date of Birth" };
    }

    // 3. Create session cookie securely
    await createParentSession(student.id);
    
    // 4. Redirect to the student's portal
    return { success: true, redirectUrl: `/portal/${student.id}` };
    
  } catch (error) {
    console.error("Portal login error:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function logoutParent() {
  await destroyParentSession();
  redirect("/portal");
}
