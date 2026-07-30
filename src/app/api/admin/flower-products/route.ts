import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { runSql } from "@/lib/db/exec";
import { flowerProducts } from "@/lib/db/schema";
import { getAllFlowerProducts } from "@/lib/db/queries";
import {
  requireAdminSession,
  unauthorizedAdminResponse,
} from "@/lib/auth/require-admin";
import { getFuneralHomeId } from "@/lib/site/tenant-id";
import { createFlowerProductSchema } from "@/lib/flowers/schema";

export async function GET() {
  if (!(await requireAdminSession())) return unauthorizedAdminResponse();
  const products = await getAllFlowerProducts();
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdminSession())) return unauthorizedAdminResponse();

  const json = await req.json().catch(() => null);
  const parsed = createFlowerProductSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const id = `flw-${Date.now()}`;
  const now = new Date().toISOString();

  await runSql(getDb()
    .insert(flowerProducts)
    .values({
      id,
      funeralHomeId: getFuneralHomeId(),
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      priceCents: parsed.data.priceCents,
      currency: parsed.data.currency,
      isActive: parsed.data.isActive,
      sortOrder: parsed.data.sortOrder,
      createdAt: now,
      updatedAt: now,
    }));

  return NextResponse.json({ id });
}
