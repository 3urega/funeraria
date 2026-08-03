import path from "path";
import fs from "fs/promises";
import { lookup } from "mime-types";
import { NextResponse } from "next/server";
import { getEnv } from "@/lib/config/env";
import { getObituaryByIdForTenant } from "@/lib/db/queries";
import {
  requireAdminSession,
  unauthorizedAdminResponse,
} from "@/lib/auth/require-admin";
import {
  getSupabaseServiceClient,
  getSupabaseStorageBucket,
} from "@/lib/supabase/client";

type RouteContext = { params: Promise<{ id: string }> };

async function readStorageObject(
  fullPath: string,
): Promise<{ buffer: Buffer; mime: string }> {
  const normalized = fullPath.replace(/\\/g, "/");

  if (getEnv().STORAGE_DRIVER === "local") {
    const root = path.resolve(process.cwd(), getEnv().STORAGE_LOCAL_ROOT);
    const filePath = path.join(root, normalized);
    const normalizedRoot = path.normalize(root);
    const normalizedFile = path.normalize(filePath);
    if (!normalizedFile.startsWith(normalizedRoot)) {
      throw new Error("Forbidden path");
    }
    const buffer = await fs.readFile(filePath);
    return {
      buffer,
      mime: lookup(filePath) || "application/octet-stream",
    };
  }

  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase.storage
    .from(getSupabaseStorageBucket())
    .download(normalized);

  if (error || !data) {
    throw new Error(error?.message ?? "Storage download failed");
  }

  return {
    buffer: Buffer.from(await data.arrayBuffer()),
    mime: data.type || lookup(normalized) || "application/octet-stream",
  };
}

function downloadFilename(customImagePath: string, slug: string): string {
  const ext = path.extname(customImagePath) || ".jpg";
  const safeSlug = slug.replace(/[^\w-]+/g, "-").replace(/^-|-$/g, "") || "esquela";
  return `foto-familiar-${safeSlug}${ext}`;
}

export async function GET(_req: Request, { params }: RouteContext) {
  if (!(await requireAdminSession())) return unauthorizedAdminResponse();

  const { id } = await params;
  const obituary = await getObituaryByIdForTenant(id);
  if (!obituary) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  if (
    obituary.familyImageStatus !== "pending" ||
    !obituary.customImagePath
  ) {
    return NextResponse.json({ error: "NO_PENDING_PHOTO" }, { status: 400 });
  }

  try {
    const { buffer, mime } = await readStorageObject(obituary.customImagePath);
    const filename = downloadFilename(obituary.customImagePath, obituary.slug);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": mime,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "DOWNLOAD_FAILED" }, { status: 500 });
  }
}
