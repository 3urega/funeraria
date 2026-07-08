import Link from "next/link";
import { getAllFlowerProducts } from "@/lib/db/queries";
import { getStorage } from "@/lib/storage";
import { formatPriceCents } from "@/lib/flowers/types";

export const metadata = { title: "Admin — Flors" };

export default async function AdminFloresPage() {
  const products = await getAllFlowerProducts();
  const storage = getStorage();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Flors</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Catàleg de productes per a la venda des de les esqueles.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/flores/comandas"
            className="rounded-md border px-4 py-2 text-sm hover:bg-zinc-50"
          >
            Comandes
          </Link>
          <Link
            href="/admin/flores/nueva"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800"
          >
            Nou producte
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-4 py-3 font-medium">Foto</th>
              <th className="px-4 py-3 font-medium">Nom</th>
              <th className="px-4 py-3 font-medium">Preu</th>
              <th className="px-4 py-3 font-medium">Actiu</th>
              <th className="px-4 py-3 font-medium">Ordre</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="px-4 py-3">
                  {product.imagePath ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={storage.getPublicUrl(product.imagePath)}
                      alt={product.name}
                      className="h-12 w-12 rounded object-cover"
                    />
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3">
                  {formatPriceCents(product.priceCents, product.currency)}
                </td>
                <td className="px-4 py-3">{product.isActive ? "Sí" : "No"}</td>
                <td className="px-4 py-3">{product.sortOrder}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/flores/${product.id}`}
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

      {products.length === 0 && (
        <p className="mt-4 text-zinc-500">Encara no hi ha productes.</p>
      )}
    </div>
  );
}
