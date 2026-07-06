import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getObituaryByVisitCode } from "@/lib/db/queries";
import {
  setFamilySessionCookie,
  signFamilySession,
} from "@/lib/auth/session";

const bodySchema = z.object({
  code: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "INVALID_CODE", message: "El código es necesario" },
      { status: 400 },
    );
  }

  const code = parsed.data.code.trim().toUpperCase();
  const obituary = await getObituaryByVisitCode(code);

  if (!obituary) {
    return NextResponse.json(
      { error: "NO_OBITUARY", message: "Codi invàlid" },
      { status: 404 },
    );
  }

  if (!obituary.isActive) {
    return NextResponse.json(
      { error: "NOT_ACTIVE", message: "Aquesta esquela no està activa" },
      { status: 403 },
    );
  }

  const token = await signFamilySession({
    obituaryId: obituary.id,
    visitCode: code,
  });
  await setFamilySessionCookie(token);

  return NextResponse.json({ obituaryId: obituary.id, name: obituary.name });
}
