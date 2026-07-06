import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getFamilySessionFromCookies } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { obituaries, poemTemplates } from "@/lib/db/schema";

/** Familiar personalitza l'obituari (poema + text) */
export async function POST(req: NextRequest) {
  const session = await getFamilySessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const formData = await req.formData();
  const templateRaw = formData.get("obituarioPoemTemplateId");
  const textRaw = formData.get("obituarioText");

  const obituarioPoemTemplateId =
    typeof templateRaw === "string" && templateRaw.length > 0 ? templateRaw : null;
  const obituarioText =
    typeof textRaw === "string" ? textRaw.trim() : undefined;

  const db = getDb();
  const existing = db
    .select()
    .from(obituaries)
    .where(eq(obituaries.id, session.obituaryId))
    .get();

  if (!existing) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  if (obituarioPoemTemplateId) {
    const template = db
      .select()
      .from(poemTemplates)
      .where(eq(poemTemplates.id, obituarioPoemTemplateId))
      .get();
    if (!template?.isActive) {
      return NextResponse.json({ error: "INVALID_POEM" }, { status: 400 });
    }
  }

  const updates: Record<string, unknown> = {
    obituarioPoemTemplateId,
    updatedAt: new Date().toISOString(),
  };

  if (obituarioText !== undefined) {
    updates.obituarioText = obituarioText.length > 0 ? obituarioText : null;
  }

  db.update(obituaries)
    .set(updates)
    .where(eq(obituaries.id, session.obituaryId))
    .run();

  return NextResponse.json({ ok: true });
}
