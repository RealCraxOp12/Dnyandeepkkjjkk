"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getStaffList() {
  try {
    const staff = await prisma.staff.findMany({
      orderBy: { firstName: 'asc' }
    });
    return staff;
  } catch (error) {
    const result = await prisma.$queryRaw`SELECT * FROM "Staff" ORDER BY "firstName" ASC`;
    return Array.isArray(result) ? result : [];
  }
}

export async function updateStaffAssignment(staffId: string, assignedSubject: string | null) {
  try {
    await prisma.staff.update({
      where: { id: staffId },
      data: { assignedSubject }
    });
    revalidatePath("/staff-management");
    return { success: true };
  } catch (error) {
    console.error("Failed to update staff:", error);
    try {
      await prisma.$executeRaw`UPDATE "Staff" SET "assignedSubject" = ${assignedSubject} WHERE id = ${staffId}`;
      revalidatePath("/staff-management");
      return { success: true };
    } catch (fallbackError) {
      return { success: false, error: "Failed to update staff" };
    }
  }
}

import crypto from "crypto";

function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function createStaff(data: any) {
  try {
    const existing = await prisma.staff.findUnique({ where: { employeeId: data.employeeId } });
    if (existing) {
      return { success: false, error: "Employee ID already exists" };
    }

    await prisma.staff.create({
      data: {
        employeeId: data.employeeId,
        password: hashPassword(data.password),
        firstName: data.firstName,
        surname: data.surname,
        role: "TEACHER",
        assignedSubject: data.assignedSubject || null,
      }
    });
    revalidatePath("/staff-management");
    return { success: true };
  } catch (error) {
    console.error("Failed to create staff:", error);
    try {
      // Fallback
      const hashedPass = hashPassword(data.password);
      const id = crypto.randomUUID(); // Fallback ID generation
      await prisma.$executeRaw`
        INSERT INTO "Staff" ("id", "employeeId", "password", "firstName", "surname", "role", "assignedSubject", "activeStatus", "createdAt", "updatedAt") 
        VALUES (${id}, ${data.employeeId}, ${hashedPass}, ${data.firstName}, ${data.surname}, 'TEACHER', ${data.assignedSubject || null}, true, NOW(), NOW())
      `;
      revalidatePath("/staff-management");
      return { success: true };
    } catch (fallbackError: any) {
      return { success: false, error: "Creation failed. Error: " + (fallbackError?.message || String(fallbackError)) };
    }
  }
}

export async function deleteStaff(staffId: string) {
  try {
    await prisma.staff.delete({
      where: { id: staffId }
    });
    revalidatePath("/staff-management");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete staff:", error);
    try {
      await prisma.$executeRaw`DELETE FROM "Staff" WHERE id = ${staffId}`;
      revalidatePath("/staff-management");
      return { success: true };
    } catch (fallbackError) {
      return { success: false, error: "Failed to delete staff" };
    }
  }
}
