import { FlowerOrdersTable } from "@/components/admin/flower-orders-table";
import type { FlowerOrder, FlowerProduct, Obituary } from "@/lib/db/schema";

type Props = {
  orders: Array<{
    order: FlowerOrder;
    product: FlowerProduct;
    obituary: Obituary;
  }>;
};

export function EsquelaFlowerOrdersPanel({ orders }: Props) {
  return <FlowerOrdersTable orders={orders} showObituary={false} />;
}
