import type { StorageAdapter } from "./types";

/**
 * URL pública amb bust de caché (p. ex. `updatedAt` de l'esquela).
 * Evita veure la foto antiga quan es sobreescriu `photo.jpg` al mateix path.
 */
export function mediaPublicUrl(
  storage: StorageAdapter,
  path: string,
  version?: string | null,
): string {
  const base = storage.getPublicUrl(path);
  if (!version) return base;
  return `${base}?v=${encodeURIComponent(version)}`;
}
