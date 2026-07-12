import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/i18n/locale-switcher";
import { localizedHref, type AppLocale } from "@/i18n/config";

type Props = {
  id?: string;
  brandName: string;
  logoUrl: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  whatsapp?: string;
  linkGroups: Array<{
    title: string;
    links: Array<{ label: string; href: string }>;
  }>;
  legal: Array<{ label: string; href: string }>;
  textureUrl: string;
};

function FooterHref({
  href,
  locale,
  className,
  children,
}: {
  href: string;
  locale: AppLocale;
  className: string;
  children: React.ReactNode;
}) {
  if (href.startsWith("#") || href.startsWith("/#")) {
    return (
      <a href={localizedHref(href.startsWith("#") ? `/${href}` : href, locale)} className={className}>
        {children}
      </a>
    );
  }
  if (href === "/" || href === "/esquelas" || href === "/sales-de-vetlla" || href === "/acceso") {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

export async function HomeFooter({
  id = "contacto",
  brandName,
  logoUrl,
  tagline,
  phone,
  email,
  address,
  whatsapp,
  linkGroups,
  legal,
  textureUrl,
}: Props) {
  const tNav = await getTranslations("nav");
  const locale = (await getLocale()) as AppLocale;

  return (
    <footer
      id={id}
      className="bg-marble text-white"
      style={{
        backgroundImage: `linear-gradient(rgba(30,42,50,0.95), rgba(30,42,50,0.98)), url(${textureUrl})`,
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image
              src={logoUrl}
              alt={brandName}
              width={140}
              height={56}
              className="mb-4 h-12 w-auto brightness-0 invert"
            />
            <p className="text-sm leading-relaxed text-white/70">{tagline}</p>
            <div className="mt-4">
              <LocaleSwitcher variant="dark" />
            </div>
          </div>

          {linkGroups.map((group) => (
            <div key={group.title}>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                {group.title}
              </h4>
              <ul className="space-y-2 text-sm text-white/70">
                {group.links.map((link) => (
                  <li key={link.href + link.label}>
                    <FooterHref
                      href={link.href}
                      locale={locale}
                      className="hover:text-white"
                    >
                      {link.label}
                    </FooterHref>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              {tNav("contact")}
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="hover:text-white"
                >
                  {phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="hover:text-white">
                  {email}
                </a>
              </li>
              <li>{address}</li>
              {whatsapp && (
                <li>
                  <a
                    href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-white"
                  >
                    WhatsApp
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/50 sm:flex-row">
          <span>
            © {new Date().getFullYear()} {brandName}
          </span>
          <div className="flex flex-wrap justify-center gap-4">
            {legal.map((l) => (
              <FooterHref
                key={l.label}
                href={l.href}
                locale={locale}
                className="hover:text-white/80"
              >
                {l.label}
              </FooterHref>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
