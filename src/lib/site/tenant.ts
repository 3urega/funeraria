import type { Metadata } from "next";
import { getEnv } from "@/lib/config/env";
import { getFuneralHomeById, getSiteConfig } from "@/lib/db/queries";

/** Funerària activa d'aquesta instància (una per desplegament). */
export function getFuneralHomeId(): string {
  return getEnv().FUNERAL_HOME_ID;
}

/** Nom comercial visible: `site_config.brand_name` → `funeral_homes.name`. */
export function resolveBrandName(
  site: { brandName?: string | null } | null | undefined,
  funeralHome: { name?: string } | null | undefined,
): string {
  const fromSite = site?.brandName?.trim();
  if (fromSite) return fromSite;
  const fromHome = funeralHome?.name?.trim();
  if (fromHome) return fromHome;
  return "Funerària";
}

export async function getTenantBranding() {
  const funeralHomeId = getFuneralHomeId();
  const [siteConfig, funeralHome] = await Promise.all([
    getSiteConfig(),
    getFuneralHomeById(funeralHomeId),
  ]);

  return {
    funeralHomeId,
    brandName: resolveBrandName(siteConfig, funeralHome),
    siteConfig,
    funeralHome,
  };
}

export async function getTenantMetadata(): Promise<Metadata> {
  const { brandName } = await getTenantBranding();
  return {
    title: {
      default: brandName,
      template: `%s | ${brandName}`,
    },
    description: `Web de ${brandName}`,
  };
}
