import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  FAMILY_COOKIE,
  signAdminSession,
  signFamilySession,
  verifyAdminSession,
  verifyFamilySession,
} from "./session-jwt";
import type { FamilySession, Session } from "./types";

export {
  ADMIN_COOKIE,
  FAMILY_COOKIE,
  signAdminSession,
  signFamilySession,
  verifyAdminSession,
  verifyFamilySession,
};

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
