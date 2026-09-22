import { getNotes } from "@/app/actions/academicMaterials";
import NotesClient from "@/app/notes/NotesClient";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function StaffNotesPage({ params }: { params: Promise<{ staffId: string }> }) {
  const resolvedParams = await params;
  const staffId = resolvedParams.staffId;
  const notes = await getNotes();
  
  let lockedSubject: string | undefined = undefined;
  
  try {
    const staff = await prisma.staff.findUnique({
      where: { id: staffId },
      select: { assignedSubject: true }
    });
    if (staff?.assignedSubject) {
      lockedSubject = staff.assignedSubject;
    }
  } catch (error) {
    // Fallback for db hang
    const result = await prisma.$queryRaw`SELECT "assignedSubject" FROM "Staff" WHERE id = ${staffId}`;
    if (Array.isArray(result) && result.length > 0 && (result[0] as any).assignedSubject) {
      lockedSubject = (result[0] as any).assignedSubject;
    }
  }

  const students = await prisma.student.findMany({
    where: { activeStatus: true },
    select: { currentClass: true },
    distinct: ['currentClass'],
  });

  let classes = students
    .map(s => s.currentClass)
    .filter(Boolean) as string[];

  if (classes.length === 0) {
    classes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  }

  classes.sort((a, b) => {
    const numA = parseInt(a) || 0;
    const numB = parseInt(b) || 0;
    if (numA !== numB) return numA - numB;
    return a.localeCompare(b);
  });

  return (
    <div className="flex-1 overflow-auto p-8 bg-slate-50 dark:bg-slate-950">
      <NotesClient initialNotes={notes} classes={classes} lockedSubject={lockedSubject} />
    </div>
  );
}
