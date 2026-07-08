import Link from "next/link";
import { FlowerOrdersTable } from "@/components/admin/flower-orders-table";
import { getAllFlowerOrders } from "@/lib/db/queries";
import {
  FLOWER_ORDER_STATUSES,
  type FlowerOrderStatus,
} from "@/lib/flowers/types";

export const metadata = { title: "Admin — Comandes de flors" };

type Props = {
  searchParams: Promise<{ status?: string }>;
};

export default async function AdminFlowerOrdersPage({ searchParams }: Props) {
  const { status: statusParam } = await searchParams;
  const status =
    statusParam &&
    FLOWER_ORDER_STATUSES.includes(statusParam as FlowerOrderStatus)
      ? (statusParam as FlowerOrderStatus)
      : undefined;
  const orders = await getAllFlowerOrders(status ? { status } : {});

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Comandes de flors</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Totes les comandes de la funerària.
          </p>
        </div>
        <Link
          href="/admin/flores"
          className="rounded-md border px-4 py-2 text-sm hover:bg-zinc-50"
        >
          ← Catàleg
        </Link>
      </div>

      <FlowerOrdersTable orders={orders} />
    </div>
  );
}
