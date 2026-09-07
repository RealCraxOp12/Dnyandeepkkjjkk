"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentSchema, type StudentFormValues } from "@/lib/validations/student";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { createStudent, updateStudent } from "@/app/actions/student";

const inputClass = "w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 dark:text-slate-100 transition-all text-sm";
const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";
const sectionClass = "text-sm font-semibold text-primary-600 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2";

export function StudentRegistrationForm({ initialData }: { initialData?: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { register, handleSubmit, formState: { errors }, reset } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: initialData || {
      nationality: "Indian",
      state: "Maharashtra",
      country: "India",
      isMinority: false,
      isBoarder: false,
      isScholar: false,
      rte: false,
    },
  });
  
  // Format dates for inputs if editing
  useEffect(() => {
    if (initialData) {
      const formattedData = { ...initialData };
      if (formattedData.dateOfBirth) formattedData.dateOfBirth = new Date(formattedData.dateOfBirth).toISOString().split('T')[0];
      if (formattedData.dateOfAdmission) formattedData.dateOfAdmission = new Date(formattedData.dateOfAdmission).toISOString().split('T')[0];
      reset(formattedData);
    }
  }, [initialData, reset]);

  const onSubmit = async (data: StudentFormValues) => {
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccess(false);
    
    try {
      const result = initialData?.id 
        ? await updateStudent(initialData.id, data)
        : await createStudent(data);
        
      if (result.success) {
        setSuccess(true);
        if (!initialData) reset(); // only reset if creating new
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setErrorMsg(result.error || "Something went wrong.");
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{initialData ? 'Edit Student Record' : 'Student Admission Form'}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{initialData ? 'Update the details for this student.' : 'Complete all details for the new student admission.'}</p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-900 flex items-center gap-3">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          Student {initialData ? 'updated' : 'registered'} successfully!
        </div>
      )}
      
      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-900 flex items-center gap-3">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        
        {/* Section 1: Personal Details */}
        <section>
          <h3 className={sectionClass}>1. Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>First Name <span className="text-red-500">*</span></label>
              <input {...register("firstName")} className={inputClass} placeholder="Student's first name" />
              {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Surname <span className="text-red-500">*</span></label>
              <input {...register("surname")} className={inputClass} placeholder="Student's surname" />
              {errors.surname && <p className="text-xs text-red-500 mt-1">{errors.surname.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Gender</label>
              <select {...register("gender")} className={inputClass}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Date of Birth</label>
              <input type="date" {...register("dateOfBirth")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>DOB in Words</label>
              <input {...register("dobInWords")} className={inputClass} placeholder="e.g. First June Two Thousand Ten" />
            </div>
            <div>
              <label className={labelClass}>Birth Place</label>
              <input {...register("birthPlace")} className={inputClass} placeholder="City/Village" />
            </div>
            <div>
              <label className={labelClass}>Blood Group</label>
              <select {...register("bloodGroup")} className={inputClass}>
                <option value="">Select</option>
                <option value="A+">A+</option><option value="A-">A-</option>
                <option value="B+">B+</option><option value="B-">B-</option>
                <option value="O+">O+</option><option value="O-">O-</option>
                <option value="AB+">AB+</option><option value="AB-">AB-</option>
              </select>
            </div>
          </div>
        </section>

        {/* Section 2: Admission & Identifiers */}
        <section>
          <h3 className={sectionClass}>2. Admission & Identifiers</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>Register No</label>
              <input {...register("registerNo")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Date of Admission</label>
              <input type="date" {...register("dateOfAdmission")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Admission Class</label>
              <select {...register("admissionClass")} className={inputClass}>
                <option value="">Select Class</option>
                <option value="1st">1st</option>
                <option value="2nd">2nd</option>
                <option value="3rd">3rd</option>
                <option value="4th">4th</option>
                <option value="5th">5th</option>
                <option value="6th">6th</option>
                <option value="7th">7th</option>
                <option value="8th">8th</option>
                <option value="9th">9th</option>
                <option value="10th">10th</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Current Class</label>
              <select {...register("currentClass")} className={inputClass}>
                <option value="">Select Class</option>
                <option value="1st">1st</option>
                <option value="2nd">2nd</option>
                <option value="3rd">3rd</option>
                <option value="4th">4th</option>
                <option value="5th">5th</option>
                <option value="6th">6th</option>
                <option value="7th">7th</option>
                <option value="8th">8th</option>
                <option value="9th">9th</option>
                <option value="10th">10th</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Division</label>
              <input {...register("division")} className={inputClass} placeholder="e.g. A" />
            </div>
            <div>
              <label className={labelClass}>Educational Year</label>
              <input {...register("educationalYear")} className={inputClass} placeholder="e.g. 2023-2024" />
            </div>
            <div>
              <label className={labelClass}>Student Adhar No</label>
              <input {...register("adharNo")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Student SARAL Id</label>
              <input {...register("saralId")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>APAAR Id</label>
              <input {...register("apaarId")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>PEN No</label>
              <input {...register("penNo")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Book No</label>
              <input {...register("bookNo")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Previous School</label>
              <input {...register("previousSchool")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Previous Class</label>
              <select {...register("previousClass")} className={inputClass}>
                <option value="">Select Class</option>
                <option value="1st">1st</option>
                <option value="2nd">2nd</option>
                <option value="3rd">3rd</option>
                <option value="4th">4th</option>
                <option value="5th">5th</option>
                <option value="6th">6th</option>
                <option value="7th">7th</option>
                <option value="8th">8th</option>
                <option value="9th">9th</option>
                <option value="10th">10th</option>
              </select>
            </div>
          </div>
        </section>

        {/* Section 3: Demographics */}
        <section>
          <h3 className={sectionClass}>3. Demographics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>Religion</label>
              <input {...register("religion")} className={inputClass} placeholder="e.g. Hindu, Muslim" />
            </div>
            <div>
              <label className={labelClass}>Caste</label>
              <input {...register("caste")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Sub Caste</label>
              <input {...register("subCaste")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select {...register("category")} className={inputClass}>
                <option value="">Select</option>
                <option value="OPEN">OPEN</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="NT">NT</option>
                <option value="VJ">VJ</option>
                <option value="SBC">SBC</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Mother Tongue</label>
              <input {...register("motherTongue")} className={inputClass} placeholder="e.g. Marathi" />
            </div>
            <div>
              <label className={labelClass}>Nationality</label>
              <input {...register("nationality")} className={inputClass} />
            </div>
            <div className="flex items-center gap-3 mt-6">
              <input type="checkbox" {...register("isMinority")} className="w-4 h-4 text-primary-600 rounded" />
              <label className="text-sm text-slate-700 dark:text-slate-300">Is Minority Student?</label>
            </div>
          </div>
        </section>

        {/* Section 4: Contact & Location */}
        <section>
          <h3 className={sectionClass}>4. Contact Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-3">
              <label className={labelClass}>Full Address</label>
              <textarea {...register("address")} rows={2} className={inputClass} placeholder="House no, Street, Landmark" />
            </div>
            <div>
              <label className={labelClass}>Taluka</label>
              <input {...register("taluka")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>District</label>
              <input {...register("district")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Pincode</label>
              <input {...register("pincode")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>State</label>
              <input {...register("state")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Mobile No (Primary)</label>
              <input {...register("mobileNo")} className={inputClass} />
            </div>
          </div>
        </section>

        {/* Section 5: Parent Details */}
        <section>
          <h3 className={sectionClass}>5. Parent Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>Father's Full Name</label>
              <input {...register("fatherName")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Father's Occupation</label>
              <input {...register("fatherOccupation")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Father's Phone</label>
              <input {...register("fatherPhone")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Mother's Full Name</label>
              <input {...register("motherName")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Mother's Occupation</label>
              <input {...register("motherOccupation")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Mother's Phone</label>
              <input {...register("motherPhone")} className={inputClass} />
            </div>
          </div>
        </section>

        {/* Section 6: Special Categories */}
        <section>
          <h3 className={sectionClass}>6. Additional Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-md">
              <input type="checkbox" {...register("isBoarder")} className="w-4 h-4 text-primary-600 rounded" />
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Boarder / Resident</label>
            </div>
            <div className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-md">
              <input type="checkbox" {...register("rte")} className="w-4 h-4 text-primary-600 rounded" />
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">RTE Admission</label>
            </div>
            <div className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-md">
              <input type="checkbox" {...register("isScholar")} className="w-4 h-4 text-primary-600 rounded" />
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Scholar Student</label>
            </div>
            <div>
              <label className={labelClass}>Scholarship Name</label>
              <input {...register("scholarshipName")} className={inputClass} placeholder="If applicable" />
            </div>
            <div>
              <label className={labelClass}>ELGA</label>
              <input {...register("elga")} className={inputClass} placeholder="ELGA Details" />
            </div>
          </div>
        </section>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-md font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
          >
            {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
            Save Student Record
          </button>
        </div>
      </form>
    </div>
  );
}
