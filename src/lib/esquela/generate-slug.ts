/** Converteix un nom de difunt en slug URL-safe (ex. "Ramon Sant Torner" → "ramon-sant-torner"). */
export function slugifyName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function generateUniqueSlug(
  baseName: string,
  isTaken: (slug: string) => Promise<boolean>,
): Promise<string> {
  const base = slugifyName(baseName) || "esquela";
  if (!(await isTaken(base))) return base;

  for (let i = 2; i <= 99; i++) {
    const candidate = `${base}-${i}`;
    if (!(await isTaken(candidate))) return candidate;
  }

  return `${base}-${Date.now()}`;
}
