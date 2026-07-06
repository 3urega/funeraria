"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/i18n/locale-switcher";
import { localizedHref, type AppLocale } from "@/i18n/config";
import { PhoneIcon } from "./home-icons";

type RouteHref = "/" | "/esquelas" | "/sales-de-vetlla" | "/acceso";
type NavItem =
  | { kind: "route"; href: RouteHref; label: string }
  | { kind: "anchor"; hash: string; label: string };

type Props = {
  logoUrl: string;
  brandName: string;
  phone: string;
};

function NavItemLink({
  item,
  locale,
  className,
  onClick,
}: {
  item: NavItem;
  locale: AppLocale;
  className: string;
  onClick?: () => void;
}) {
  if (item.kind === "anchor") {
    return (
      <a
        href={localizedHref(`/#${item.hash}`, locale)}
        className={className}
        onClick={onClick}
      >
        {item.label}
      </a>
    );
  }
  return (
    <Link href={item.href} className={className} onClick={onClick}>
      {item.label}
    </Link>
  );
}

export function HomeHeader({ logoUrl, brandName, phone }: Props) {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const locale = useLocale() as AppLocale;
  const [open, setOpen] = useState(false);

  const navItems: NavItem[] = [
    { kind: "route", href: "/", label: t("home") },
    { kind: "anchor", hash: "servicios", label: t("services") },
    { kind: "route", href: "/esquelas", label: t("obituaries") },
    { kind: "route", href: "/sales-de-vetlla", label: t("wakeRooms") },
    { kind: "anchor", hash: "contacto", label: t("contact") },
    { kind: "route", href: "/acceso", label: t("familyAccess") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src={logoUrl}
            alt={brandName}
            width={160}
            height={64}
            className="h-14 w-auto object-contain sm:h-16"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-5 text-xs font-medium uppercase tracking-wide text-zinc-600 lg:flex">
          {navItems.map((item) => (
            <NavItemLink
              key={item.label}
              item={item}
              locale={locale}
              className="transition hover:text-[var(--brand-primary)]"
            />
          ))}
          <LocaleSwitcher />
        </nav>

        <a
          href={`tel:${phone.replace(/\s/g, "")}`}
          className="hidden items-center gap-2 rounded border border-zinc-200 px-3 py-2 text-sm lg:flex"
        >
          <PhoneIcon className="h-4 w-4 text-[var(--brand-primary)]" />
          <div className="text-left leading-tight">
            <div className="font-semibold text-zinc-900">{phone}</div>
            <div className="text-[10px] uppercase tracking-wider text-zinc-500">
              {tc("phone")}
            </div>
          </div>
        </a>

        <div className="flex items-center gap-2 lg:hidden">
          <LocaleSwitcher />
          <button
            type="button"
            className="rounded border border-zinc-200 px-3 py-2 text-sm"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={tc("menu")}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-zinc-100 bg-white px-4 py-3 lg:hidden">
          <div className="flex flex-col gap-3 text-sm">
            {navItems.map((item) => (
              <NavItemLink
                key={item.label}
                item={item}
                locale={locale}
                className="text-zinc-700"
                onClick={() => setOpen(false)}
              />
            ))}
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="font-semibold text-[var(--brand-primary)]"
            >
              {phone}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
