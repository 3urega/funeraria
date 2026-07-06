import type { CSSProperties } from "react";
import type { Obituary } from "@/lib/db/schema";
import type { HomePageData } from "@/lib/home/defaults";
import { HomeHeader } from "./home-header";
import { HomeHero } from "./home-hero";
import { HomeServicesGrid } from "./home-services-grid";
import { HomeWhyUs } from "./home-why-us";
import { HomeRecentObituaries } from "./home-recent-obituaries";
import { HomeCtaBlocks } from "./home-cta-blocks";
import { HomeFooter } from "./home-footer";

type Props = {
  data: HomePageData;
  obituaries: Obituary[];
};

export async function HomePageLayout({ data, obituaries }: Props) {
  return (
    <div
      style={
        {
          "--brand-primary": data.theme.primary,
          "--brand-dark": data.theme.dark,
          "--brand-muted": data.theme.muted,
        } as CSSProperties
      }
    >
      <HomeHeader
        logoUrl={data.logoUrl}
        brandName={data.brandName}
        phone={data.phone}
      />
      <HomeHero
        title={data.hero.title}
        subtitle={data.hero.subtitle}
        text={data.hero.text}
        primaryButton={data.hero.primaryButton}
        secondaryButton={data.hero.secondaryButton}
        secondaryButtonHref={data.hero.secondaryButtonHref}
        imageUrl={data.hero.imageUrl}
        phone={data.phone}
      />
      <HomeServicesGrid
        eyebrow={data.services.eyebrow}
        heading={data.services.heading}
        items={data.services.items}
        ctaLabel={data.services.ctaLabel}
        ctaHref={data.services.ctaHref}
        textureUrl={data.services.textureUrl}
      />
      <HomeWhyUs
        eyebrow={data.whyUs.eyebrow}
        heading={data.whyUs.heading}
        imageUrl={data.whyUs.imageUrl}
        features={data.whyUs.features}
      />
      <HomeRecentObituaries
        eyebrow={data.obituariesIntro.eyebrow}
        heading={data.obituariesIntro.heading}
        ctaLabel={data.obituariesIntro.ctaLabel}
        maxItems={data.obituariesIntro.maxItems}
        obituaries={obituaries}
      />
      <HomeCtaBlocks
        blocks={data.ctaBlocks.blocks}
        mutedTextureUrl={data.ctaBlocks.mutedTextureUrl}
        phone={data.phone}
      />
      <HomeFooter
        brandName={data.brandName}
        logoUrl={data.footer.logoUrl}
        tagline={data.footer.tagline}
        phone={data.phone}
        email={data.email}
        address={data.address}
        linkGroups={data.footer.linkGroups}
        legal={data.footer.legal}
        textureUrl={data.footer.textureUrl}
      />
    </div>
  );
}
