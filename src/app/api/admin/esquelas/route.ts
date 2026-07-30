import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { runSql } from "@/lib/db/exec";
import { obituaries } from "@/lib/db/schema";
import {
  slugExists,
  validatePlaceIds,
  visitCodeExists,
} from "@/lib/db/queries";
import {
  requireAdminSession,
  unauthorizedAdminResponse,
} from "@/lib/auth/require-admin";
import { getFuneralHomeId } from "@/lib/site/tenant";
import { createEsquelaSchema } from "@/lib/esquela/admin-schema";
import { generateUniqueSlug } from "@/lib/esquela/generate-slug";
import { generateUniqueVisitCode } from "@/lib/esquela/generate-visit-code";

export async function POST(req: NextRequest) {
  if (!(await requireAdminSession())) return unauthorizedAdminResponse();

  const json = await req.json().catch(() => null);
  const parsed = createEsquelaSchema.safeParse(json);
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

  const slug = await generateUniqueSlug(data.name, slugExists);

  let visitCode = data.visitCode.toUpperCase();
  if (await visitCodeExists(visitCode)) {
    visitCode = await generateUniqueVisitCode(visitCodeExists);
  }

  const id = `obi-${Date.now()}`;
  const now = new Date().toISOString();

  try {
    await runSql(getDb()
      .insert(obituaries)
      .values({
        id,
        funeralHomeId: getFuneralHomeId(),
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
        createdAt: now,
        updatedAt: now,
      }));
  } catch {
    return NextResponse.json({ error: "CONFLICT" }, { status: 409 });
  }

  return NextResponse.json({ id, slug, visitCode });
}
