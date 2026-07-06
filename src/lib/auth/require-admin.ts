import { NextResponse } from "next/server";
import { getAdminSessionFromCookies } from "@/lib/auth/session";

export async function requireAdminSession() {
  const session = await getAdminSessionFromCookies();
  if (!session) return null;
  return session;
}

export function unauthorizedAdminResponse() {
  return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
}
