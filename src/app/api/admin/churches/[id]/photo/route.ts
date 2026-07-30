import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { runSql } from "@/lib/db/exec";
import { churches } from "@/lib/db/schema";
import { getChurchById } from "@/lib/db/queries";
import { getStorage } from "@/lib/storage";
import {
  requireAdminSession,
  unauthorizedAdminResponse,
} from "@/lib/auth/require-admin";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIMES = new Set(["image/jpeg", "image/png", "image/webp"]);

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: RouteContext) {
  if (!(await requireAdminSession())) return unauthorizedAdminResponse();

  const { id } = await params;
  const existing = await getChurchById(id);
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
  const relativePath = `churches/${id}/photo.${ext}`;
  const buffer = Buffer.from(await image.arrayBuffer());
  const storage = getStorage();
  const imagePath = await storage.upload(
    "places",
    relativePath,
    buffer,
    image.type,
  );

  await runSql(getDb()
    .update(churches)
    .set({ imagePath })
    .where(eq(churches.id, id)));

  return NextResponse.json({ ok: true, imagePath });
}
