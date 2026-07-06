import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { cemeteries, obituaries } from "@/lib/db/schema";
import { getCemeteryById } from "@/lib/db/queries";
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
  const cemetery = await getCemeteryById(id);
  if (!cemetery) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }
  return NextResponse.json({ cemetery });
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  if (!(await requireAdminSession())) return unauthorizedAdminResponse();

  const { id } = await params;
  const existing = await getCemeteryById(id);
  if (!existing) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  const json = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const geo = normalizeGeoFields(parsed.data);
  getDb()
    .update(cemeteries)
    .set({
      name: parsed.data.name,
      ...geo,
    })
    .where(eq(cemeteries.id, id))
    .run();

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  if (!(await requireAdminSession())) return unauthorizedAdminResponse();

  const { id } = await params;
  const existing = await getCemeteryById(id);
  if (!existing) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  const linked = getDb()
    .select({ id: obituaries.id })
    .from(obituaries)
    .where(eq(obituaries.cemeteryId, id))
    .get();

  if (linked) {
    return NextResponse.json({ error: "HAS_LINKED_OBITUARIES" }, { status: 409 });
  }

  getDb().delete(cemeteries).where(eq(cemeteries.id, id)).run();
  return NextResponse.json({ ok: true });
}
