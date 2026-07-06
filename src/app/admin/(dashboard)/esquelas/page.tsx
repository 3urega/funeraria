import Link from "next/link";
import { getAllObituaries } from "@/lib/db/queries";

export const metadata = {
  title: "Admin — Esquelas",
};

export default async function AdminEsquelasPage() {
  const obituaries = await getAllObituaries();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Esquelas</h1>
        <Link
          href="/admin/esquelas/nueva"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800"
        >
          Nova esquela
        </Link>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Código</th>
              <th className="px-4 py-3 font-medium">Activa</th>
              <th className="px-4 py-3 font-medium">Visible</th>
              <th className="px-4 py-3 font-medium">Lista</th>
              <th className="px-4 py-3 font-medium">Foto familiar</th>
              <th className="px-4 py-3 font-medium">Accions</th>
            </tr>
          </thead>
          <tbody>
            {obituaries.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/esquelas/${o.id}`}
                    className="font-medium text-zinc-900 hover:underline"
                  >
                    {o.name}
                  </Link>
                </td>
                <td className="px-4 py-3 font-mono text-xs">{o.visitCode}</td>
                <td className="px-4 py-3">{o.isActive ? "Sí" : "No"}</td>
                <td className="px-4 py-3">{o.isVisible ? "Sí" : "No"}</td>
                <td className="px-4 py-3">{o.isReady ? "Sí" : "No"}</td>
                <td className="px-4 py-3">
                  {o.familyImageStatus === "pending" ? (
                    <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                      Pendent retocar
                    </span>
                  ) : o.familyImageStatus === "rejected" ? (
                    <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                      No utilitzable
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/esquelas/${o.id}`}
                    className="text-sm text-zinc-600 hover:text-zinc-900 hover:underline"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {obituaries.length === 0 && (
        <p className="mt-4 text-zinc-500">
          Sense esquelas.{" "}
          <Link href="/admin/esquelas/nueva" className="underline">
            Crear la primera
          </Link>{" "}
          o executa <code className="text-xs">npm run db:seed</code>.
        </p>
      )}
    </div>
  );
}
