import Link from "next/link";
import { AdminLogoutButton } from "@/components/admin/logout-button";
import { getTenantBranding } from "@/lib/site/tenant";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { brandName } = await getTenantBranding();

  return (
    <div className="flex min-h-full">
      <aside className="w-56 shrink-0 border-r border-zinc-200 bg-zinc-900 p-4 text-white">
        <p className="mb-1 text-xs text-zinc-400">{brandName}</p>
        <p className="mb-6 font-semibold">Admin</p>
        <nav className="flex flex-col gap-2 text-sm">
          <Link href="/admin" className="rounded px-2 py-1 hover:bg-zinc-800">
            Dashboard
          </Link>
          <Link
            href="/admin/esquelas"
            className="rounded px-2 py-1 hover:bg-zinc-800"
          >
            Esquelas
          </Link>
          <Link
            href="/admin/lugares/iglesias"
            className="rounded px-2 py-1 hover:bg-zinc-800"
          >
            Esglésies
          </Link>
          <Link
            href="/admin/lugares/cementerios"
            className="rounded px-2 py-1 hover:bg-zinc-800"
          >
            Cementiris
          </Link>
          <Link
            href="/admin/lugares/salas-vetlla"
            className="rounded px-2 py-1 hover:bg-zinc-800"
          >
            Sales de vetlla
          </Link>
          <Link
            href="/admin/flores"
            className="rounded px-2 py-1 hover:bg-zinc-800"
          >
            Flors
          </Link>
          <Link
            href="/"
            className="mt-4 rounded px-2 py-1 text-zinc-400 hover:bg-zinc-800"
          >
            ← Web pública
          </Link>
        </nav>
        <div className="mt-8">
          <AdminLogoutButton />
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
