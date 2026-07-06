import { PublicSiteShell } from "@/components/public/public-site-shell";
import { loadPublicSiteContext } from "@/lib/site/load-public-site-context";

export default async function FamilyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await loadPublicSiteContext();

  return <PublicSiteShell data={data}>{children}</PublicSiteShell>;
}
