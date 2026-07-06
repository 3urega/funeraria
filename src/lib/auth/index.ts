import { getEnv } from "@/lib/config/env";
import {
  clearAdminSessionCookie,
  getAdminSessionFromCookies,
  setAdminSessionCookie,
  signAdminSession,
} from "./session";
import type { AuthAdapter, Session } from "./types";

export class LocalAuthAdapter implements AuthAdapter {
  async signIn(email: string, password: string): Promise<Session | null> {
    const env = getEnv();

    if (email !== env.DEV_ADMIN_EMAIL || password !== env.DEV_ADMIN_PASSWORD) {
      return null;
    }

    const session: Session = {
      userId: "dev-admin-001",
      email,
      role: "admin",
    };

    const token = await signAdminSession(session);
    await setAdminSessionCookie(token);
    return session;
  }

  async signOut(): Promise<void> {
    await clearAdminSessionCookie();
  }

  async getSession(): Promise<Session | null> {
    return getAdminSessionFromCookies();
  }
}

export function getAuth(): AuthAdapter {
  const { AUTH_DRIVER } = getEnv();

  if (AUTH_DRIVER === "supabase") {
    throw new Error(
      "Supabase Auth adapter not configured. Set AUTH_DRIVER=local for development.",
    );
  }

  return new LocalAuthAdapter();
}
