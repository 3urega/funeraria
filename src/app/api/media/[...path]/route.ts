import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { lookup } from "mime-types";

const ROOT = path.resolve(
  process.cwd(),
  process.env.STORAGE_LOCAL_ROOT ?? "./storage",
);

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  if (process.env.STORAGE_DRIVER !== "local") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  const { path: segments } = await params;
  const filePath = path.join(ROOT, ...segments);
  const normalizedRoot = path.normalize(ROOT);
  const normalizedFile = path.normalize(filePath);

  if (!normalizedFile.startsWith(normalizedRoot)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const buffer = await fs.readFile(filePath);
    const mime = lookup(filePath) || "application/octet-stream";
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": mime,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
