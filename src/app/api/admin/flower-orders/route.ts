import { NextRequest, NextResponse } from "next/server";
import { getAllFlowerOrders } from "@/lib/db/queries";
import {
  requireAdminSession,
  unauthorizedAdminResponse,
} from "@/lib/auth/require-admin";
import type { FlowerOrderStatus } from "@/lib/flowers/types";
import { FLOWER_ORDER_STATUSES } from "@/lib/flowers/types";

export async function GET(req: NextRequest) {
  if (!(await requireAdminSession())) return unauthorizedAdminResponse();

  const statusParam = req.nextUrl.searchParams.get("status");
  const obituaryId = req.nextUrl.searchParams.get("obituaryId") ?? undefined;
  const status =
    statusParam && FLOWER_ORDER_STATUSES.includes(statusParam as FlowerOrderStatus)
      ? (statusParam as FlowerOrderStatus)
      : undefined;

  const orders = await getAllFlowerOrders({ status, obituaryId });
  return NextResponse.json({ orders });
}
