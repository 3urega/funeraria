import { getLocale } from "next-intl/server";
import { getHomeContentSections, getSiteConfig } from "@/lib/db/queries";
import { buildHomePageData } from "@/lib/home/build-home-data";
import type { HomePageData } from "@/lib/home/defaults";
import { getTenantBranding } from "@/lib/site/tenant";

export async function loadPublicSiteContext(): Promise<HomePageData> {
  const locale = await getLocale();
  const [siteConfig, sections, { brandName }] = await Promise.all([
    getSiteConfig(),
    getHomeContentSections(),
    getTenantBranding(),
  ]);

  return buildHomePageData({
    siteConfig,
    sections,
    brandName,
    locale,
  });
}
