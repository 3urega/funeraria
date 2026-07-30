import { AdminDashboardOverview } from "@/components/admin/admin-dashboard-overview";
import { getAdminPendingStats, getAllObituaries } from "@/lib/db/queries";

export const metadata = {
  title: "Admin — Dashboard",
};

export default async function AdminDashboardPage() {
  const [all, { pendingFamilyPhotos, unreviewedMessages }] = await Promise.all([
    getAllObituaries(),
    getAdminPendingStats(),
  ]);
  const active = all.filter((o) => o.isActive).length;
  const visible = all.filter((o) => o.isVisible).length;

  return (
    <AdminDashboardOverview
      total={all.length}
      active={active}
      visible={visible}
      pendingFamilyPhotos={pendingFamilyPhotos}
      unreviewedMessages={unreviewedMessages}
    />
  );
}
