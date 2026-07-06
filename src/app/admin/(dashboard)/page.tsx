import { getAllObituaries } from "@/lib/db/queries";

export const metadata = {
  title: "Admin — Dashboard",
};

export default async function AdminDashboardPage() {
  const all = await getAllObituaries();
  const active = all.filter((o) => o.isActive).length;
  const visible = all.filter((o) => o.isVisible).length;

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-3">
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
    </div>
  );
}
