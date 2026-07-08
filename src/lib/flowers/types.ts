export const FLOWER_ORDER_STATUSES = [
  "pending_payment",
  "paid",
  "in_preparation",
  "delivered",
  "cancelled",
] as const;

export type FlowerOrderStatus = (typeof FLOWER_ORDER_STATUSES)[number];

export const FLOWER_ORDER_STATUS_LABELS: Record<FlowerOrderStatus, string> = {
  pending_payment: "Pendent de pagament",
  paid: "Pagat",
  in_preparation: "En preparació",
  delivered: "Lliurat",
  cancelled: "Cancel·lat",
};

export function canTransitionFlowerOrderStatus(
  from: FlowerOrderStatus,
  to: FlowerOrderStatus,
): boolean {
  if (from === to) return true;
  if (to === "cancelled") {
    return from === "paid" || from === "in_preparation";
  }
  const transitions: Record<FlowerOrderStatus, FlowerOrderStatus[]> = {
    pending_payment: ["paid", "cancelled"],
    paid: ["in_preparation", "cancelled"],
    in_preparation: ["delivered", "cancelled"],
    delivered: [],
    cancelled: [],
  };
  return transitions[from].includes(to);
}

export function formatPriceCents(cents: number, currency = "EUR"): string {
  return new Intl.NumberFormat("ca-ES", {
    style: "currency",
    currency,
  }).format(cents / 100);
}
