import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { obituaries } from "@/lib/db/schema";
import { getObituaryByIdForTenant } from "@/lib/db/queries";
import { getStorage } from "@/lib/storage";
import { parseImageFile } from "@/lib/admin/image-upload";
import {
  requireAdminSession,
  unauthorizedAdminResponse,
} from "@/lib/auth/require-admin";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: RouteContext) {
  if (!(await requireAdminSession())) return unauthorizedAdminResponse();

  const { id } = await params;
  const existing = await getObituaryByIdForTenant(id);
  if (!existing) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  const formData = await req.formData();
  const parsed = parseImageFile(formData);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { file, ext } = parsed.data;
  const relativePath = `${id}/photo.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const storage = getStorage();
  const imagePath = await storage.upload(
    "obituaries",
    relativePath,
    buffer,
    file.type,
  );

  const clearPending = existing.familyImageStatus === "pending";

  getDb()
    .update(obituaries)
    .set({
      imagePath,
      familyImageStatus: clearPending ? null : existing.familyImageStatus,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(obituaries.id, id))
    .run();

  return NextResponse.json({
    ok: true,
    imagePath,
    imageUrl: storage.getPublicUrl(imagePath),
  });
}
