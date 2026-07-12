import Link from "next/link";
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
    <div>
      <h1 className="mb-8 text-2xl font-bold">Dashboard</h1>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-zinc-500">Total esquelas</p>
          <p className="text-3xl font-bold">{all.length}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-zinc-500">Actives</p>
          <p className="text-3xl font-bold">{active}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-zinc-500">Públiques</p>
          <p className="text-3xl font-bold">{visible}</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/esquelas"
          className="rounded-lg border border-amber-200 bg-amber-50 p-4 transition hover:border-amber-300"
        >
          <p className="text-sm text-amber-800">Fotos familiars pendents</p>
          <p className="text-3xl font-bold text-amber-900">
            {pendingFamilyPhotos}
          </p>
          <p className="mt-1 text-xs text-amber-700">
            Retocar i publicar des de cada esquela
          </p>
        </Link>
        <Link
          href="/admin/esquelas"
          className="rounded-lg border border-amber-200 bg-amber-50 p-4 transition hover:border-amber-300"
        >
          <p className="text-sm text-amber-800">Missatges sense revisar</p>
          <p className="text-3xl font-bold text-amber-900">
            {unreviewedMessages}
          </p>
          <p className="mt-1 text-xs text-amber-700">
            Revisar a la pestanya Missatges de cada esquela
          </p>
        </Link>
      </div>
    </div>
  );
}
