"use server";

import { prisma } from "@/lib/prisma";
import { studentSchema, type StudentFormValues } from "@/lib/validations/student";
import { revalidatePath } from "next/cache";

export async function createStudent(data: StudentFormValues) {
  try {
    // Validate on server
    const validatedData = studentSchema.parse(data);

    // Filter out empty strings for unique fields to prevent constraints violations
    // Because empty strings would conflict if multiple are empty.
    const cleanData = {
      ...validatedData,
      registerNo: validatedData.registerNo || null,
      apaarId: validatedData.apaarId || null,
      adharNo: validatedData.adharNo || null,
      dateOfAdmission: validatedData.dateOfAdmission ? new Date(validatedData.dateOfAdmission) : null,
      dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : null,
    };

    const student = await prisma.student.create({
      data: cleanData,
    });

    revalidatePath("/");
    revalidatePath("/admissions");
    
    return { success: true, data: student };
  } catch (error: any) {
    console.error("Failed to create student:", error);
    
    // Check for Prisma unique constraint violations (e.g. duplicate register no)
    if (error.code === 'P2002') {
      return { success: false, error: `A student with this ${error.meta?.target?.[0]} already exists.` };
    }
    
    return { success: false, error: error.message || "Failed to create student" };
  }
}

export async function searchStudents(query: string) {
  try {
    if (!query || query.trim() === "") return [];
    
    const students = await prisma.student.findMany({
      where: {
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { surname: { contains: query, mode: 'insensitive' } },
          { registerNo: { contains: query, mode: 'insensitive' } },
          { adharNo: { contains: query, mode: 'insensitive' } },
          { saralId: { contains: query, mode: 'insensitive' } },
        ]
      },
      take: 5,
    });
    
    return students;
  } catch (error) {
    console.error("Failed to search students:", error);
    return [];
  }
}

export async function getAllStudents() {
  try {
    return await prisma.student.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Failed to get all students:", error);
    return [];
  }
}

export async function deleteStudent(id: string) {
  try {
    await prisma.student.delete({
      where: { id }
    });
    revalidatePath("/students");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete student:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteAllStudents() {
  try {
    await prisma.student.deleteMany();
    revalidatePath("/students");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete all students:", error);
    return { success: false, error: error.message };
  }
}

export async function updateStudent(id: string, data: StudentFormValues) {
  try {
    const validatedData = studentSchema.parse(data);
    const cleanData = {
      ...validatedData,
      registerNo: validatedData.registerNo || null,
      apaarId: validatedData.apaarId || null,
      adharNo: validatedData.adharNo || null,
      dateOfAdmission: validatedData.dateOfAdmission ? new Date(validatedData.dateOfAdmission) : null,
      dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : null,
    };

    const student = await prisma.student.update({
      where: { id },
      data: cleanData,
    });

    revalidatePath("/students");
    revalidatePath("/");
    return { success: true, data: student };
  } catch (error: any) {
    console.error("Failed to update student:", error);
    if (error.code === 'P2002') {
      return { success: false, error: `A student with this ${error.meta?.target?.[0]} already exists.` };
    }
    return { success: false, error: error.message || "Failed to update student" };
  }
}

export async function importStudents(students: any[]) {
  try {
    // Helper to safely extract values from various possible header names
    const extract = (obj: any, keys: string[]) => {
      for (const key of keys) {
        if (obj[key] !== undefined) return obj[key];
      }
      return undefined;
    };

    // Clean and validate data before insertion
    const cleanData = students.map((raw) => {
      // Map Excel headers to Prisma keys
      const student = {
        firstName: extract(raw, ['Student Name', 'First Name', 'firstName']),
        surname: extract(raw, ['Student Surname', 'Surname', 'surname']),
        
        registerNo: String(extract(raw, ['Register No', 'registerNo', 'Register Number']) || ''),
        apaarId: String(extract(raw, ['APAAR Id', 'apaarId', 'APAAR ID']) || ''),
        adharNo: String(extract(raw, ['Student Adhar No', 'adharNo', 'Aadhar No', 'Aadhar']) || ''),
        saralId: String(extract(raw, ['Student SARAL Id', 'saralId', 'SARAL Id']) || ''),
        penNo: String(extract(raw, ['PEN No', 'penNo', 'PEN']) || ''),
        bookNo: String(extract(raw, ['Book No', 'bookNo', 'Book']) || ''),

        admissionClass: extract(raw, ['Admission Class', 'admissionClass']),
        currentClass: extract(raw, ['Current Class', 'currentClass', 'Class', 'class']),
        division: extract(raw, ['Division', 'division']),
        educationalYear: extract(raw, ['Educational Year', 'educationalYear']),
        previousSchool: extract(raw, ['Previous School', 'previousSchool']),
        previousClass: extract(raw, ['Previous Class', 'previousClass']),

        dateOfBirth: extract(raw, ['Date Of Birth', 'dateOfBirth', 'DOB']),
        dobInWords: extract(raw, ['DOB In Words', 'dobInWords']),
        birthPlace: extract(raw, ['Birth Place', 'birthPlace']),
        gender: extract(raw, ['Gender', 'gender']),
        bloodGroup: extract(raw, ['Blood Group', 'bloodGroup']),
        nationality: extract(raw, ['Nationality', 'nationality']),
        motherTongue: extract(raw, ['Mother Tongue', 'motherTongue']),
        religion: extract(raw, ['Religion', 'religion']),
        caste: extract(raw, ['Caste', 'caste']),
        subCaste: extract(raw, ['Sub Caste', 'subCaste']),
        category: extract(raw, ['Category', 'category']),

        address: extract(raw, ['Address', 'address']),
        taluka: extract(raw, ['Taluka', 'taluka']),
        district: extract(raw, ['District', 'district']),
        state: extract(raw, ['State', 'state']),
        country: extract(raw, ['Country', 'country']),
        pincode: String(extract(raw, ['Pincode', 'pincode', 'Pin Code']) || ''),
        mobileNo: String(extract(raw, ['Mobile No', 'mobileNo', 'Mobile Number']) || ''),

        fatherName: extract(raw, ['Father Name', 'fatherName', "Father's Name"]),
        motherName: extract(raw, ['Mother Name', 'motherName', "Mother's Name"]),
        fatherOccupation: extract(raw, ['Father\'s Occupation', 'fatherOccupation', 'Father Occupation']),
        motherOccupation: extract(raw, ['Mother\'s Occupation', 'motherOccupation', 'Mother Occupation']),
        fatherPhone: String(extract(raw, ['Father\'s Phone Number', 'fatherPhone', 'Father Phone']) || ''),
        motherPhone: String(extract(raw, ['Mother\'s Phone Number', 'motherPhone', 'Mother Phone']) || ''),

        scholarshipName: extract(raw, ['Scholarship Name', 'scholarshipName']),
        elga: extract(raw, ['ELGA', 'elga']),
        
        // Booleans
        isMinority: extract(raw, ['Is Minority', 'isMinority']),
        isBoarder: extract(raw, ['Boarder/Resident Student?', 'isBoarder', 'Boarder']),
        isScholar: extract(raw, ['Is the student a Scholar?', 'isScholar', 'Scholar']),
        rte: extract(raw, ['RTE?', 'rte', 'RTE']),
        activeStatus: extract(raw, ['Active Status', 'activeStatus', 'Status'])
      };

      const parseBool = (val: any) => {
        if (typeof val === 'boolean') return val;
        if (typeof val === 'string') {
          const lower = val.toLowerCase();
          return lower === 'yes' || lower === 'true' || lower === '1' || lower === 'active' || lower === 'boarder';
        }
        return false;
      };

      const parseClass = (val: any) => {
        if (!val) return null;
        const str = String(val).toLowerCase().trim();
        if (str.includes("10") || str.includes("tenth")) return "10th";
        if (str.includes("9") || str.includes("ninth")) return "9th";
        if (str.includes("8") || str.includes("eighth")) return "8th";
        if (str.includes("7") || str.includes("seventh")) return "7th";
        if (str.includes("6") || str.includes("sixth")) return "6th";
        if (str.includes("5") || str.includes("fifth")) return "5th";
        if (str.includes("4") || str.includes("fourth")) return "4th";
        if (str.includes("3") || str.includes("third")) return "3rd";
        if (str.includes("2") || str.includes("second")) return "2nd";
        if (str.includes("1") || str.includes("first")) return "1st";
        return String(val); // fallback
      };

      return {
        ...student,
        // Make sure names exist so it doesn't crash Prisma
        firstName: String(student.firstName || ''),
        surname: String(student.surname || ''),
        
        // Normalize classes to exactly 1st, 2nd, 3rd, etc.
        admissionClass: parseClass(student.admissionClass),
        currentClass: parseClass(student.currentClass),
        previousClass: parseClass(student.previousClass),
        
        // Ensure unique fields are null rather than empty strings if not provided
        registerNo: student.registerNo || null,
        apaarId: student.apaarId || null,
        adharNo: student.adharNo || null,
        saralId: student.saralId || null,
        penNo: student.penNo || null,
        bookNo: student.bookNo || null,
        
        // Parse dates properly
        dateOfAdmission: extract(raw, ['Date Of Admission', 'dateOfAdmission']) ? new Date(extract(raw, ['Date Of Admission', 'dateOfAdmission'])) : null,
        dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth) : null,
        
        // Ensure booleans are booleans
        isMinority: parseBool(student.isMinority),
        isBoarder: parseBool(student.isBoarder),
        isScholar: parseBool(student.isScholar),
        rte: parseBool(student.rte),
        activeStatus: student.activeStatus !== undefined ? parseBool(student.activeStatus) : true,
      };
    });

    let addedCount = 0;
    let updatedCount = 0;

    // Process concurrently in chunks of 50 to drastically improve speed
    const chunkSize = 50;
    for (let i = 0; i < cleanData.length; i += chunkSize) {
      const chunk = cleanData.slice(i, i + chunkSize);
      
      await Promise.all(
        chunk.map(async (student) => {
          const orConditions = [];
          if (student.adharNo) orConditions.push({ adharNo: student.adharNo });
          if (student.registerNo) orConditions.push({ registerNo: student.registerNo });
          if (student.saralId) orConditions.push({ saralId: student.saralId });
          if (student.apaarId) orConditions.push({ apaarId: student.apaarId });

          let existingStudent = null;
          if (orConditions.length > 0) {
            existingStudent = await prisma.student.findFirst({
              where: { OR: orConditions }
            });
          }

          if (existingStudent) {
            await prisma.student.update({
              where: { id: existingStudent.id },
              data: student,
            });
            updatedCount++;
          } else {
            await prisma.student.create({
              data: student,
            });
            addedCount++;
          }
        })
      );
    }

    revalidatePath("/students");
    revalidatePath("/");
    revalidatePath("/admissions");
    
    return { success: true, count: addedCount + updatedCount, message: `Added ${addedCount} new students and updated ${updatedCount} existing students.` };
  } catch (error: any) {
    console.error("Failed to import students:", error);
    return { success: false, error: error.message || "Failed to bulk import students" };
  }
}
