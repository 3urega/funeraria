export type LocalizedString = Record<string, string>;

export function pickLocale(
  obj: LocalizedString | undefined | null,
  locale: string = "ca",
): string {
  if (!obj) return "";
  return obj[locale] ?? obj.ca ?? obj.es ?? "";
}

export const HOME_SECTION_KEYS = [
  "top_bar",
  "hero",
  "services",
  "why_us",
  "obituaries_intro",
  "cta_blocks",
  "footer",
] as const;

export type HomeSectionKey = (typeof HOME_SECTION_KEYS)[number];

export const PUJOLS_ASSETS = {
  logoUrl: "/funeraria pujols.png",
  heroImageUrl: "/gironella-10-1024x698.jpg",
  whyUsImageUrl: "/rescate/salas/sala1.png",
  textures: {
    services: "/rescate/texturas/white_bg.jpg",
    ctaMuted: "/rescate/texturas/texture_background_light.png",
    footer: "/rescate/texturas/top_bg.jpg",
  },
} as const;

export const PUJOLS_THEME = {
  primary: "#7B2427",
  dark: "#1E2A32",
  muted: "#F5F0E8",
  background: "#FAFAF8",
} as const;

import { HOME_CONTENT_I18N } from "./content-i18n";

export const DEFAULT_HOME_CONTENT = HOME_CONTENT_I18N;

export type HomePageData = {
  brandName: string;
  phone: string;
  email: string;
  address: string;
  website?: string;
  theme: {
    primary: string;
    dark: string;
    muted: string;
    background: string;
  };
  assets: typeof PUJOLS_ASSETS;
  topBar: {
    availabilityText: string;
    urgencyLabel: string;
  };
  hero: {
    title: string;
    subtitle: string;
    text: string;
    primaryButton: string;
    secondaryButton: string;
    secondaryButtonHref: string;
    imageUrl: string;
  };
  services: {
    eyebrow: string;
    heading: string;
    items: { icon: string; label: string }[];
    ctaLabel: string;
    ctaHref: string;
    textureUrl: string;
  };
  whyUs: {
    eyebrow: string;
    heading: string;
    imageUrl: string;
    features: { icon: string; title: string; text: string }[];
  };
  obituariesIntro: {
    eyebrow: string;
    heading: string;
    ctaLabel: string;
    maxItems: number;
  };
  ctaBlocks: {
    blocks: Array<{
      variant: "muted" | "dark";
      icon: string;
      title: string;
      text: string;
      linkLabel?: string;
      linkHref?: string;
      showPhone?: boolean;
    }>;
    mutedTextureUrl: string;
  };
  footer: {
    tagline: string;
    linkGroups: Array<{
      title: string;
      links: Array<{ label: string; href: string }>;
    }>;
    legal: Array<{ label: string; href: string }>;
    textureUrl: string;
    logoUrl: string;
  };
  logoUrl: string;
};
