import { getStaffSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StaffSidebar } from "@/components/layout/StaffSidebar";
import { TopNav } from "@/components/layout/TopNav";

export default async function StaffLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ staffId: string }>;
}) {
  const { staffId } = await params;
  
  // Verify session securely
  const sessionStaffId = await getStaffSession();
  
  if (!sessionStaffId || sessionStaffId !== staffId) {
    redirect("/staff");
  }

  // Bypass Next.js Prisma memory cache using raw SQL
  const staffRecords = await prisma.$queryRaw<any[]>`SELECT * FROM "Staff" WHERE "id" = ${staffId} LIMIT 1`;
  const staff = staffRecords && staffRecords.length > 0 ? staffRecords[0] : null;

  if (!staff) {
    redirect("/staff");
  }

  return (
    <div className="min-h-full flex h-screen bg-[#f4f7fe] dark:bg-[#0f172a] overflow-hidden print:h-auto print:overflow-visible print:bg-white transition-colors duration-300 w-full">
      <StaffSidebar staffId={staffId} />
      <div className="flex-1 flex flex-col overflow-hidden print:overflow-visible print:block relative">
        <TopNav />
        {children}
      </div>
    </div>
  );
}
