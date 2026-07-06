import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";

export async function POST() {
  const auth = getAuth();
  await auth.signOut();
  return NextResponse.json({ ok: true });
}
