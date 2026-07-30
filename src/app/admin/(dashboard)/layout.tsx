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
    <div className="flex min-h-screen">
      <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col border-r border-zinc-800 bg-zinc-900 p-4 text-white">
        <div className="shrink-0">
          <p className="mb-1 text-xs text-zinc-400">{brandName}</p>
          <p className="mb-6 font-semibold">Admin</p>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto text-sm">
          <Link href="/admin" className="rounded px-2 py-1.5 hover:bg-zinc-800">
            Dashboard
          </Link>
          <Link
            href="/admin/esquelas"
            className="rounded px-2 py-1.5 hover:bg-zinc-800"
          >
            Esquelas
          </Link>
          <Link
            href="/admin/lugares/iglesias"
            className="rounded px-2 py-1.5 hover:bg-zinc-800"
          >
            Esglésies
          </Link>
          <Link
            href="/admin/lugares/cementerios"
            className="rounded px-2 py-1.5 hover:bg-zinc-800"
          >
            Cementiris
          </Link>
          <Link
            href="/admin/lugares/salas-vetlla"
            className="rounded px-2 py-1.5 hover:bg-zinc-800"
          >
            Sales de vetlla
          </Link>
          <Link
            href="/admin/flores"
            className="rounded px-2 py-1.5 hover:bg-zinc-800"
          >
            Flors
          </Link>
          <Link
            href="/admin/flores/comandas"
            className="rounded px-2 py-1.5 hover:bg-zinc-800"
          >
            Comandes
          </Link>
          <Link
            href="/admin/poemas"
            className="rounded px-2 py-1.5 hover:bg-zinc-800"
          >
            Poemas
          </Link>
          <Link
            href="/admin/configuracion"
            className="rounded px-2 py-1.5 hover:bg-zinc-800"
          >
            Configuració
          </Link>
          <Link
            href="/admin/contenido/home"
            className="rounded px-2 py-1.5 hover:bg-zinc-800"
          >
            Contingut home
          </Link>
          <Link
            href="/"
            className="mt-3 rounded px-2 py-1.5 text-zinc-400 hover:bg-zinc-800"
          >
            ← Web pública
          </Link>
        </nav>

        <div className="mt-4 shrink-0 border-t border-zinc-800 pt-4">
          <AdminLogoutButton />
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-8">{children}</main>
    </div>
  );
}
