import { getEnv } from "@/lib/config/env";
import {
  getSupabaseServiceClient,
  getSupabaseStorageBucket,
} from "@/lib/supabase/client";
import type { StorageAdapter, StorageBucket } from "./types";

export class SupabaseStorageAdapter implements StorageAdapter {
  private publicBase: string;

  constructor() {
    const env = getEnv();
    this.publicBase = env.STORAGE_PUBLIC_BASE.replace(/\/$/, "");
  }

  async upload(
    bucket: StorageBucket,
    relativePath: string,
    file: Buffer,
    mime: string,
  ): Promise<string> {
    const storagePath = `${bucket}/${relativePath}`.replace(/\\/g, "/");
    const supabase = getSupabaseServiceClient();
    const { error } = await supabase.storage
      .from(getSupabaseStorageBucket())
      .upload(storagePath, file, {
        contentType: mime,
        upsert: true,
      });

    if (error) {
      throw new Error(`Supabase upload failed: ${error.message}`);
    }

    return storagePath;
  }

  async delete(fullPath: string): Promise<void> {
    const supabase = getSupabaseServiceClient();
    const { error } = await supabase.storage
      .from(getSupabaseStorageBucket())
      .remove([fullPath.replace(/\\/g, "/")]);

    if (error) {
      throw new Error(`Supabase delete failed: ${error.message}`);
    }
  }

  getPublicUrl(fullPath: string): string {
    const normalized = fullPath.replace(/\\/g, "/");
    if (this.publicBase.startsWith("http")) {
      return `${this.publicBase}/${normalized}`;
    }
    const supabase = getSupabaseServiceClient();
    const { data } = supabase.storage
      .from(getSupabaseStorageBucket())
      .getPublicUrl(normalized);
    return data.publicUrl;
  }
}
