export const locales = ["ca", "es"] as const;
export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "ca";

export const localeLabels: Record<AppLocale, string> = {
  ca: "Català",
  es: "Castellà",
};

export function isAppLocale(value: string): value is AppLocale {
  return locales.includes(value as AppLocale);
}

/** Prefix URL per locale (`as-needed`: català sense prefix). */
export function localePathPrefix(locale: AppLocale): string {
  return locale === defaultLocale ? "" : `/${locale}`;
}

export function localizedHref(href: string, locale: AppLocale): string {
  if (
    href.startsWith("#") ||
    href.startsWith("tel:") ||
    href.startsWith("mailto:")
  ) {
    return href;
  }
  const hashIndex = href.indexOf("#");
  const path = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : "";
  const prefix = localePathPrefix(locale);
  const fullPath = path === "/" ? prefix || "/" : `${prefix}${path}`;
  return `${fullPath}${hash}`;
}

export function getLocaleFromPathname(pathname: string): AppLocale {
  if (pathname === "/es" || pathname.startsWith("/es/")) return "es";
  return "ca";
}

export function stripLocaleFromPathname(pathname: string): string {
  if (pathname === "/es") return "/";
  if (pathname.startsWith("/es/")) return pathname.slice(3) || "/";
  return pathname;
}
