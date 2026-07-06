import { getEnv } from "@/lib/config/env";
import { LocalStorageAdapter } from "./local.adapter";
import type { StorageAdapter } from "./types";

export function getStorage(): StorageAdapter {
  const { STORAGE_DRIVER } = getEnv();

  if (STORAGE_DRIVER === "supabase") {
    throw new Error(
      "Supabase Storage adapter not configured. Set STORAGE_DRIVER=local for development.",
    );
  }

  return new LocalStorageAdapter();
}

export type { StorageAdapter, StorageBucket } from "./types";
