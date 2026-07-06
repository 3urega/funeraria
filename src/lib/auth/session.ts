import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getEnv } from "@/lib/config/env";
import type { FamilySession, Session } from "./types";

const ADMIN_COOKIE = "admin_session";
const FAMILY_COOKIE = "family_session";

function getAdminSecret() {
  return new TextEncoder().encode(getEnv().ADMIN_SESSION_SECRET);
}

function getFamilySecret() {
  return new TextEncoder().encode(getEnv().FAMILY_SESSION_SECRET);
}

export async function signAdminSession(session: Session): Promise<string> {
  return new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getAdminSecret());
}

export async function verifyAdminSession(
  token: string,
): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, getAdminSecret());
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as Session["role"],
    };
  } catch {
    return null;
  }
}

export async function signFamilySession(
  session: FamilySession,
): Promise<string> {
  return new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getFamilySecret());
}

export async function verifyFamilySession(
  token: string,
): Promise<FamilySession | null> {
  try {
    const { payload } = await jwtVerify(token, getFamilySecret());
    return {
      obituaryId: payload.obituaryId as string,
      visitCode: payload.visitCode as string,
    };
  } catch {
    return null;
  }
}

export async function getAdminSessionFromCookies(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminSession(token);
}

export async function getFamilySessionFromCookies(): Promise<FamilySession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(FAMILY_COOKIE)?.value;
  if (!token) return null;
  return verifyFamilySession(token);
}

export async function setAdminSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function setFamilySessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(FAMILY_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
}

export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}

export async function clearFamilySessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(FAMILY_COOKIE);
}

export { ADMIN_COOKIE, FAMILY_COOKIE };
