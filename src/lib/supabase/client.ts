import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getEnv } from "@/lib/config/env";

function requireSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is required for Supabase drivers");
  }
  return url;
}

function requireAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY is required for Supabase Auth",
    );
  }
  return key;
}

function requireServiceRoleKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required for Supabase Storage",
    );
  }
  return key;
}

let anonClient: SupabaseClient | undefined;
let serviceClient: SupabaseClient | undefined;

/** Cliente anon — login admin (Auth). */
export function getSupabaseAnonClient(): SupabaseClient {
  if (!anonClient) {
    anonClient = createClient(requireSupabaseUrl(), requireAnonKey(), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return anonClient;
}

/** Cliente service role — Storage server-side. */
export function getSupabaseServiceClient(): SupabaseClient {
  if (!serviceClient) {
    serviceClient = createClient(requireSupabaseUrl(), requireServiceRoleKey(), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return serviceClient;
}

export function getSupabaseStorageBucket(): string {
  return getEnv().SUPABASE_STORAGE_BUCKET;
}
