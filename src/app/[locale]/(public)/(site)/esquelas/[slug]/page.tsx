import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  getObituaryBySlug,
  getObituaryWithPlaces,
  getFuneralHomeById,
  getSiteConfig,
} from "@/lib/db/queries";
import { getStorage } from "@/lib/storage";
import { EsquelaView } from "@/components/family/esquela-view";
import { EsquelaPlacesSection } from "@/components/public/esquela-places-section";
import { FlowerCatalogSection } from "@/components/public/flower-catalog-section";
import { CommemorativeMessageSection } from "@/components/public/commemorative-message-section";

type Props = { params: Promise<{ slug: string; locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTranslations("obituaries");
  const obituary = await getObituaryBySlug(slug);
  if (!obituary || !obituary.isVisible) {
    return { title: t("notFound") };
  }
  return {
    title: `${obituary.name}`,
    description:
      obituary.deathNotice ?? `${obituary.name}`,
  };
}

export default async function EsquelaDetailPage({ params }: Props) {
  const { slug } = await params;
  const t = await getTranslations("obituaries");
  const obituary = await getObituaryBySlug(slug);

  if (!obituary || !obituary.isVisible) {
    notFound();
  }

  const [data, siteConfig, funeralHome] = await Promise.all([
    getObituaryWithPlaces(obituary.id),
    getSiteConfig(),
    getFuneralHomeById(obituary.funeralHomeId),
  ]);
  if (!data) notFound();

  const storage = getStorage();
  const officialImageUrl = data.obituary.imagePath
    ? storage.getPublicUrl(data.obituary.imagePath)
    : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <EsquelaView
        obituary={data.obituary}
        officialImageUrl={officialImageUrl}
        funeralHomeName={funeralHome?.name ?? "Funerària"}
        siteConfig={
          siteConfig
            ? {
                contact: siteConfig.contact,
                theme: siteConfig.theme,
                brandName: siteConfig.brandName,
                mortuaryDefault: siteConfig.mortuaryDefault,
              }
            : null
        }
        church={data.church ?? null}
        cemetery={data.cemetery ?? null}
        wakeRoom={data.wakeRoom ?? null}
      />

      <EsquelaPlacesSection
        church={data.church ?? null}
        cemetery={data.cemetery ?? null}
      />

      <FlowerCatalogSection obituaryId={data.obituary.id} />

      <CommemorativeMessageSection obituaryId={data.obituary.id} />

      {data.poemTemplate || data.obituary.obituarioText ? (
        <section className="mt-8 rounded-lg border bg-zinc-50 p-6">
          <h2 className="mb-4 text-xl font-semibold">{t("obituarySection")}</h2>
          {data.poemTemplate && (
            <blockquote className="mb-4 border-l-4 border-blue-400 pl-4 italic text-zinc-700">
              <p className="mb-1 text-sm font-medium not-italic">
                {data.poemTemplate.title}
              </p>
              {data.poemTemplate.text.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </blockquote>
          )}
          {data.obituary.obituarioText && (
            <p className="whitespace-pre-line text-zinc-700">
              {data.obituary.obituarioText}
            </p>
          )}
        </section>
      ) : null}
    </div>
  );
}
