import { NextRequest, NextResponse } from "next/server";
import {
  getFlowerOrderById,
  updateFlowerOrderStatus,
} from "@/lib/db/queries";
import {
  requireAdminSession,
  unauthorizedAdminResponse,
} from "@/lib/auth/require-admin";
import { updateFlowerOrderStatusSchema } from "@/lib/flowers/schema";
import {
  canTransitionFlowerOrderStatus,
  type FlowerOrderStatus,
} from "@/lib/flowers/types";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  if (!(await requireAdminSession())) return unauthorizedAdminResponse();

  const { id } = await params;
  const existing = await getFlowerOrderById(id);
  if (!existing) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  const json = await req.json().catch(() => null);
  const parsed = updateFlowerOrderStatusSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const currentStatus = existing.order.status as FlowerOrderStatus;
  if (
    !canTransitionFlowerOrderStatus(currentStatus, parsed.data.status)
  ) {
    return NextResponse.json({ error: "INVALID_TRANSITION" }, { status: 400 });
  }

  const result = await updateFlowerOrderStatus(id, parsed.data.status);
  if (!result.ok) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
