import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { runSql } from "@/lib/db/exec";
import { obituaries } from "@/lib/db/schema";
import { getObituaryByIdForTenant } from "@/lib/db/queries";
import {
  requireAdminSession,
  unauthorizedAdminResponse,
} from "@/lib/auth/require-admin";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_req: Request, { params }: RouteContext) {
  if (!(await requireAdminSession())) return unauthorizedAdminResponse();

  const { id } = await params;
  const existing = await getObituaryByIdForTenant(id);
  if (!existing) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  if (
    existing.familyImageStatus !== "pending" ||
    !existing.customImagePath
  ) {
    return NextResponse.json({ error: "NO_PENDING_PHOTO" }, { status: 400 });
  }

  await runSql(getDb()
    .update(obituaries)
    .set({
      familyImageStatus: "rejected",
      updatedAt: new Date().toISOString(),
    })
    .where(eq(obituaries.id, id)));

  return NextResponse.json({ ok: true, status: "rejected" as const });
}
