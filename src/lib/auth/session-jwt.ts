import { SignJWT, jwtVerify } from "jose";
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

export { ADMIN_COOKIE, FAMILY_COOKIE };
