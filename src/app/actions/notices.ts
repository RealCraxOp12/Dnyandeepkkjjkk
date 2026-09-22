"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getNotices() {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: { createdAt: "desc" },
    });
    return notices;
  } catch (error) {
    console.error("Error fetching notices:", error);
    return [];
  }
}

export async function createNotice(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const type = formData.get("type") as string;
    const fileUrl = formData.get("fileUrl") as string | null;
    
    if (!title || !description) {
      return { error: "Title and description are required" };
    }

    await prisma.notice.create({
      data: {
        title,
        description,
        type: type || "GENERAL",
        date: new Date(),
        fileUrl
      }
    });

    revalidatePath("/notices");
    revalidatePath("/staff/[staffId]/notices", "page");
    return { success: true };
  } catch (error) {
    console.error("Error creating notice:", error);
    return { error: "Failed to create notice" };
  }
}

export async function deleteNotice(id: string) {
  try {
    await prisma.notice.delete({ where: { id } });
    revalidatePath("/notices");
    revalidatePath("/staff/[staffId]/notices", "page");
    return { success: true };
  } catch (error) {
    console.error("Error deleting notice:", error);
    return { error: "Failed to delete notice" };
  }
}
