import * as z from "zod";

export const studentSchema = z.object({
  // Identifiers
  registerNo: z.string().optional(),
  apaarId: z.string().optional(),
  penNo: z.string().optional(),
  saralId: z.string().optional(),
  bookNo: z.string().optional(),
  adharNo: z.string().optional(),

  // Name
  firstName: z.string().min(2, "First name is required"),
  surname: z.string().min(2, "Surname is required"),

  // Admission Details
  admissionClass: z.string().optional(),
  dateOfAdmission: z.string().optional(),
  currentClass: z.string().optional(),
  division: z.string().optional(),
  educationalYear: z.string().optional(),
  previousSchool: z.string().optional(),
  previousClass: z.string().optional(),

  // Demographics
  dateOfBirth: z.string().optional(),
  dobInWords: z.string().optional(),
  birthPlace: z.string().optional(),
  gender: z.string().optional(),
  bloodGroup: z.string().optional(),
  nationality: z.string().default("Indian"),
  motherTongue: z.string().optional(),
  religion: z.string().optional(),
  caste: z.string().optional(),
  subCaste: z.string().optional(),
  category: z.string().optional(),
  isMinority: z.boolean().default(false),

  // Contact & Location
  address: z.string().optional(),
  taluka: z.string().optional(),
  district: z.string().optional(),
  state: z.string().default("Maharashtra"),
  country: z.string().default("India"),
  pincode: z.string().optional(),
  mobileNo: z.string().optional(),

  // Parent Details
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  fatherOccupation: z.string().optional(),
  motherOccupation: z.string().optional(),
  fatherPhone: z.string().optional(),
  motherPhone: z.string().optional(),

  // Special Categories
  isBoarder: z.boolean().default(false),
  isScholar: z.boolean().default(false),
  scholarshipName: z.string().optional(),
  elga: z.string().optional(),
  rte: z.boolean().default(false),

  activeStatus: z.boolean().default(true),
});

export type StudentFormValues = z.infer<typeof studentSchema>;
