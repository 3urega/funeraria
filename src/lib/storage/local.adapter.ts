import fs from "fs/promises";
import path from "path";
import type { StorageAdapter, StorageBucket } from "./types";
import { getEnv } from "@/lib/config/env";

export class LocalStorageAdapter implements StorageAdapter {
  private root: string;
  private publicBase: string;

  constructor() {
    const env = getEnv();
    this.root = path.resolve(process.cwd(), env.STORAGE_LOCAL_ROOT);
    this.publicBase = env.STORAGE_PUBLIC_BASE;
  }

  async upload(
    bucket: StorageBucket,
    relativePath: string,
    file: Buffer,
    _mime: string,
  ): Promise<string> {
    const fullPath = path.join(this.root, bucket, relativePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, file);
    return `${bucket}/${relativePath}`.replace(/\\/g, "/");
  }

  async delete(fullPath: string): Promise<void> {
    const target = path.join(this.root, fullPath);
    await fs.unlink(target).catch(() => undefined);
  }

  getPublicUrl(fullPath: string): string {
    return `${this.publicBase}/${fullPath}`;
  }
}
