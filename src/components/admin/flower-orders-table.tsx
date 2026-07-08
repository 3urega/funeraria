"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  FLOWER_ORDER_STATUSES,
  FLOWER_ORDER_STATUS_LABELS,
  canTransitionFlowerOrderStatus,
  formatPriceCents,
  type FlowerOrderStatus,
} from "@/lib/flowers/types";

type OrderRow = {
  order: {
    id: string;
    status: string;
    dedicationText: string;
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string;
    totalCents: number;
    createdAt: string;
  };
  product: { name: string };
  obituary: { name: string };
};

type Props = {
  orders: OrderRow[];
  showObituary?: boolean;
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

export function FlowerOrdersTable({ orders, showObituary = true }: Props) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  if (orders.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-6 py-12 text-center text-sm text-zinc-500">
        Cap comanda encara.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-4 py-3 font-medium">Data</th>
              {showObituary && (
                <th className="px-4 py-3 font-medium">Difunt</th>
              )}
              <th className="px-4 py-3 font-medium">Producte</th>
              <th className="px-4 py-3 font-medium">Dedicatòria</th>
              <th className="px-4 py-3 font-medium">Comprador</th>
              <th className="px-4 py-3 font-medium">Import</th>
              <th className="px-4 py-3 font-medium">Estat</th>
            </tr>
          </thead>
          <tbody>
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
                    <td className="px-4 py-3">{obituary.name}</td>
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
                      {FLOWER_ORDER_STATUS_LABELS[currentStatus] ??
                        order.status}
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
          </tbody>
        </table>
      </div>
    </div>
  );
}
