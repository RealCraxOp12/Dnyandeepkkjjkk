import { prisma } from "@/lib/prisma";
import { StudentRegistrationForm } from "@/components/forms/StudentRegistrationForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const student = await prisma.student.findUnique({
    where: { id }
  });

  if (!student) {
    notFound();
  }

  // Serialize Date objects to strings for the Client Component prop
  const serializedStudent = {
    ...student,
    dateOfBirth: student.dateOfBirth ? student.dateOfBirth.toISOString() : null,
    dateOfAdmission: student.dateOfAdmission ? student.dateOfAdmission.toISOString() : null,
    createdAt: student.createdAt.toISOString(),
    updatedAt: student.updatedAt.toISOString(),
  };

  return (
    <div className="flex-1 overflow-auto p-8 bg-transparent">
      <div className="max-w-4xl mx-auto">
        <Link href="/students" prefetch={true} className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium transition-colors mb-6">
          <ArrowLeft className="w-5 h-5" /> Back to Students
        </Link>
        <StudentRegistrationForm initialData={serializedStudent} />
      </div>
    </div>
  );
}
