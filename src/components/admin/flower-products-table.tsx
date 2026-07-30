"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminBooleanToggle } from "@/components/admin/list/admin-boolean-toggle";
import { AdminDataTable } from "@/components/admin/list/admin-data-table";
import type { FlowerProduct } from "@/lib/db/schema";
import { formatPriceCents } from "@/lib/flowers/types";

type Props = {
  products: FlowerProduct[];
  imageUrls: Record<string, string | null>;
};

const COLUMNS = [
  {
    key: "photo",
    label: "Foto",
    hint: "Imatge del producte al catàleg de flors.",
  },
  {
    key: "name",
    label: "Nom",
    hint: "Nom del ram o producte visible per als visitants a l'esquela.",
  },
  {
    key: "price",
    label: "Preu",
    hint: "Preu de venda en la moneda configurada.",
  },
  {
    key: "active",
    label: "Actiu",
    hint: "Només els productes actius es mostren al checkout de flors de l'esquela.",
  },
  {
    key: "sortOrder",
    label: "Ordre",
    hint: "Ordre de visualització al catàleg (menor número = més amunt).",
  },
  {
    key: "actions",
    label: "",
    className: "text-right",
    hint: "Obrir el formulari d'edició del producte.",
  },
];

export function FlowerProductsTable({ products, imageUrls }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function toggleActive(id: string, isActive: boolean) {
    setUpdatingId(id);
    setError(null);

    const res = await fetch(`/api/admin/flower-products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });

    if (!res.ok) {
      setError("No s'ha pogut actualitzar l'estat del producte.");
      setUpdatingId(null);
      throw new Error("PATCH failed");
    }

    setUpdatingId(null);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <AdminDataTable
        columns={COLUMNS}
        isEmpty={products.length === 0}
        emptyMessage="Cap resultats amb aquests filtres."
      >
        {products.map((product) => {
          const imageUrl = imageUrls[product.id];

          return (
            <tr key={product.id} className="border-t">
              <td className="px-4 py-3">
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="h-12 w-12 rounded object-cover"
                  />
                ) : (
                  "—"
                )}
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/admin/flores/${product.id}`}
                  className="font-medium text-zinc-900 hover:underline"
                >
                  {product.name}
                </Link>
              </td>
              <td className="px-4 py-3">
                {formatPriceCents(product.priceCents, product.currency)}
              </td>
              <td className="px-4 py-3">
                <AdminBooleanToggle
                  checked={product.isActive}
                  disabled={updatingId === product.id}
                  ariaLabel={`Producte ${product.name}: ${product.isActive ? "actiu" : "inactiu"}`}
                  onToggle={(next) => toggleActive(product.id, next)}
                />
              </td>
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
          );
        })}
      </AdminDataTable>
    </div>
  );
}
