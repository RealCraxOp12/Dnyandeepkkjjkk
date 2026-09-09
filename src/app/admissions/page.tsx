import { StudentRegistrationForm } from "@/components/forms/StudentRegistrationForm";
import { BulkStudentUpload } from "@/components/forms/BulkStudentUpload";

export default function AdmissionsPage() {
  return (
    <div className="flex-1 overflow-auto p-8 bg-transparent">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-8 transition-colors duration-300">
          <BulkStudentUpload />
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-8 transition-colors duration-300">
          <StudentRegistrationForm />
        </div>
      </div>
    </div>
  );
}
