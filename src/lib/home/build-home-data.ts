import type { Obituary } from "@/lib/db/schema";
import type { siteConfig as siteConfigTable } from "@/lib/db/schema";
import {
  DEFAULT_HOME_CONTENT,
  PUJOLS_ASSETS,
  PUJOLS_THEME,
  pickLocale,
  type HomePageData,
  type HomeSectionKey,
  type LocalizedString,
} from "./defaults";

type SiteConfig = typeof siteConfigTable.$inferSelect;

type SectionMap = Partial<Record<HomeSectionKey, Record<string, unknown>>>;

function isLocalizedString(value: unknown): value is LocalizedString {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const keys = Object.keys(value);
  return keys.length > 0 && keys.every((k) => k === "ca" || k === "es" || k === "en");
}

function mergeLocalized(
  defaults: LocalizedString | undefined,
  fromDb: unknown,
): LocalizedString {
  if (!fromDb || !isLocalizedString(fromDb)) return defaults ?? {};
  return { ...(defaults ?? {}), ...fromDb };
}

function mergeSection<T extends Record<string, unknown>>(
  defaults: T,
  fromDb: Record<string, unknown> | undefined,
): T {
  if (!fromDb) return defaults;

  const merged = { ...defaults } as Record<string, unknown>;

  for (const [key, dbValue] of Object.entries(fromDb)) {
    const defaultValue = defaults[key];

    if (isLocalizedString(defaultValue) && isLocalizedString(dbValue)) {
      merged[key] = mergeLocalized(defaultValue, dbValue);
      continue;
    }

    if (key === "items" && Array.isArray(defaultValue) && Array.isArray(dbValue)) {
      merged[key] = dbValue.map((item, index) => {
        const base = (defaultValue[index] ?? {}) as Record<string, unknown>;
        const row = item as Record<string, unknown>;
        return {
          ...base,
          ...row,
          label: mergeLocalized(
            base.label as LocalizedString | undefined,
            row.label,
          ),
        };
      });
      continue;
    }

    if (key === "features" && Array.isArray(defaultValue) && Array.isArray(dbValue)) {
      merged[key] = dbValue.map((item, index) => {
        const base = (defaultValue[index] ?? {}) as Record<string, unknown>;
        const row = item as Record<string, unknown>;
        return {
          ...base,
          ...row,
          title: mergeLocalized(
            base.title as LocalizedString | undefined,
            row.title,
          ),
          text: mergeLocalized(
            base.text as LocalizedString | undefined,
            row.text,
          ),
        };
      });
      continue;
    }

    if (key === "blocks" && Array.isArray(defaultValue) && Array.isArray(dbValue)) {
      merged[key] = dbValue.map((item, index) => {
        const base = (defaultValue[index] ?? {}) as Record<string, unknown>;
        const row = item as Record<string, unknown>;
        return {
          ...base,
          ...row,
          title: mergeLocalized(
            base.title as LocalizedString | undefined,
            row.title,
          ),
          text: mergeLocalized(
            base.text as LocalizedString | undefined,
            row.text,
          ),
          linkLabel: row.linkLabel
            ? mergeLocalized(
                base.linkLabel as LocalizedString | undefined,
                row.linkLabel,
              )
            : base.linkLabel,
        };
      });
      continue;
    }

    if (key === "linkGroups" && Array.isArray(defaultValue) && Array.isArray(dbValue)) {
      merged[key] = dbValue.map((item, index) => {
        const base = (defaultValue[index] ?? {}) as Record<string, unknown>;
        const row = item as Record<string, unknown>;
        const baseLinks = (base.links as Array<Record<string, unknown>>) ?? [];
        const rowLinks = (row.links as Array<Record<string, unknown>>) ?? [];
        return {
          ...base,
          ...row,
          title: mergeLocalized(
            base.title as LocalizedString | undefined,
            row.title,
          ),
          links: rowLinks.map((link, linkIndex) => {
            const baseLink = baseLinks[linkIndex] ?? {};
            return {
              ...baseLink,
              ...link,
              label: mergeLocalized(
                baseLink.label as LocalizedString | undefined,
                link.label,
              ),
            };
          }),
        };
      });
      continue;
    }

    if (key === "legal" && Array.isArray(defaultValue) && Array.isArray(dbValue)) {
      merged[key] = dbValue.map((item, index) => {
        const base = (defaultValue[index] ?? {}) as Record<string, unknown>;
        const row = item as Record<string, unknown>;
        return {
          ...base,
          ...row,
          label: mergeLocalized(
            base.label as LocalizedString | undefined,
            row.label,
          ),
        };
      });
      continue;
    }

    merged[key] = dbValue;
  }

  return merged as T;
}

function mapLocalizedItems(
  items: Array<{ icon: string; label: LocalizedString }> | undefined,
  locale: string,
) {
  return (items ?? []).map((item) => ({
    icon: item.icon,
    label: pickLocale(item.label, locale),
  }));
}

function mapFeatures(
  features:
    | Array<{
        icon: string;
        title: LocalizedString;
        text: LocalizedString;
      }>
    | undefined,
  locale: string,
) {
  return (features ?? []).map((f) => ({
    icon: f.icon,
    title: pickLocale(f.title, locale),
    text: pickLocale(f.text, locale),
  }));
}

function mapLinkGroups(
  groups:
    | Array<{
        title: LocalizedString;
        links: Array<{ label: LocalizedString; href: string }>;
      }>
    | undefined,
  locale: string,
) {
  return (groups ?? []).map((g) => ({
    title: pickLocale(g.title, locale),
    links: g.links.map((l) => ({
      label: pickLocale(l.label, locale),
      href: l.href,
    })),
  }));
}

export function buildHomePageData({
  siteConfig,
  sections,
  brandName,
  locale = "ca",
}: {
  siteConfig: SiteConfig | null | undefined;
  sections: SectionMap;
  brandName: string;
  locale?: string;
}): HomePageData {
  const themeFromDb = siteConfig?.theme ?? {};
  const theme = {
    primary: themeFromDb.primary ?? PUJOLS_THEME.primary,
    dark: themeFromDb.dark ?? PUJOLS_THEME.dark,
    muted: themeFromDb.muted ?? PUJOLS_THEME.muted,
    background: themeFromDb.background ?? PUJOLS_THEME.background,
  };

  const contact = siteConfig?.contact;
  const phone = contact?.phone ?? "938250119";
  const email = contact?.email ?? "";
  const address = contact?.address ?? "";

  const logoUrl =
    themeFromDb.publicLogoPath ?? PUJOLS_ASSETS.logoUrl;
  const heroImageUrl =
    themeFromDb.heroImagePath ?? PUJOLS_ASSETS.heroImageUrl;

  const topBar = mergeSection(
    DEFAULT_HOME_CONTENT.topBar,
    sections.top_bar,
  );
  const hero = mergeSection(DEFAULT_HOME_CONTENT.hero, sections.hero);
  const services = mergeSection(
    DEFAULT_HOME_CONTENT.services,
    sections.services,
  );
  const whyUs = mergeSection(DEFAULT_HOME_CONTENT.whyUs, sections.why_us);
  const obituariesIntro = mergeSection(
    DEFAULT_HOME_CONTENT.obituariesIntro,
    sections.obituaries_intro,
  );
  const ctaBlocks = mergeSection(
    DEFAULT_HOME_CONTENT.ctaBlocks,
    sections.cta_blocks,
  );
  const footer = mergeSection(DEFAULT_HOME_CONTENT.footer, sections.footer);

  const whyUsImagePath =
    (sections.why_us?.imagePath as string | undefined) ??
    PUJOLS_ASSETS.whyUsImageUrl;

  return {
    brandName,
    phone,
    email,
    address,
    website: contact?.website,
    theme,
    assets: PUJOLS_ASSETS,
    logoUrl,
    topBar: {
      availabilityText: pickLocale(topBar.availabilityText, locale),
      urgencyLabel: pickLocale(topBar.urgencyLabel, locale),
    },
    hero: {
      title: pickLocale(hero.title, locale),
      subtitle: pickLocale(hero.subtitle, locale),
      text: pickLocale(hero.text, locale),
      primaryButton: pickLocale(hero.primaryButton, locale),
      secondaryButton: pickLocale(hero.secondaryButton, locale),
      secondaryButtonHref: hero.secondaryButtonHref ?? "#servicios",
      imageUrl: heroImageUrl,
    },
    services: {
      eyebrow: pickLocale(services.eyebrow, locale),
      heading: pickLocale(services.heading, locale),
      items: mapLocalizedItems(services.items, locale),
      ctaLabel: pickLocale(services.ctaLabel, locale),
      ctaHref: services.ctaHref ?? "#servicios",
      textureUrl: PUJOLS_ASSETS.textures.services,
    },
    whyUs: {
      eyebrow: pickLocale(whyUs.eyebrow, locale),
      heading: pickLocale(whyUs.heading, locale),
      imageUrl: whyUsImagePath,
      features: mapFeatures(whyUs.features, locale),
    },
    obituariesIntro: {
      eyebrow: pickLocale(obituariesIntro.eyebrow, locale),
      heading: pickLocale(obituariesIntro.heading, locale),
      ctaLabel: pickLocale(obituariesIntro.ctaLabel, locale),
      maxItems: obituariesIntro.maxItems ?? 4,
    },
    ctaBlocks: {
      blocks: (ctaBlocks.blocks ?? []).map((block) => ({
        variant: block.variant,
        icon: block.icon,
        title: pickLocale(block.title, locale),
        text: pickLocale(block.text, locale),
        linkLabel: block.linkLabel
          ? pickLocale(block.linkLabel, locale)
          : undefined,
        linkHref: block.linkHref,
        showPhone: block.showPhone,
      })),
      mutedTextureUrl: PUJOLS_ASSETS.textures.ctaMuted,
    },
    footer: {
      tagline: pickLocale(footer.tagline, locale),
      linkGroups: mapLinkGroups(footer.linkGroups, locale),
      legal: (footer.legal ?? []).map((l) => ({
        label: pickLocale(l.label, locale),
        href: l.href,
      })),
      textureUrl: PUJOLS_ASSETS.textures.footer,
      logoUrl,
    },
  };
}

export type { Obituary };
