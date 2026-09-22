import { getNotices } from "@/app/actions/notices";
import NoticesClient from "./NoticesClient";

export const dynamic = "force-dynamic";

export default async function AdminNoticesPage() {
  const notices = await getNotices();

  return (
    <div className="flex-1 overflow-auto p-8 bg-slate-50 dark:bg-slate-950">
      <NoticesClient initialNotices={notices} />
    </div>
  );
}
