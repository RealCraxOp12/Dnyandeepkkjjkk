import { getNotices } from "@/app/actions/notices";
import NoticesClient from "@/app/notices/NoticesClient";

export const dynamic = "force-dynamic";

export default async function StaffNoticesPage() {
  const notices = await getNotices();

  return (
    <div className="flex-1 overflow-auto p-8 bg-slate-50 dark:bg-slate-950">
      <NoticesClient initialNotices={notices} />
    </div>
  );
}
