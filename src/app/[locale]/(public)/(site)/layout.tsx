import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PublicSiteShell } from "@/components/public/public-site-shell";
import { loadPublicSiteContext } from "@/lib/site/load-public-site-context";
import { getTenantBranding } from "@/lib/site/tenant";

export async function generateMetadata(): Promise<Metadata> {
  const [{ brandName }, t] = await Promise.all([
    getTenantBranding(),
    getTranslations("metadata"),
  ]);

  return {
    title: {
      default: brandName,
      template: `%s | ${brandName}`,
    },
    description: t("description", { brandName }),
  };
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await loadPublicSiteContext();

  return <PublicSiteShell data={data}>{children}</PublicSiteShell>;
}
