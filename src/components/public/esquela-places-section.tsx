import { getTranslations } from "next-intl/server";
import type { Cemetery, Church } from "@/lib/db/schema";
import { EsquelaPlaceCard } from "./esquela-place-card";
import { PublicSectionHeader } from "./public-section-header";

type Props = {
  church: Church | null;
  cemetery: Cemetery | null;
};

export async function EsquelaPlacesSection({ church, cemetery }: Props) {
  if (!church && !cemetery) return null;

  const t = await getTranslations("obituaries.places");

  return (
    <section className="mt-10">
      <PublicSectionHeader eyebrow={t("eyebrow")} heading={t("heading")} />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {church && (
          <EsquelaPlaceCard
            label={t("churchLabel")}
            place={church}
            mapsLinkLabel={t("mapsLink")}
          />
        )}
        {cemetery && (
          <EsquelaPlaceCard
            label={t("cemeteryLabel")}
            place={cemetery}
            mapsLinkLabel={t("mapsLink")}
          />
        )}
      </div>
    </section>
  );
}
