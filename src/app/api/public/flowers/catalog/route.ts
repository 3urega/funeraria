import { NextRequest, NextResponse } from "next/server";
import { getActiveFlowerProducts } from "@/lib/db/queries";
import { getObituaryById } from "@/lib/db/queries";
import { getFuneralHomeId } from "@/lib/site/tenant-id";

export async function GET(req: NextRequest) {
  const obituaryId = req.nextUrl.searchParams.get("obituaryId") ?? "";
  if (!obituaryId.trim()) {
    return NextResponse.json({ error: "OBITUARY_ID_REQUIRED" }, { status: 400 });
  }

  const obituary = await getObituaryById(obituaryId);
  if (!obituary || obituary.funeralHomeId !== getFuneralHomeId()) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }
  if (!obituary.isVisible) {
    return NextResponse.json({ error: "NOT_VISIBLE" }, { status: 403 });
  }

  const products = await getActiveFlowerProducts();
  return NextResponse.json({ products });
}
