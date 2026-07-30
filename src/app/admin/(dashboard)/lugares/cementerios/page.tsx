import Link from "next/link";
import { AdminTableHeader } from "@/components/admin/list/admin-table-header";
import { getAllCemeteries } from "@/lib/db/queries";

export const metadata = { title: "Admin — Cementiris" };

export default async function AdminCemeteriesPage() {
  const cemeteries = await getAllCemeteries();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cementiris</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Catàleg assignable des del formulari d&apos;esquela.
          </p>
        </div>
        <Link
          href="/admin/lugares/cementerios/nueva"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800"
        >
          Nou cementiri
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <AdminTableHeader hint="Nom oficial del cementiri tal com apareix a l'esquela.">
                Nom
              </AdminTableHeader>
              <AdminTableHeader hint="Població on es troba el cementiri.">
                Ciutat
              </AdminTableHeader>
              <AdminTableHeader hint="Si té coordenades GPS, es mostrarà un mapa a la pàgina pública de l'esquela.">
                Geoloc.
              </AdminTableHeader>
              <AdminTableHeader hint="Si té foto, es mostra a la secció de llocs de l'esquela.">
                Foto
              </AdminTableHeader>
              <AdminTableHeader hint="Obrir el formulari d'edició del cementiri." />
            </tr>
          </thead>
          <tbody>
            {cemeteries.map((cemetery) => (
              <tr key={cemetery.id} className="border-t">
                <td className="px-4 py-3">{cemetery.name}</td>
                <td className="px-4 py-3">{cemetery.city ?? "—"}</td>
                <td className="px-4 py-3">
                  {cemetery.latitude != null ? "Sí" : "—"}
                </td>
                <td className="px-4 py-3">{cemetery.imagePath ? "Sí" : "—"}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/lugares/cementerios/${cemetery.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {cemeteries.length === 0 && (
        <p className="mt-4 text-zinc-500">Encara no hi ha cementiris.</p>
      )}
    </div>
  );
}
