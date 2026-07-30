import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { oneRow, runSql } from "@/lib/db/exec";
import { obituaries, wakeRooms } from "@/lib/db/schema";
import { getWakeRoomById } from "@/lib/db/queries";
import {
  requireAdminSession,
  unauthorizedAdminResponse,
} from "@/lib/auth/require-admin";
import { geoFieldsSchema, normalizeGeoFields } from "@/lib/admin/place-schema";
import { patchWakeRoomActiveSchema } from "@/lib/admin/patch-wake-room-schema";

const updateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  isActive: z.boolean(),
  ...geoFieldsSchema,
});

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
  if (!(await requireAdminSession())) return unauthorizedAdminResponse();

  const { id } = await params;
  const room = await getWakeRoomById(id);
  if (!room) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }
  return NextResponse.json({ room });
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  if (!(await requireAdminSession())) return unauthorizedAdminResponse();

  const { id } = await params;
  const existing = await getWakeRoomById(id);
  if (!existing) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  const json = await req.json().catch(() => null);
  const parsed = patchWakeRoomActiveSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  await runSql(getDb()
    .update(wakeRooms)
    .set({ isActive: parsed.data.isActive })
    .where(eq(wakeRooms.id, id)));

  return NextResponse.json({ ok: true, id });
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  if (!(await requireAdminSession())) return unauthorizedAdminResponse();

  const { id } = await params;
  const existing = await getWakeRoomById(id);
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
    .update(wakeRooms)
    .set({
      name: parsed.data.name,
      description: parsed.data.description || null,
      isActive: parsed.data.isActive,
      ...geo,
    })
    .where(eq(wakeRooms.id, id)));

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  if (!(await requireAdminSession())) return unauthorizedAdminResponse();

  const { id } = await params;
  const existing = await getWakeRoomById(id);
  if (!existing) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  const linked = await oneRow(
    getDb()
      .select({ id: obituaries.id })
      .from(obituaries)
      .where(eq(obituaries.wakeRoomId, id)),
  );

  if (linked) {
    return NextResponse.json({ error: "HAS_LINKED_OBITUARIES" }, { status: 409 });
  }

  await runSql(getDb().delete(wakeRooms).where(eq(wakeRooms.id, id)));
  return NextResponse.json({ ok: true });
}
