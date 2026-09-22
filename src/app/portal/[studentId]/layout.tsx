import { getParentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PortalLayoutClient from "@/components/portal/PortalLayoutClient";

export default async function PortalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  
  // Authorization Check
  const sessionStudentId = await getParentSession();
  
  if (!sessionStudentId) {
    redirect("/portal"); // Not logged in
  }
  
  if (sessionStudentId !== studentId) {
    redirect(`/portal/${sessionStudentId}`);
  }

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { firstName: true, surname: true }
  });

  if (!student) {
    redirect("/portal");
  }

  return (
    <PortalLayoutClient studentId={studentId} studentName={`${student.firstName} ${student.surname}`}>
      {children}
    </PortalLayoutClient>
  );
}
