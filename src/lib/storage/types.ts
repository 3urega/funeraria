export type StorageBucket = "obituaries" | "places" | "content" | "site" | "flowers";

export interface StorageAdapter {
  upload(
    bucket: StorageBucket,
    relativePath: string,
    file: Buffer,
    mime: string,
  ): Promise<string>;

  delete(fullPath: string): Promise<void>;

  getPublicUrl(fullPath: string): string;
}
