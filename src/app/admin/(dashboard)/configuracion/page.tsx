import { notFound } from "next/navigation";
import Link from "next/link";
import { SiteConfigForm } from "@/components/admin/site-config-form";
import { getSiteConfig } from "@/lib/db/queries";
import { getStorage } from "@/lib/storage";
import { PUJOLS_ASSETS } from "@/lib/home/defaults";

export const metadata = { title: "Admin — Configuració" };

export default async function AdminConfiguracionPage() {
  const config = await getSiteConfig();
  if (!config) notFound();

  const storage = getStorage();
  const theme = config.theme ?? {};
  const logoUrl =
    theme.publicLogoPath ??
    (config.logoPath
      ? storage.getPublicUrl(config.logoPath)
      : PUJOLS_ASSETS.logoUrl);
  const heroImageUrl =
    theme.heroImagePath ?? PUJOLS_ASSETS.heroImageUrl;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Configuració de la funerària</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Marca, contacte, colors i imatges globals del lloc.
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="rounded-md border px-4 py-2 text-sm hover:bg-zinc-50"
        >
          Obrir web pública →
        </Link>
      </div>
      <SiteConfigForm
        config={config}
        logoUrl={logoUrl}
        heroImageUrl={heroImageUrl}
      />
    </div>
  );
}
