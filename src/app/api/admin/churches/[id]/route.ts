import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { oneRow, runSql } from "@/lib/db/exec";
import { churches, obituaries } from "@/lib/db/schema";
import { getChurchById } from "@/lib/db/queries";
import {
  requireAdminSession,
  unauthorizedAdminResponse,
} from "@/lib/auth/require-admin";
import { geoFieldsSchema, normalizeGeoFields } from "@/lib/admin/place-schema";

const updateSchema = z.object({
  name: z.string().min(1),
  ...geoFieldsSchema,
});

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
  if (!(await requireAdminSession())) return unauthorizedAdminResponse();

  const { id } = await params;
  const church = await getChurchById(id);
  if (!church) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }
  return NextResponse.json({ church });
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  if (!(await requireAdminSession())) return unauthorizedAdminResponse();

  const { id } = await params;
  const existing = await getChurchById(id);
  if (!existing) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  const json = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const geo = normalizeGeoFields(parsed.data);
  await runSql(getDb()
    .update(churches)
    .set({
      name: parsed.data.name,
      ...geo,
    })
    .where(eq(churches.id, id)));

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  if (!(await requireAdminSession())) return unauthorizedAdminResponse();

  const { id } = await params;
  const existing = await getChurchById(id);
  if (!existing) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  const linked = await oneRow(
    getDb().select({ id: obituaries.id }).from(obituaries).where(eq(obituaries.churchId, id)),
  );

  if (linked) {
    return NextResponse.json({ error: "HAS_LINKED_OBITUARIES" }, { status: 409 });
  }

  await runSql(getDb().delete(churches).where(eq(churches.id, id)));
  return NextResponse.json({ ok: true });
}
