import { NextRequest, NextResponse } from "next/server";
import { insertFlowerOrder } from "@/lib/db/queries";
import { flowerCheckoutSchema } from "@/lib/flowers/schema";

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = flowerCheckoutSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "INVALID_BODY", message: "Camps obligatoris invàlids" },
      { status: 400 },
    );
  }

  const result = await insertFlowerOrder(parsed.data);

  if (!result.ok) {
    if (result.error === "NOT_VISIBLE") {
      return NextResponse.json(
        { error: "NOT_VISIBLE", message: "Esquela no disponible" },
        { status: 403 },
      );
    }
    if (result.error === "PRODUCT_NOT_FOUND") {
      return NextResponse.json(
        { error: "PRODUCT_NOT_FOUND", message: "Producte no disponible" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { error: "NOT_FOUND", message: "Esquela no trobada" },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true, id: result.id }, { status: 201 });
}
