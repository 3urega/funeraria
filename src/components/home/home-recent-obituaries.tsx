import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ObituaryCard } from "@/components/public/obituary-card";
import { PublicSectionHeader } from "@/components/public/public-section-header";
import type { Obituary } from "@/lib/db/schema";

type Props = {
  eyebrow: string;
  heading: string;
  ctaLabel: string;
  maxItems: number;
  obituaries: Obituary[];
};

export async function HomeRecentObituaries({
  eyebrow,
  heading,
  ctaLabel,
  maxItems,
  obituaries,
}: Props) {
  const t = await getTranslations("common");
  const items = obituaries.slice(0, maxItems);

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <PublicSectionHeader eyebrow={eyebrow} heading={heading} />

        {items.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((o) => (
              <ObituaryCard key={o.id} obituary={o} />
            ))}
          </div>
        ) : (
          <p className="mt-12 text-zinc-500">{t("noObituaries")}</p>
        )}

        <Link
          href="/esquelas"
          className="mt-12 inline-block rounded border border-zinc-300 px-8 py-3 text-sm font-medium text-zinc-800 transition hover:border-zinc-400"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
