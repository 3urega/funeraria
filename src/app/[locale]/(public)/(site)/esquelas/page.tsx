import { getTranslations } from "next-intl/server";
import { ObituaryCard } from "@/components/public/obituary-card";
import { PublicSectionHeader } from "@/components/public/public-section-header";
import { getVisibleObituaries } from "@/lib/db/queries";
import { PUJOLS_ASSETS } from "@/lib/home/defaults";
import { loadPublicSiteContext } from "@/lib/site/load-public-site-context";

export async function generateMetadata() {
  const t = await getTranslations("obituaries");
  return { title: t("title") };
}

export default async function EsquelasPage() {
  const t = await getTranslations("obituaries");
  const [data, obituaries] = await Promise.all([
    loadPublicSiteContext(),
    getVisibleObituaries(),
  ]);

  return (
    <section
      className="py-16 lg:py-20"
      style={{
        backgroundImage: `url(${PUJOLS_ASSETS.textures.services})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mx-auto max-w-7xl px-4">
        <PublicSectionHeader
          eyebrow={t("eyebrow")}
          heading={data.obituariesIntro.heading}
        />

        {obituaries.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {obituaries.map((o) => (
              <ObituaryCard key={o.id} obituary={o} />
            ))}
          </div>
        ) : (
          <p className="mt-12 text-center text-zinc-500">{t("empty")}</p>
        )}
      </div>
    </section>
  );
}
