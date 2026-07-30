"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminBooleanToggle } from "@/components/admin/list/admin-boolean-toggle";
import { AdminDataTable } from "@/components/admin/list/admin-data-table";
import type { Obituary } from "@/lib/db/schema";

type Props = {
  obituaries: Obituary[];
  unreviewedCounts: Record<string, number>;
};

type FlagField = "isActive" | "isVisible" | "isReady";

const COLUMNS = [
  {
    key: "name",
    label: "Nom",
    hint: "Nom del difunt tal com apareix a l'esquela impresa i a la web.",
  },
  {
    key: "code",
    label: "Codi",
    hint: "Codi de visita per a familiars i visitants (zona familiar i accés privat). Es pot copiar des d'aquí.",
  },
  {
    key: "active",
    label: "Activa",
    hint: "Esquela operativa al sistema. Inactiva: encara no es pot usar o s'ha desactivat temporalment.",
  },
  {
    key: "visible",
    label: "Visible",
    hint: "Si és visible, l'esquela apareix al llistat públic de la web (/esquelas).",
  },
  {
    key: "ready",
    label: "Llesta",
    hint: "Esquela llesta i validada per publicar o compartir amb la família.",
  },
  {
    key: "photo",
    label: "Foto familiar",
    hint: "Estat de la foto enviada pel familiar: pendent que l'empleat la retoci, o rebutjada si no és utilitzable.",
  },
  {
    key: "messages",
    label: "Missatges",
    hint: "Missatges conmemoratius de visitants que encara no s'han revisat des del panell de l'esquela.",
  },
  {
    key: "actions",
    label: "Accions",
    className: "text-right",
    hint: "Editar l'esquela o obrir la pàgina pública en una pestanya nova.",
  },
];

export function EsquelasTable({ obituaries, unreviewedCounts }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function toggleFlag(id: string, field: FlagField, value: boolean) {
    const key = `${id}:${field}`;
    setUpdatingKey(key);
    setError(null);

    const res = await fetch(`/api/admin/esquelas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });

    if (!res.ok) {
      setError("No s'ha pogut actualitzar l'estat de l'esquela.");
      setUpdatingKey(null);
      throw new Error("PATCH failed");
    }

    setUpdatingKey(null);
    router.refresh();
  }

  async function copyCode(id: string, code: string) {
    setError(null);
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = code;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      } catch {
        setError("No s'ha pogut copiar el codi.");
        return;
      }
    }
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <AdminDataTable
        columns={COLUMNS}
        isEmpty={obituaries.length === 0}
        emptyMessage="Cap resultat amb aquests filtres."
      >
        {obituaries.map((o) => {
          const pendingMessages = unreviewedCounts[o.id] ?? 0;
          return (
            <tr key={o.id} className="border-t">
              <td className="px-4 py-3">
                <Link
                  href={`/admin/esquelas/${o.id}`}
                  className="font-medium text-zinc-900 hover:underline"
                >
                  {o.name}
                </Link>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs">{o.visitCode}</span>
                  <button
                    type="button"
                    onClick={() => copyCode(o.id, o.visitCode)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    {copiedId === o.id ? "Copiat" : "Copiar"}
                  </button>
                </div>
              </td>
              <td className="px-4 py-3">
                <AdminBooleanToggle
                  checked={o.isActive}
                  disabled={updatingKey === `${o.id}:isActive`}
                  ariaLabel={`Esquela ${o.name}: ${o.isActive ? "activa" : "inactiva"}`}
                  onToggle={(next) => toggleFlag(o.id, "isActive", next)}
                />
              </td>
              <td className="px-4 py-3">
                <AdminBooleanToggle
                  checked={o.isVisible}
                  disabled={updatingKey === `${o.id}:isVisible`}
                  ariaLabel={`Esquela ${o.name}: ${o.isVisible ? "visible" : "no visible"}`}
                  onToggle={(next) => toggleFlag(o.id, "isVisible", next)}
                />
              </td>
              <td className="px-4 py-3">
                <AdminBooleanToggle
                  checked={o.isReady}
                  disabled={updatingKey === `${o.id}:isReady`}
                  ariaLabel={`Esquela ${o.name}: ${o.isReady ? "llesta" : "no llesta"}`}
                  onToggle={(next) => toggleFlag(o.id, "isReady", next)}
                />
              </td>
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
                {pendingMessages > 0 ? (
                  <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                    {pendingMessages} pendent
                    {pendingMessages === 1 ? "" : "s"}
                  </span>
                ) : (
                  "—"
                )}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex flex-wrap items-center justify-end gap-3">
                  <Link
                    href={`/admin/esquelas/${o.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Editar
                  </Link>
                  <a
                    href={`/esquelas/${o.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Veure web
                  </a>
                </div>
              </td>
            </tr>
          );
        })}
      </AdminDataTable>
    </div>
  );
}
