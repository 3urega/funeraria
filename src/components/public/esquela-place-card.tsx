import type { Cemetery, Church } from "@/lib/db/schema";
import { resolvePlaceMapsUrl } from "@/lib/geo/resolve-maps-url";

type Place = Church | Cemetery;

type Props = {
  label: string;
  place: Place;
  mapsLinkLabel: string;
};

export function EsquelaPlaceCard({ label, place, mapsLinkLabel }: Props) {
  const mapsUrl = resolvePlaceMapsUrl(place);

  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <p
        className="text-xs font-semibold uppercase tracking-[0.15em]"
        style={{ color: "var(--brand-primary)" }}
      >
        {label}
      </p>
      <h3 className="mt-2 font-serif text-lg font-semibold text-zinc-900">
        {place.name}
      </h3>
      {place.city && (
        <p className="mt-1 text-sm text-zinc-600">{place.city}</p>
      )}
      {place.address && (
        <p className="mt-2 text-sm text-zinc-500">{place.address}</p>
      )}
      {mapsUrl ? (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm font-medium transition hover:underline"
          style={{ color: "var(--brand-primary)" }}
        >
          {mapsLinkLabel}
        </a>
      ) : null}
    </article>
  );
}
