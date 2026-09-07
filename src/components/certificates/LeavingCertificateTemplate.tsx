interface TemplateProps {
  student?: any;
}

export function LeavingCertificateTemplate({ student }: TemplateProps) {
  // Use real data if provided, otherwise fallback to placeholder
  const fullName = student ? `${student.firstName} ${student.surname}` : "Rahul Rajendra Sharma";
  const registerNo = student?.registerNo || "4502";
  const saralId = student?.saralId || "2018272520012340012";
  const adharNo = student?.adharNo || "1234 5678 9012";
  const motherName = student?.motherName || "Sunita";
  const nationality = student?.nationality || "Indian";
  const religionCaste = student ? `${student.religion || ''} - ${student.caste || ''}` : "Hindu - Maratha";
  const birthPlace = student?.birthPlace || "Pune, Tal: Haveli, Dist: Pune, State: Maharashtra";
  
  const dobRaw = student?.dateOfBirth ? new Date(student.dateOfBirth) : null;
  const dobFormatted = dobRaw ? `${dobRaw.getDate().toString().padStart(2, '0')} / ${(dobRaw.getMonth() + 1).toString().padStart(2, '0')} / ${dobRaw.getFullYear()}` : "15 / 08 / 2010";
  const dobInWords = student?.dobInWords || "Fifteenth August Two Thousand Ten";
  
  const previousSchool = student?.previousSchool || "Saraswati Vidya Mandir, Pune";
  
  const doaRaw = student?.dateOfAdmission ? new Date(student.dateOfAdmission) : null;
  const doaFormatted = doaRaw ? `${doaRaw.getDate().toString().padStart(2, '0')} / ${(doaRaw.getMonth() + 1).toString().padStart(2, '0')} / ${doaRaw.getFullYear()}` : "12 / 06 / 2015";
  const admissionClass = student?.admissionClass || "1st Standard";
  
  const currentClass = student?.currentClass || "10th (Tenth)";

  return (
    <div className="w-full max-w-4xl mx-auto bg-white border-4 border-slate-800 p-8 shadow-xl relative mt-8 print:shadow-none print:mt-0 print:border-4 print:p-8">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <h1 className="text-9xl font-bold rotate-[-45deg] tracking-widest text-slate-900">DNYANDEEP</h1>
      </div>

      {/* Header */}
      <div className="text-center pb-4 relative z-10">
        <h1 className="text-3xl font-extrabold text-red-700 tracking-wider mb-1 uppercase font-serif">Dnyandeep Vidyalaya</h1>
        <p className="text-sm text-slate-600 font-semibold mb-1">Recognized by Government of Maharashtra</p>
        <p className="text-xs text-slate-500">123 Education Road, Knowledge City, Maharashtra - 411001</p>
      </div>

      <div className="flex justify-between text-xs font-bold text-slate-800 border-t border-b border-slate-300 py-2 mb-6 relative z-10 px-4">
        <p>School Recognition No: S-12345</p>
        <p>UDISE No: 27252001234</p>
        <p>Board: State Board (SSC)</p>
      </div>

      {/* Title */}
      <div className="text-center mb-8 relative z-10">
        <h2 className="text-2xl font-bold uppercase tracking-widest text-slate-800 underline underline-offset-4">
          School Leaving Certificate
        </h2>
      </div>

      {/* Form Fields Layout */}
      <div className="space-y-4 text-sm text-slate-800 relative z-10 font-serif">
        <div className="flex">
          <div className="w-1/2">
            <span className="font-semibold">1. General Register No:</span> <span className="underline decoration-dotted underline-offset-4 ml-2 outline-none focus:bg-blue-50 focus:rounded" contentEditable suppressContentEditableWarning>{registerNo}</span>
          </div>
          <div className="w-1/2">
            <span className="font-semibold">2. Student ID (SARAL):</span> <span className="underline decoration-dotted underline-offset-4 ml-2 outline-none focus:bg-blue-50 focus:rounded" contentEditable suppressContentEditableWarning>{saralId}</span>
          </div>
        </div>

        <div className="flex">
          <div className="w-1/2">
            <span className="font-semibold">3. UID No (Aadhar):</span> <span className="underline decoration-dotted underline-offset-4 ml-2 outline-none focus:bg-blue-50 focus:rounded" contentEditable suppressContentEditableWarning>{adharNo}</span>
          </div>
        </div>

        <div>
          <span className="font-semibold">4. Name of the Pupil in Full:</span> <span className="underline decoration-dotted underline-offset-4 ml-2 font-bold text-base outline-none focus:bg-blue-50 focus:rounded" contentEditable suppressContentEditableWarning>{fullName}</span>
        </div>

        <div className="flex">
          <div className="w-1/2">
            <span className="font-semibold">5. Mother's Name:</span> <span className="underline decoration-dotted underline-offset-4 ml-2 outline-none focus:bg-blue-50 focus:rounded" contentEditable suppressContentEditableWarning>{motherName}</span>
          </div>
          <div className="w-1/2">
            <span className="font-semibold">6. Nationality:</span> <span className="underline decoration-dotted underline-offset-4 ml-2 outline-none focus:bg-blue-50 focus:rounded" contentEditable suppressContentEditableWarning>{nationality}</span>
          </div>
        </div>

        <div>
          <span className="font-semibold">7. Religion & Caste / Sub-Caste:</span> <span className="underline decoration-dotted underline-offset-4 ml-2 outline-none focus:bg-blue-50 focus:rounded" contentEditable suppressContentEditableWarning>{religionCaste}</span>
        </div>

        <div>
          <span className="font-semibold">8. Place of Birth:</span> <span className="underline decoration-dotted underline-offset-4 ml-2 outline-none focus:bg-blue-50 focus:rounded" contentEditable suppressContentEditableWarning>{birthPlace}</span>
        </div>

        <div>
          <span className="font-semibold">9. Date of Birth (in figures):</span> <span className="underline decoration-dotted underline-offset-4 ml-2 outline-none focus:bg-blue-50 focus:rounded" contentEditable suppressContentEditableWarning>{dobFormatted}</span>
        </div>
        <div>
          <span className="font-semibold pl-4">(in words):</span> <span className="underline decoration-dotted underline-offset-4 ml-2 outline-none focus:bg-blue-50 focus:rounded" contentEditable suppressContentEditableWarning>{dobInWords}</span>
        </div>

        <div>
          <span className="font-semibold">10. Last School Attended:</span> <span className="underline decoration-dotted underline-offset-4 ml-2 outline-none focus:bg-blue-50 focus:rounded" contentEditable suppressContentEditableWarning>{previousSchool}</span>
        </div>

        <div>
          <span className="font-semibold">11. Date of Admission in this School & Class:</span> <span className="underline decoration-dotted underline-offset-4 ml-2 outline-none focus:bg-blue-50 focus:rounded" contentEditable suppressContentEditableWarning>{doaFormatted}, {admissionClass}</span>
        </div>

        <div>
          <span className="font-semibold">12. Progress:</span> <span className="underline decoration-dotted underline-offset-4 ml-2 outline-none focus:bg-blue-50 focus:rounded" contentEditable suppressContentEditableWarning>Good</span>
          <span className="font-semibold ml-12">13. Conduct:</span> <span className="underline decoration-dotted underline-offset-4 ml-2 outline-none focus:bg-blue-50 focus:rounded" contentEditable suppressContentEditableWarning>Good</span>
        </div>

        <div>
          <span className="font-semibold">14. Date of leaving school:</span> <span className="underline decoration-dotted underline-offset-4 ml-2 outline-none focus:bg-blue-50 focus:rounded" contentEditable suppressContentEditableWarning>{new Date().toLocaleDateString('en-GB')}</span>
        </div>

        <div>
          <span className="font-semibold">15. Standard in which studying and since when (in words & figures):</span> <span className="underline decoration-dotted underline-offset-4 ml-2 outline-none focus:bg-blue-50 focus:rounded" contentEditable suppressContentEditableWarning>{currentClass}, Since June 2025</span>
        </div>

        <div>
          <span className="font-semibold">16. Reason for leaving school:</span> <span className="underline decoration-dotted underline-offset-4 ml-2 outline-none focus:bg-blue-50 focus:rounded" contentEditable suppressContentEditableWarning>Passed SSC Examination</span>
        </div>

        <div>
          <span className="font-semibold">17. Remarks:</span> <span className="underline decoration-dotted underline-offset-4 ml-2 outline-none focus:bg-blue-50 focus:rounded" contentEditable suppressContentEditableWarning>Passed with First Class</span>
        </div>
      </div>

      <p className="mt-8 text-xs italic text-center text-slate-500 relative z-10">
        Certified that the above information is in accordance with the School Register.
      </p>

      {/* Footer / Signatures */}
      <div className="mt-16 flex justify-between items-end relative z-10 px-8">
        <div className="text-center border-t border-slate-800 pt-1 w-32">
          <p className="text-xs font-semibold text-slate-800">Class Teacher</p>
        </div>
        <div className="text-center border-t border-slate-800 pt-1 w-32">
          <p className="text-xs font-semibold text-slate-800">Clerk</p>
        </div>
        <div className="text-center border-t border-slate-800 pt-1 w-48">
          <p className="text-xs font-bold text-slate-800">Headmaster / Principal</p>
        </div>
      </div>
    </div>
  );
}
