import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getFamilySessionFromCookies } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { obituaries } from "@/lib/db/schema";
import { notifyPendingFamilyPhoto } from "@/lib/notifications/pending-photo";
import { getStorage } from "@/lib/storage";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIMES = new Set(["image/jpeg", "image/png", "image/webp"]);

/** Familiar envia foto de referència — l'empleat la retoca i publica a imagePath */
export async function POST(req: NextRequest) {
  const session = await getFamilySessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const formData = await req.formData();
  const customImage = formData.get("customImage");

  if (!(customImage instanceof File) || customImage.size === 0) {
    return NextResponse.json({ error: "IMAGE_REQUIRED" }, { status: 400 });
  }

  if (!ALLOWED_MIMES.has(customImage.type)) {
    return NextResponse.json({ error: "INVALID_IMAGE_TYPE" }, { status: 400 });
  }
  if (customImage.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: "IMAGE_TOO_LARGE" }, { status: 400 });
  }

  const db = getDb();
  const existing = db
    .select()
    .from(obituaries)
    .where(eq(obituaries.id, session.obituaryId))
    .get();

  if (!existing) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  const ext =
    customImage.type === "image/png"
      ? "png"
      : customImage.type === "image/webp"
        ? "webp"
        : "jpg";
  const relativePath = `${session.obituaryId}/custom-${Date.now()}.${ext}`;
  const buffer = Buffer.from(await customImage.arrayBuffer());
  const storage = getStorage();
  const customImagePath = await storage.upload(
    "obituaries",
    relativePath,
    buffer,
    customImage.type,
  );

  db.update(obituaries)
    .set({
      customImagePath,
      familyImageStatus: "pending",
      updatedAt: new Date().toISOString(),
    })
    .where(eq(obituaries.id, session.obituaryId))
    .run();

  await notifyPendingFamilyPhoto({
    obituaryId: existing.id,
    obituaryName: existing.name,
    visitCode: existing.visitCode,
  });

  return NextResponse.json({ ok: true, status: "pending" as const });
}
