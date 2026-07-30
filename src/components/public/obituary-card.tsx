import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getStorage } from "@/lib/storage";
import { mediaPublicUrl } from "@/lib/storage/public-url";
import type { Obituary } from "@/lib/db/schema";

export async function ObituaryCard({ obituary }: { obituary: Obituary }) {
  const t = await getTranslations("common");
  const storage = getStorage();
  const imageUrl = obituary.imagePath
    ? mediaPublicUrl(storage, obituary.imagePath, obituary.updatedAt)
    : null;

  return (
    <Link
      href={`/esquelas/${obituary.slug}`}
      className="group block overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="aspect-[4/3] overflow-hidden bg-zinc-100">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={obituary.name}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-400">
            {t("noPhoto")}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-serif text-lg font-semibold text-zinc-900">
          {obituary.name}
        </h3>
        {obituary.funeralDatetime && (
          <p className="mt-1 text-sm text-zinc-500">
            {obituary.funeralDatetime}
          </p>
        )}
        <span
          className="mt-3 inline-block text-sm font-medium transition group-hover:underline"
          style={{ color: "var(--brand-primary)" }}
        >
          {t("seeTribute")}
        </span>
      </div>
    </Link>
  );
}
