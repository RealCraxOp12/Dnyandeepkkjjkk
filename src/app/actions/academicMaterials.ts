"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSyllabus(className?: string) {
  try {
    const whereClause = className && className !== "ALL" ? { targetClass: className } : {};
    try {
      // @ts-ignore
      const results = await prisma.syllabus.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
      });
      return results;
    } catch (e) {
      // Fallback raw query
      return await prisma.$queryRaw<any[]>`
        SELECT * FROM "Syllabus" 
        ${className && className !== "ALL" ? prisma.$queryRaw`WHERE "targetClass" = ${className}` : prisma.$queryRaw``} 
        ORDER BY "createdAt" DESC
      `;
    }
  } catch (error) {
    console.error("Error fetching syllabus:", error);
    return [];
  }
}

export async function getNotes(className?: string) {
  try {
    const whereClause = className && className !== "ALL" ? { targetClass: className } : {};
    try {
      // @ts-ignore
      const results = await prisma.note.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
      });
      return results;
    } catch (e) {
      // Fallback raw query
      return await prisma.$queryRaw<any[]>`
        SELECT * FROM "Note" 
        ${className && className !== "ALL" ? prisma.$queryRaw`WHERE "targetClass" = ${className}` : prisma.$queryRaw``} 
        ORDER BY "createdAt" DESC
      `;
    }
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
}

export async function createMaterial(formData: FormData, type: "syllabus" | "note") {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string; // only for notes
    const targetClass = formData.get("targetClass") as string;
    const subject = formData.get("subject") as string;
    const fileUrl = formData.get("fileUrl") as string | null;
    
    if (!title || !targetClass || !subject) {
      return { error: "Required fields are missing" };
    }

    if (type === "syllabus") {
      try {
        // @ts-ignore
        await prisma.syllabus.create({
          data: { title, targetClass, subject, fileUrl }
        });
      } catch (e) {
        await prisma.$executeRaw`
          INSERT INTO "Syllabus" ("id", "title", "targetClass", "subject", "fileUrl", "createdAt", "updatedAt")
          VALUES (${'cuid_' + Date.now()}, ${title}, ${targetClass}, ${subject}, ${fileUrl}, NOW(), NOW())
        `;
      }
      revalidatePath("/syllabus");
      revalidatePath("/staff/[staffId]/syllabus", "page");
    } else {
      try {
        // @ts-ignore
        await prisma.note.create({
          data: { title, description, targetClass, subject, fileUrl }
        });
      } catch (e) {
        await prisma.$executeRaw`
          INSERT INTO "Note" ("id", "title", "description", "targetClass", "subject", "fileUrl", "createdAt", "updatedAt")
          VALUES (${'cuid_' + Date.now()}, ${title}, ${description}, ${targetClass}, ${subject}, ${fileUrl}, NOW(), NOW())
        `;
      }
      revalidatePath("/notes");
      revalidatePath("/staff/[staffId]/notes", "page");
    }

    return { success: true };
  } catch (error) {
    console.error(`Error creating ${type}:`, error);
    return { error: `Failed to create ${type}` };
  }
}

export async function deleteMaterial(id: string, type: "syllabus" | "note") {
  try {
    if (type === "syllabus") {
      try {
        // @ts-ignore
        await prisma.syllabus.delete({ where: { id } });
      } catch (e) {
        await prisma.$executeRaw`DELETE FROM "Syllabus" WHERE "id" = ${id}`;
      }
      revalidatePath("/syllabus");
      revalidatePath("/staff/[staffId]/syllabus", "page");
    } else {
      try {
        // @ts-ignore
        await prisma.note.delete({ where: { id } });
      } catch (e) {
        await prisma.$executeRaw`DELETE FROM "Note" WHERE "id" = ${id}`;
      }
      revalidatePath("/notes");
      revalidatePath("/staff/[staffId]/notes", "page");
    }
    return { success: true };
  } catch (error) {
    console.error(`Error deleting ${type}:`, error);
    return { error: `Failed to delete ${type}` };
  }
}
