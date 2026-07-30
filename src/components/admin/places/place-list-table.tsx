"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminBooleanToggle } from "@/components/admin/list/admin-boolean-toggle";
import { AdminDataTable } from "@/components/admin/list/admin-data-table";
import type { AdminDataTableColumn } from "@/components/admin/list/admin-data-table";
import type { Cemetery, Church, WakeRoom } from "@/lib/db/schema";

export type PlaceKind = "church" | "cemetery" | "wake_room";

type GeoPlace = Church | Cemetery;

type Props =
  | {
      kind: "church" | "cemetery";
      items: GeoPlace[];
    }
  | {
      kind: "wake_room";
      items: WakeRoom[];
    };

const GEO_COLUMNS: AdminDataTableColumn[] = [
  {
    key: "name",
    label: "Nom",
    hint: "Nom oficial del lloc tal com apareix a l'esquela.",
  },
  {
    key: "city",
    label: "Ciutat",
    hint: "Població on es troba el lloc.",
  },
  {
    key: "geoloc",
    label: "Geoloc.",
    hint: "Si té coordenades GPS, es mostrarà un mapa a la pàgina pública de l'esquela.",
  },
  {
    key: "photo",
    label: "Foto",
    hint: "Si té foto, es mostra a la secció de llocs de l'esquela.",
  },
  {
    key: "actions",
    label: "Accions",
    className: "text-right",
    hint: "Editar o eliminar el lloc del catàleg.",
  },
];

const WAKE_COLUMNS: AdminDataTableColumn[] = [
  {
    key: "name",
    label: "Nom",
    hint: "Nom de la sala de vetlla tal com apareix a la web i a l'esquela.",
  },
  {
    key: "active",
    label: "Activa",
    hint: "Si està activa, la sala apareix a /sales-de-vetlla i es pot assignar a esqueles.",
  },
  {
    key: "photo",
    label: "Foto",
    hint: "Foto de la sala visible a la pàgina pública de sales de vetlla.",
  },
  {
    key: "actions",
    label: "Accions",
    className: "text-right",
    hint: "Editar o eliminar la sala del catàleg.",
  },
];

const CONFIG = {
  church: {
    apiBase: "/api/admin/churches",
    editBase: "/admin/lugares/iglesias",
    deleteConfirm: (name: string) =>
      `Eliminar l'església «${name}»? Aquesta acció no es pot desfer.`,
    entityLabel: "església",
  },
  cemetery: {
    apiBase: "/api/admin/cemeteries",
    editBase: "/admin/lugares/cementerios",
    deleteConfirm: (name: string) =>
      `Eliminar el cementiri «${name}»? Aquesta acció no es pot desfer.`,
    entityLabel: "cementiri",
  },
  wake_room: {
    apiBase: "/api/admin/wake-rooms",
    editBase: "/admin/lugares/salas-vetlla",
    deleteConfirm: (name: string) =>
      `Eliminar la sala «${name}»? Aquesta acció no es pot desfer.`,
    entityLabel: "sala",
  },
} as const;

export function PlaceListTable(props: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const kind = props.kind;
  const items = props.items;
  const config = CONFIG[kind];
  const columns = kind === "wake_room" ? WAKE_COLUMNS : GEO_COLUMNS;

  async function onDelete(id: string, name: string) {
    if (!window.confirm(config.deleteConfirm(name))) return;

    setDeletingId(id);
    setError(null);

    const res = await fetch(`${config.apiBase}/${id}`, { method: "DELETE" });

    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;
      if (data?.error === "HAS_LINKED_OBITUARIES") {
        setError(
          "No es pot eliminar: hi ha esqueles que utilitzen aquest lloc.",
        );
      } else {
        setError(`No s'ha pogut eliminar ${config.entityLabel}.`);
      }
      setDeletingId(null);
      return;
    }

    setDeletingId(null);
    router.refresh();
  }

  async function toggleWakeRoomActive(id: string, isActive: boolean) {
    setUpdatingId(id);
    setError(null);

    const res = await fetch(`${config.apiBase}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });

    if (!res.ok) {
      setError("No s'ha pogut actualitzar l'estat de la sala.");
      setUpdatingId(null);
      throw new Error("PATCH failed");
    }

    setUpdatingId(null);
    router.refresh();
  }

  function renderActions(id: string, name: string) {
    return (
      <div className="flex flex-wrap items-center justify-end gap-3">
        <Link
          href={`${config.editBase}/${id}`}
          className="text-blue-600 hover:underline"
        >
          Editar
        </Link>
        <button
          type="button"
          onClick={() => void onDelete(id, name)}
          disabled={deletingId === id}
          className="text-red-600 hover:underline disabled:opacity-50"
        >
          {deletingId === id ? "Eliminant…" : "Eliminar"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <AdminDataTable
        columns={columns}
        isEmpty={items.length === 0}
        emptyMessage="Cap resultat amb aquests filtres."
      >
        {kind === "wake_room"
          ? (items as WakeRoom[]).map((room) => (
              <tr key={room.id} className="border-t">
                <td className="px-4 py-3 font-medium">{room.name}</td>
                <td className="px-4 py-3">
                  <AdminBooleanToggle
                    checked={room.isActive}
                    disabled={updatingId === room.id}
                    ariaLabel={`Sala ${room.name}: ${room.isActive ? "activa" : "inactiva"}`}
                    onToggle={(next) => toggleWakeRoomActive(room.id, next)}
                  />
                </td>
                <td className="px-4 py-3">{room.imagePath ? "Sí" : "—"}</td>
                <td className="px-4 py-3 text-right">
                  {renderActions(room.id, room.name)}
                </td>
              </tr>
            ))
          : (items as GeoPlace[]).map((place) => (
              <tr key={place.id} className="border-t">
                <td className="px-4 py-3 font-medium">{place.name}</td>
                <td className="px-4 py-3">{place.city ?? "—"}</td>
                <td className="px-4 py-3">
                  {place.latitude != null ? "Sí" : "—"}
                </td>
                <td className="px-4 py-3">{place.imagePath ? "Sí" : "—"}</td>
                <td className="px-4 py-3 text-right">
                  {renderActions(place.id, place.name)}
                </td>
              </tr>
            ))}
      </AdminDataTable>
    </div>
  );
}
