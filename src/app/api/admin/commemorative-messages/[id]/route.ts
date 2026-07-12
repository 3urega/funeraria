import { NextRequest, NextResponse } from "next/server";
import { updateCommemorativeMessageReviewed } from "@/lib/db/queries";
import {
  requireAdminSession,
  unauthorizedAdminResponse,
} from "@/lib/auth/require-admin";
import { updateCommemorativeMessageReviewedSchema } from "@/lib/commemorative/schema";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  if (!(await requireAdminSession())) return unauthorizedAdminResponse();

  const { id } = await params;
  const json = await req.json().catch(() => null);
  const parsed = updateCommemorativeMessageReviewedSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const result = await updateCommemorativeMessageReviewed(
    id,
    parsed.data.reviewed,
  );
  if (!result.ok) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
