import { NextResponse } from "next/server";
import { clearFamilySessionCookie } from "@/lib/auth/session";

export async function POST() {
  await clearFamilySessionCookie();
  return NextResponse.json({ ok: true });
}
