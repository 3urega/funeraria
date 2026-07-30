import { getEnv } from "@/lib/config/env";
import { LocalStorageAdapter } from "./local.adapter";
import { SupabaseStorageAdapter } from "./supabase.adapter";
import type { StorageAdapter } from "./types";

export function getStorage(): StorageAdapter {
  const { STORAGE_DRIVER } = getEnv();

  if (STORAGE_DRIVER === "supabase") {
    return new SupabaseStorageAdapter();
  }

  return new LocalStorageAdapter();
}

export type { StorageAdapter, StorageBucket } from "./types";
