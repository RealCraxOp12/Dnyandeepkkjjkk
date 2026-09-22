import { getNotes } from "@/app/actions/academicMaterials";
import NotesClient from "./NotesClient";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminNotesPage() {
  const notes = await getNotes();
  
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
      <NotesClient initialNotes={notes} classes={classes} />
    </div>
  );
}
