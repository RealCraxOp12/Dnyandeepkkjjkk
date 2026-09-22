'use server';

import { prisma } from "@/lib/prisma";
import { createStaffSession, destroyStaffSession } from "@/lib/session";
import { redirect } from "next/navigation";
import crypto from "crypto";

// Helper for hashing password (very basic for demo, in prod use bcrypt)
function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function loginStaff(formData: FormData) {
  const employeeId = formData.get("employeeId") as string;
  const password = formData.get("password") as string;
  
  if (!employeeId || !password) {
    return { error: "Please provide both Employee ID and Password" };
  }

  try {
    // Bypass the Next.js Prisma Client memory cache by querying the database directly using raw SQL
    // This completely prevents the "undefined" table error without requiring a server restart.
    const staffRecords = await prisma.$queryRaw<any[]>`SELECT * FROM "Staff" WHERE "employeeId" = ${employeeId} LIMIT 1`;
    const staff = staffRecords && staffRecords.length > 0 ? staffRecords[0] : null;

    if (!staff) {
      return { error: "Invalid Employee ID" };
    }

    if (staff.password !== hashPassword(password)) {
      return { error: "Incorrect Password" };
    }

    if (!staff.activeStatus) {
      return { error: "This account has been deactivated" };
    }

    await createStaffSession(staff.id);
    return { success: true, redirectUrl: `/staff/${staff.id}` };
    
  } catch (error) {
    console.error("Staff login error:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function logoutStaff() {
  await destroyStaffSession();
  redirect("/staff");
}
