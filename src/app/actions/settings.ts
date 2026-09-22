'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSettings() {
  try {
    let settings = await prisma.systemSettings.findUnique({
      where: { id: "default" }
    });
    
    if (!settings) {
      // Create defaults if not exists
      settings = await prisma.systemSettings.create({
        data: {
          id: "default"
        }
      });
    }
    
    return settings;
  } catch (error) {
    console.error("Error fetching settings:", error);
    throw new Error("Failed to fetch settings");
  }
}

export async function updateSettings(data: any) {
  try {
    const updated = await prisma.systemSettings.update({
      where: { id: "default" },
      data: {
        schoolName: data.schoolName,
        udiseCode: data.udiseCode,
        boardAffiliation: data.boardAffiliation,
        mediumOfInstruction: data.mediumOfInstruction,
        address: data.address,
        academicYear: data.academicYear,
        gradingSystem: data.gradingSystem,
        lcStartingSerialNo: parseInt(data.lcStartingSerialNo) || 1001,
        bonafidePrefix: data.bonafidePrefix,
      }
    });
    
    revalidatePath('/settings');
    revalidatePath('/'); // Revalidate dashboard where name might be used
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating settings:", error);
    return { success: false, error: "Failed to update settings" };
  }
}
