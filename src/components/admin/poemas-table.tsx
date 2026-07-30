"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminBooleanToggle } from "@/components/admin/list/admin-boolean-toggle";
import { AdminDataTable } from "@/components/admin/list/admin-data-table";
import type { PoemTemplate } from "@/lib/db/schema";

type Props = {
  poems: PoemTemplate[];
};

const COLUMNS = [
  { key: "title", label: "Títol" },
  { key: "active", label: "Actiu" },
  { key: "excerpt", label: "Extracte", className: "max-w-md" },
  { key: "actions", label: "", className: "text-right" },
];

export function PoemasTable({ poems }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function toggleActive(id: string, isActive: boolean) {
    setUpdatingId(id);
    setError(null);

    const res = await fetch(`/api/admin/poem-templates/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });

    if (!res.ok) {
      setError("No s'ha pogut actualitzar l'estat del poema.");
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
        isEmpty={poems.length === 0}
        emptyMessage="Cap resultats amb aquests filtres."
      >
        {poems.map((poem) => (
          <tr key={poem.id} className="border-t">
            <td className="px-4 py-3">
              <Link
                href={`/admin/poemas/${poem.id}`}
                className="font-medium text-zinc-900 hover:underline"
              >
                {poem.title}
              </Link>
            </td>
            <td className="px-4 py-3">
              <AdminBooleanToggle
                checked={poem.isActive}
                disabled={updatingId === poem.id}
                ariaLabel={`Poema ${poem.title}: ${poem.isActive ? "actiu" : "inactiu"}`}
                onToggle={(next) => toggleActive(poem.id, next)}
              />
            </td>
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
      </AdminDataTable>
    </div>
  );
}
