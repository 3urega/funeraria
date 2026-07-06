import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { cemeteries } from "@/lib/db/schema";
import { getAllCemeteries } from "@/lib/db/queries";
import {
  requireAdminSession,
  unauthorizedAdminResponse,
} from "@/lib/auth/require-admin";
import { getFuneralHomeId } from "@/lib/site/tenant";
import { geoFieldsSchema, normalizeGeoFields } from "@/lib/admin/place-schema";

const createSchema = z.object({
  name: z.string().min(1),
  ...geoFieldsSchema,
});

export async function GET() {
  if (!(await requireAdminSession())) return unauthorizedAdminResponse();
  const cemeteriesList = await getAllCemeteries();
  return NextResponse.json({ cemeteries: cemeteriesList });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdminSession())) return unauthorizedAdminResponse();

  const json = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const id = `cemetery-${Date.now()}`;
  const geo = normalizeGeoFields(parsed.data);

  getDb()
    .insert(cemeteries)
    .values({
      id,
      funeralHomeId: getFuneralHomeId(),
      name: parsed.data.name,
      ...geo,
    })
    .run();

  return NextResponse.json({ id });
}
