import { NextRequest, NextResponse } from "next/server";
import { getContentSectionByKey, upsertContentSection } from "@/lib/db/queries";
import { getStorage } from "@/lib/storage";
import {
  requireAdminSession,
  unauthorizedAdminResponse,
} from "@/lib/auth/require-admin";
import { DEFAULT_HOME_CONTENT } from "@/lib/home/defaults";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIMES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(req: NextRequest) {
  if (!(await requireAdminSession())) return unauthorizedAdminResponse();

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
  const relativePath = `why-us.${ext}`;
  const buffer = Buffer.from(await image.arrayBuffer());
  const storage = getStorage();
  const imagePath = await storage.upload("content", relativePath, buffer, image.type);
  const publicUrl = storage.getPublicUrl(imagePath);

  const existing = await getContentSectionByKey("why_us");
  const base = {
    ...DEFAULT_HOME_CONTENT.whyUs,
    ...(existing?.contentI18n as Record<string, unknown> | undefined),
    imagePath: publicUrl,
  };

  await upsertContentSection(
    "why_us",
    base,
    existing?.isPublished ?? true,
  );

  return NextResponse.json({ ok: true, imagePath: publicUrl });
}
