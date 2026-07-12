import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { siteConfig } from "@/lib/db/schema";
import { getSiteConfig } from "@/lib/db/queries";
import { getStorage } from "@/lib/storage";
import {
  requireAdminSession,
  unauthorizedAdminResponse,
} from "@/lib/auth/require-admin";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_MIMES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(req: NextRequest) {
  if (!(await requireAdminSession())) return unauthorizedAdminResponse();

  const existing = await getSiteConfig();
  if (!existing) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  const formData = await req.formData();
  const image = formData.get("image");

  if (!(image instanceof File) || image.size === 0) {
    return NextResponse.json({ error: "IMAGE_REQUIRED" }, { status: 400 });
  }
  if (!ALLOWED_MIMES.has(image.type)) {
    return NextResponse.json({ error: "INVALID_IMAGE_TYPE" }, { status: 400 });
  }
  if (image.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: "IMAGE_TOO_LARGE" }, { status: 400 });
  }

  const ext =
    image.type === "image/png"
      ? "png"
      : image.type === "image/webp"
        ? "webp"
        : "jpg";
  const relativePath = `hero.${ext}`;
  const buffer = Buffer.from(await image.arrayBuffer());
  const storage = getStorage();
  const imagePath = await storage.upload("site", relativePath, buffer, image.type);
  const publicUrl = storage.getPublicUrl(imagePath);

  const theme = { ...(existing.theme ?? {}), heroImagePath: publicUrl };

  getDb()
    .update(siteConfig)
    .set({ theme })
    .where(eq(siteConfig.id, existing.id))
    .run();

  return NextResponse.json({ ok: true, heroImagePath: publicUrl });
}
