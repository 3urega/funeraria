import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { poemTemplates } from "@/lib/db/schema";
import { getPoemTemplateById } from "@/lib/db/queries";
import {
  requireAdminSession,
  unauthorizedAdminResponse,
} from "@/lib/auth/require-admin";
import { updatePoemTemplateSchema } from "@/lib/poems/schema";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
  if (!(await requireAdminSession())) return unauthorizedAdminResponse();

  const { id } = await params;
  const poem = await getPoemTemplateById(id);
  if (!poem) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }
  return NextResponse.json({ poem });
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  if (!(await requireAdminSession())) return unauthorizedAdminResponse();

  const { id } = await params;
  const existing = await getPoemTemplateById(id);
  if (!existing) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  const json = await req.json().catch(() => null);
  const parsed = updatePoemTemplateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  getDb()
    .update(poemTemplates)
    .set(parsed.data)
    .where(eq(poemTemplates.id, id))
    .run();

  return NextResponse.json({ ok: true });
}
