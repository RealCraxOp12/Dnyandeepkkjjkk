interface TemplateProps {
  student?: any;
}

export function BonafideTemplate({ student }: TemplateProps) {
  // Use real data if provided, otherwise fallback to placeholder
  const fullName = student ? `${student.firstName} ${student.surname}` : "Rahul Sharma";
  const registerNo = student?.registerNo || "4502";
  const saralId = student?.saralId || "2018272520012340012";
  const standard = student?.admissionClass || student?.currentClass || "10th (Tenth)";
  const division = student?.division || "A";
  const year = student?.educationalYear || "2026 - 2027";
  
  const dobRaw = student?.dateOfBirth ? new Date(student.dateOfBirth) : null;
  const dobFormatted = dobRaw ? `${dobRaw.getDate().toString().padStart(2, '0')} / ${(dobRaw.getMonth() + 1).toString().padStart(2, '0')} / ${dobRaw.getFullYear()}` : "15 / 08 / 2010";
  const dobInWords = student?.dobInWords || "Fifteenth August Two Thousand Ten";
  
  const religion = student?.religion || "Hindu";
  const caste = student?.caste || "Maratha";

  return (
    <div className="w-full max-w-4xl mx-auto bg-white border-8 border-double border-slate-300 p-12 shadow-xl relative mt-8 print:shadow-none print:mt-0 print:border-8 print:p-8">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <h1 className="text-9xl font-bold rotate-[-45deg] tracking-widest text-slate-900">DNYANDEEP</h1>
      </div>

      {/* Header */}
      <div className="text-center border-b-2 border-slate-800 pb-6 mb-8 relative z-10">
        <h1 className="text-4xl font-extrabold text-blue-900 tracking-wider mb-2 uppercase font-serif">Dnyandeep Vidyalaya</h1>
        <p className="text-lg text-slate-700 font-semibold mb-1">Recognized by Government of Maharashtra</p>
        <p className="text-sm text-slate-500">123 Education Road, Knowledge City, Maharashtra - 411001</p>
        <div className="mt-4 flex justify-between text-sm font-medium text-slate-700 px-8">
          <p>Registration No: <strong>DY/2023/892</strong></p>
          <p>UDISE No: <strong>27252001234</strong></p>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-10 relative z-10">
        <h2 className="text-2xl font-bold uppercase tracking-widest bg-slate-100 inline-block px-6 py-2 border border-slate-300 rounded shadow-sm">
          Bonafide Certificate
        </h2>
      </div>

      {/* Content */}
      <div className="space-y-8 text-lg leading-relaxed text-justify text-slate-800 relative z-10 font-serif">
        <p>
          This is to certify that Master / Miss <span className="font-bold underline decoration-dotted underline-offset-4 px-2 outline-none focus:bg-blue-50 focus:rounded" contentEditable suppressContentEditableWarning>{fullName}</span> 
          is a bonafide student of this school.
        </p>
        <p>
          He / She is currently studying in standard <span className="font-bold underline decoration-dotted underline-offset-4 px-2 outline-none focus:bg-blue-50 focus:rounded" contentEditable suppressContentEditableWarning>{standard}</span> 
          Division <span className="font-bold underline decoration-dotted underline-offset-4 px-2 outline-none focus:bg-blue-50 focus:rounded" contentEditable suppressContentEditableWarning>{division}</span> during the academic year 
          <span className="font-bold underline decoration-dotted underline-offset-4 px-2 outline-none focus:bg-blue-50 focus:rounded" contentEditable suppressContentEditableWarning>{year}</span>.
        </p>
        <p>
          According to the school General Register, his / her date of birth is 
          <span className="font-bold underline decoration-dotted underline-offset-4 px-2 outline-none focus:bg-blue-50 focus:rounded" contentEditable suppressContentEditableWarning>{dobFormatted}</span> 
          (in words: <span className="font-bold underline decoration-dotted underline-offset-4 px-2 outline-none focus:bg-blue-50 focus:rounded" contentEditable suppressContentEditableWarning>{dobInWords}</span>).
        </p>
        <p>
          His / Her religion is <span className="font-bold underline decoration-dotted underline-offset-4 px-2 outline-none focus:bg-blue-50 focus:rounded" contentEditable suppressContentEditableWarning>{religion}</span> and caste is 
          <span className="font-bold underline decoration-dotted underline-offset-4 px-2 outline-none focus:bg-blue-50 focus:rounded" contentEditable suppressContentEditableWarning>{caste}</span>. 
          To the best of my knowledge and belief, he / she bears a good moral character.
        </p>
      </div>

      {/* Footer / Signatures */}
      <div className="mt-24 flex justify-between items-end relative z-10">
        <div className="text-center">
          <p className="text-slate-500 mb-1">Date: <strong>{new Date().toLocaleDateString('en-GB')}</strong></p>
          <p className="text-slate-500">Place: <strong>Pune</strong></p>
        </div>
        <div className="text-center">
          <div className="w-32 h-32 border-2 border-slate-300 flex items-center justify-center text-slate-400 text-sm mb-4 bg-slate-50 mx-auto rounded">
            School Seal
          </div>
        </div>
        <div className="text-center border-t border-slate-800 pt-2 w-48">
          <p className="font-bold text-slate-800">Headmaster / Principal</p>
          <p className="text-sm text-slate-600">Dnyandeep Vidyalaya</p>
        </div>
      </div>
    </div>
  );
}
