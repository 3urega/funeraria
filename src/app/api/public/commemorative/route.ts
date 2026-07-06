import { NextRequest, NextResponse } from "next/server";
import { insertCommemorativeMessage } from "@/lib/db/queries";
import { createCommemorativeMessageSchema } from "@/lib/commemorative/schema";

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = createCommemorativeMessageSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "INVALID_BODY", message: "Camps obligatoris invàlids" },
      { status: 400 },
    );
  }

  const result = await insertCommemorativeMessage(parsed.data);

  if (!result.ok) {
    if (result.error === "NOT_VISIBLE") {
      return NextResponse.json(
        { error: "NOT_VISIBLE", message: "Esquela no disponible" },
        { status: 403 },
      );
    }
    return NextResponse.json(
      { error: "NOT_FOUND", message: "Esquela no trobada" },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true, id: result.id }, { status: 201 });
}
