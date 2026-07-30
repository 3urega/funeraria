import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { runSql } from "@/lib/db/exec";
import { obituaries } from "@/lib/db/schema";
import {
  getObituaryByIdForTenant,
  slugExists,
  validatePlaceIds,
  visitCodeExists,
} from "@/lib/db/queries";
import {
  requireAdminSession,
  unauthorizedAdminResponse,
} from "@/lib/auth/require-admin";
import { updateEsquelaSchema } from "@/lib/esquela/admin-schema";
import { patchObituaryFlagsSchema } from "@/lib/esquela/patch-flags-schema";
import { slugifyName } from "@/lib/esquela/generate-slug";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  if (!(await requireAdminSession())) return unauthorizedAdminResponse();

  const { id } = await params;
  const existing = await getObituaryByIdForTenant(id);
  if (!existing) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  const json = await req.json().catch(() => null);
  const parsed = patchObituaryFlagsSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  await runSql(getDb()
    .update(obituaries)
    .set({
      ...parsed.data,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(obituaries.id, id)));

  return NextResponse.json({ ok: true, id });
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  if (!(await requireAdminSession())) return unauthorizedAdminResponse();

  const { id } = await params;
  const existing = await getObituaryByIdForTenant(id);
  if (!existing) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  const json = await req.json().catch(() => null);
  const parsed = updateEsquelaSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const data = parsed.data;

  const placesValid = await validatePlaceIds({
    churchId: data.churchId,
    cemeteryId: data.cemeteryId,
    wakeRoomId: data.wakeRoomId,
  });
  if (!placesValid) {
    return NextResponse.json({ error: "INVALID_PLACES" }, { status: 400 });
  }

  const slug = slugifyName(data.slug) || slugifyName(data.name);
  if (!slug || (await slugExists(slug, id))) {
    return NextResponse.json({ error: "CONFLICT" }, { status: 409 });
  }

  const visitCode = data.visitCode.toUpperCase();
  if (await visitCodeExists(visitCode, id)) {
    return NextResponse.json({ error: "CONFLICT" }, { status: 409 });
  }

  try {
    await runSql(getDb()
      .update(obituaries)
      .set({
        slug,
        name: data.name,
        visitCode,
        expedientCode: data.expedientCode ?? null,
        isReady: data.isReady,
        isActive: data.isActive,
        isVisible: data.isVisible,
        churchId: data.churchId,
        cemeteryId: data.cemeteryId,
        wakeRoomId: data.wakeRoomId,
        deathPlace: data.deathPlace,
        deathDay: data.deathDay,
        ageAtDeath: data.ageAtDeath,
        funeralDatetime: data.funeralDatetime,
        mortuaryAddress: data.mortuaryAddress ?? null,
        wakeSchedule: data.wakeSchedule,
        showEpd: data.showEpd ?? true,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(obituaries.id, id)));
  } catch {
    return NextResponse.json({ error: "CONFLICT" }, { status: 409 });
  }

  return NextResponse.json({ id, slug, visitCode });
}
