"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AdminDataTable } from "@/components/admin/list/admin-data-table";
import type { AdminDataTableColumn } from "@/components/admin/list/admin-data-table";
import type { FlowerOrderRow } from "@/lib/db/queries";
import {
  FLOWER_ORDER_STATUSES,
  FLOWER_ORDER_STATUS_LABELS,
  canTransitionFlowerOrderStatus,
  formatPriceCents,
  type FlowerOrderStatus,
} from "@/lib/flowers/types";

type Props = {
  orders: FlowerOrderRow[];
  showObituary?: boolean;
  emptyMessage?: string;
};

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("ca-ES", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function FlowerOrdersTable({
  orders,
  showObituary = true,
  emptyMessage = "Cap comanda encara.",
}: Props) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const columns = useMemo((): AdminDataTableColumn[] => {
    const cols: AdminDataTableColumn[] = [
      {
        key: "date",
        label: "Data",
        hint: "Data i hora en què es va registrar la comanda.",
      },
    ];
    if (showObituary) {
      cols.push({
        key: "obituary",
        label: "Difunt",
        hint: "Esquela / difunt al qual s'envien les flors.",
      });
    }
    cols.push(
      {
        key: "product",
        label: "Producte",
        hint: "Producte de flors comprat des del catàleg.",
      },
      {
        key: "dedication",
        label: "Dedicatòria",
        className: "max-w-xs",
        hint: "Text personalitzat que acompanya el ram enviat a la família.",
      },
      {
        key: "buyer",
        label: "Comprador",
        hint: "Nom, correu i telèfon de qui ha fet la comanda.",
      },
      {
        key: "total",
        label: "Import",
        hint: "Import total pagat per la comanda.",
      },
      {
        key: "status",
        label: "Estat",
        hint: "Estat del procés (pendent, confirmada, lliurada…). Canvia'l quan correspongui.",
      },
    );
    return cols;
  }, [showObituary]);

  async function changeStatus(orderId: string, current: string, next: string) {
    if (next === current) return;
    setUpdatingId(orderId);
    setError(null);

    const res = await fetch(`/api/admin/flower-orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });

    if (!res.ok) {
      setError("No s'ha pogut actualitzar l'estat.");
      setUpdatingId(null);
      return;
    }

    setUpdatingId(null);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <AdminDataTable
        columns={columns}
        isEmpty={orders.length === 0}
        emptyMessage={emptyMessage}
      >
        {orders.map(({ order, product, obituary }) => {
          const currentStatus = order.status as FlowerOrderStatus;
          const allowedNext = FLOWER_ORDER_STATUSES.filter(
            (s) =>
              s !== currentStatus &&
              canTransitionFlowerOrderStatus(currentStatus, s),
          );

          return (
            <tr key={order.id} className="border-t align-top">
              <td className="px-4 py-3 whitespace-nowrap">
                {formatDate(order.createdAt)}
              </td>
              {showObituary && (
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/esquelas/${obituary.id}?tab=flowers`}
                    className="font-medium text-zinc-900 hover:underline"
                  >
                    {obituary.name}
                  </Link>
                </td>
              )}
              <td className="px-4 py-3">{product.name}</td>
              <td className="max-w-xs px-4 py-3">
                <p className="line-clamp-3">{order.dedicationText}</p>
              </td>
              <td className="px-4 py-3">
                <p className="font-medium">{order.buyerName}</p>
                <p className="text-xs text-zinc-500">{order.buyerEmail}</p>
                <p className="text-xs text-zinc-500">{order.buyerPhone}</p>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {formatPriceCents(order.totalCents)}
              </td>
              <td className="px-4 py-3">
                <p className="mb-1 font-medium">
                  {FLOWER_ORDER_STATUS_LABELS[currentStatus] ?? order.status}
                </p>
                {allowedNext.length > 0 && (
                  <select
                    className="rounded border border-zinc-300 px-2 py-1 text-xs"
                    disabled={updatingId === order.id}
                    defaultValue=""
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value) {
                        void changeStatus(order.id, order.status, value);
                        e.target.value = "";
                      }
                    }}
                  >
                    <option value="">Canviar a…</option>
                    {allowedNext.map((status) => (
                      <option key={status} value={status}>
                        {FLOWER_ORDER_STATUS_LABELS[status]}
                      </option>
                    ))}
                  </select>
                )}
              </td>
            </tr>
          );
        })}
      </AdminDataTable>
    </div>
  );
}
