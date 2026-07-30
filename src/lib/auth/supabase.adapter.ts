import { getSupabaseAnonClient } from "@/lib/supabase/client";
import { getAdminUserByAuthId } from "@/lib/db/queries";
import {
  clearAdminSessionCookie,
  getAdminSessionFromCookies,
  setAdminSessionCookie,
  signAdminSession,
} from "./session";
import type { AuthAdapter, Session } from "./types";

export class SupabaseAuthAdapter implements AuthAdapter {
  async signIn(email: string, password: string): Promise<Session | null> {
    const supabase = getSupabaseAnonClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user?.email) {
      return null;
    }

    const adminUser = await getAdminUserByAuthId(data.user.id);
    if (!adminUser) {
      await supabase.auth.signOut();
      return null;
    }

    const session: Session = {
      userId: adminUser.id,
      email: data.user.email,
      role: adminUser.role as Session["role"],
    };

    const token = await signAdminSession(session);
    await setAdminSessionCookie(token);
    return session;
  }

  async signOut(): Promise<void> {
    try {
      const supabase = getSupabaseAnonClient();
      await supabase.auth.signOut();
    } catch {
      // Cookie JWT sigue siendo la fuente de verdad en middleware
    }
    await clearAdminSessionCookie();
  }

  async getSession(): Promise<Session | null> {
    return getAdminSessionFromCookies();
  }
}
