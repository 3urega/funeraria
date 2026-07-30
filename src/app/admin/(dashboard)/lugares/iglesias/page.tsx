import Link from "next/link";
import { AdminTableHeader } from "@/components/admin/list/admin-table-header";
import { getAllChurches } from "@/lib/db/queries";

export const metadata = { title: "Admin — Esglésies" };

export default async function AdminChurchesPage() {
  const churches = await getAllChurches();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Esglésies</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Catàleg assignable des del formulari d&apos;esquela.
          </p>
        </div>
        <Link
          href="/admin/lugares/iglesias/nueva"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800"
        >
          Nova església
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <AdminTableHeader hint="Nom oficial de l'església tal com apareix a l'esquela.">
                Nom
              </AdminTableHeader>
              <AdminTableHeader hint="Població on es troba l'església.">
                Ciutat
              </AdminTableHeader>
              <AdminTableHeader hint="Si té coordenades GPS, es mostrarà un mapa a la pàgina pública de l'esquela.">
                Geoloc.
              </AdminTableHeader>
              <AdminTableHeader hint="Si té foto, es mostra a la secció de llocs de l'esquela.">
                Foto
              </AdminTableHeader>
              <AdminTableHeader hint="Obrir el formulari d'edició de l'església." />
            </tr>
          </thead>
          <tbody>
            {churches.map((church) => (
              <tr key={church.id} className="border-t">
                <td className="px-4 py-3">{church.name}</td>
                <td className="px-4 py-3">{church.city ?? "—"}</td>
                <td className="px-4 py-3">
                  {church.latitude != null ? "Sí" : "—"}
                </td>
                <td className="px-4 py-3">{church.imagePath ? "Sí" : "—"}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/lugares/iglesias/${church.id}`}
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

      {churches.length === 0 && (
        <p className="mt-4 text-zinc-500">Encara no hi ha esglésies.</p>
      )}
    </div>
  );
}
