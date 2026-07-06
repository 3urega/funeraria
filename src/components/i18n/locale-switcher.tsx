"use client";

import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { AppLocale } from "@/i18n/config";
import { localeLabels, locales } from "@/i18n/config";

type Props = {
  className?: string;
  variant?: "light" | "dark";
};

export function LocaleSwitcher({
  className = "",
  variant = "light",
}: Props) {
  const t = useTranslations("locale");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();

  const base =
    variant === "dark"
      ? "text-white/80 hover:text-white"
      : "text-zinc-600 hover:text-[var(--brand-primary)]";

  return (
    <div className={`flex items-center gap-2 text-xs font-medium ${className}`}>
      <span className="sr-only">{t("label")}</span>
      {locales.map((loc) => (
        <Link
          key={loc}
          href={pathname}
          locale={loc}
          className={`rounded px-2 py-1 transition ${
            loc === locale
              ? variant === "dark"
                ? "bg-white/15 text-white"
                : "bg-zinc-100 text-[var(--brand-primary)]"
              : base
          }`}
          aria-current={loc === locale ? "true" : undefined}
        >
          {localeLabels[loc]}
        </Link>
      ))}
    </div>
  );
}
