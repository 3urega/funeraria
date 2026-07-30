import { NextRequest, NextResponse } from "next/server";
import { markAllCommemorativeMessagesReviewedForObituary } from "@/lib/db/queries";
import {
  requireAdminSession,
  unauthorizedAdminResponse,
} from "@/lib/auth/require-admin";
import { markObituaryMessagesReviewedSchema } from "@/lib/commemorative/schema";

export async function POST(req: NextRequest) {
  if (!(await requireAdminSession())) return unauthorizedAdminResponse();

  const json = await req.json().catch(() => null);
  const parsed = markObituaryMessagesReviewedSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const result = await markAllCommemorativeMessagesReviewedForObituary(
    parsed.data.obituaryId,
  );
  if (!result.ok) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, updated: result.updated });
}
