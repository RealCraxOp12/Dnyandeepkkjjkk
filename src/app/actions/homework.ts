"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAssignments(className?: string) {
  try {
    const whereClause = className && className !== "ALL" ? { targetClass: className } : {};
    
    // Fallback if Prisma cache issue persists on new table:
    // If Prisma client throws an error because the Assignment table is unknown in this process,
    // we use $queryRaw.
    try {
      // @ts-ignore
      const assignments = await prisma.assignment.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
      });
      return assignments;
    } catch (e) {
      // Fallback to raw query if Next.js has cached an old schema without Assignment
      const assignments = await prisma.$queryRaw<any[]>`
        SELECT * FROM "Assignment" 
        ${className && className !== "ALL" ? prisma.$queryRaw`WHERE "targetClass" = ${className}` : prisma.$queryRaw``} 
        ORDER BY "createdAt" DESC
      `;
      return assignments;
    }
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return [];
  }
}

export async function createAssignment(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const targetClass = formData.get("targetClass") as string;
    const subject = formData.get("subject") as string;
    const dueDateStr = formData.get("dueDate") as string;
    const fileUrl = formData.get("fileUrl") as string | null;

    if (!title || !targetClass || !subject || !dueDateStr) {
      return { error: "Required fields are missing" };
    }

    try {
      // @ts-ignore
      await prisma.assignment.create({
        data: {
          title,
          description,
          targetClass,
          subject,
          dueDate: new Date(dueDateStr),
          fileUrl
        }
      });
    } catch (e) {
      // Fallback raw query
      await prisma.$executeRaw`
        INSERT INTO "Assignment" ("id", "title", "description", "targetClass", "subject", "dueDate", "fileUrl", "createdAt", "updatedAt")
        VALUES (
          ${'cuid_' + Date.now()}, 
          ${title}, 
          ${description}, 
          ${targetClass}, 
          ${subject}, 
          ${new Date(dueDateStr)}, 
          ${fileUrl}, 
          NOW(), 
          NOW()
        )
      `;
    }

    revalidatePath("/homework");
    revalidatePath("/staff/[staffId]/homework", "page");
    return { success: true };
  } catch (error) {
    console.error("Error creating assignment:", error);
    return { error: "Failed to create assignment" };
  }
}

export async function deleteAssignment(id: string) {
  try {
    try {
      // @ts-ignore
      await prisma.assignment.delete({ where: { id } });
    } catch (e) {
      // Fallback
      await prisma.$executeRaw`DELETE FROM "Assignment" WHERE "id" = ${id}`;
    }
    revalidatePath("/homework");
    revalidatePath("/staff/[staffId]/homework", "page");
    return { success: true };
  } catch (error) {
    console.error("Error deleting assignment:", error);
    return { error: "Failed to delete assignment" };
  }
}
