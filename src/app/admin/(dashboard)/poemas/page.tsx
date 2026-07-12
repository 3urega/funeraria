import Link from "next/link";
import { getAllPoemTemplates } from "@/lib/db/queries";

export const metadata = { title: "Admin — Poemas" };

export default async function AdminPoemasPage() {
  const poems = await getAllPoemTemplates();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Poemas</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Catàleg d&apos;obituaris poètics que els familiars poden triar.
          </p>
        </div>
        <Link
          href="/admin/poemas/nueva"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800"
        >
          Nou poema
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-4 py-3 font-medium">Títol</th>
              <th className="px-4 py-3 font-medium">Actiu</th>
              <th className="px-4 py-3 font-medium">Extracte</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {poems.map((poem) => (
              <tr key={poem.id} className="border-t">
                <td className="px-4 py-3 font-medium">{poem.title}</td>
                <td className="px-4 py-3">{poem.isActive ? "Sí" : "No"}</td>
                <td className="max-w-md truncate px-4 py-3 text-zinc-600">
                  {poem.text.split("\n")[0]}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/poemas/${poem.id}`}
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

      {poems.length === 0 && (
        <p className="mt-4 text-zinc-500">Encara no hi ha poemas.</p>
      )}
    </div>
  );
}
