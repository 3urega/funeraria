import { NextRequest, NextResponse } from "next/server";
import {
  getContentSectionByKey,
  upsertContentSection,
} from "@/lib/db/queries";
import {
  requireAdminSession,
  unauthorizedAdminResponse,
} from "@/lib/auth/require-admin";
import {
  homeSectionKeySchema,
  updateContentSectionSchema,
} from "@/lib/home/cms-schema";
import { HOME_SECTION_KEYS } from "@/lib/home/defaults";

type RouteContext = { params: Promise<{ key: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
  if (!(await requireAdminSession())) return unauthorizedAdminResponse();

  const { key } = await params;
  const parsedKey = homeSectionKeySchema.safeParse(key);
  if (!parsedKey.success) {
    return NextResponse.json({ error: "INVALID_KEY" }, { status: 400 });
  }

  const section = await getContentSectionByKey(parsedKey.data);
  return NextResponse.json({ section: section ?? null });
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  if (!(await requireAdminSession())) return unauthorizedAdminResponse();

  const { key } = await params;
  const parsedKey = homeSectionKeySchema.safeParse(key);
  if (!parsedKey.success) {
    return NextResponse.json({ error: "INVALID_KEY" }, { status: 400 });
  }

  if (!HOME_SECTION_KEYS.includes(parsedKey.data)) {
    return NextResponse.json({ error: "INVALID_KEY" }, { status: 400 });
  }

  const json = await req.json().catch(() => null);
  const parsed = updateContentSectionSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  await upsertContentSection(
    parsedKey.data,
    parsed.data.contentI18n,
    parsed.data.isPublished,
  );

  return NextResponse.json({ ok: true });
}
