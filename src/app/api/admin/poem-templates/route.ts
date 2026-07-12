import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { poemTemplates } from "@/lib/db/schema";
import { getAllPoemTemplates } from "@/lib/db/queries";
import {
  requireAdminSession,
  unauthorizedAdminResponse,
} from "@/lib/auth/require-admin";
import { getFuneralHomeId } from "@/lib/site/tenant-id";
import { createPoemTemplateSchema } from "@/lib/poems/schema";

export async function GET() {
  if (!(await requireAdminSession())) return unauthorizedAdminResponse();
  const poems = await getAllPoemTemplates();
  return NextResponse.json({ poems });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdminSession())) return unauthorizedAdminResponse();

  const json = await req.json().catch(() => null);
  const parsed = createPoemTemplateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const id = `poem-${Date.now()}`;

  getDb()
    .insert(poemTemplates)
    .values({
      id,
      funeralHomeId: getFuneralHomeId(),
      title: parsed.data.title,
      text: parsed.data.text,
      isActive: parsed.data.isActive,
    })
    .run();

  return NextResponse.json({ id });
}
