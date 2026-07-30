import Link from "next/link";
import { AdminTableHeader } from "@/components/admin/list/admin-table-header";
import { getAllWakeRooms } from "@/lib/db/queries";

export const metadata = { title: "Admin — Sales de vetlla" };

export default async function AdminWakeRoomsPage() {
  const rooms = await getAllWakeRooms();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sales de vetlla</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Nom, foto i text — visibles a la web pública si estan actives.
          </p>
        </div>
        <Link
          href="/admin/lugares/salas-vetlla/nueva"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800"
        >
          Nova sala
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <AdminTableHeader hint="Nom de la sala de vetlla tal com apareix a la web i a l'esquela.">
                Nom
              </AdminTableHeader>
              <AdminTableHeader hint="Si està activa, la sala apareix a /sales-de-vetlla i es pot assignar a esqueles.">
                Activa
              </AdminTableHeader>
              <AdminTableHeader hint="Foto de la sala visible a la pàgina pública de sales de vetlla.">
                Foto
              </AdminTableHeader>
              <AdminTableHeader hint="Obrir el formulari d'edició de la sala." />
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="border-t">
                <td className="px-4 py-3">{room.name}</td>
                <td className="px-4 py-3">{room.isActive ? "Sí" : "No"}</td>
                <td className="px-4 py-3">{room.imagePath ? "Sí" : "—"}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/lugares/salas-vetlla/${room.id}`}
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

      {rooms.length === 0 && (
        <p className="mt-4 text-zinc-500">Encara no hi ha sales de vetlla.</p>
      )}
    </div>
  );
}
