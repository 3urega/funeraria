import type { EsquelaPrintData } from "@/lib/esquela/types";
import { formatEsquelaBrandName } from "@/lib/esquela/format-brand-name";

type Props = {
  data: EsquelaPrintData;
  className?: string;
};

const DEFAULT_BRAND_COLOR = "#7B2427";

/** Plantilla d'esquela impresa — patró Funerària Pujols. */
export function EsquelaPrintLayout({ data, className = "" }: Props) {
  const brandColor = data.brandColor ?? DEFAULT_BRAND_COLOR;
  const brand = formatEsquelaBrandName(data.brandName);

  const hasBody =
    data.deathLine ||
    data.funeralLine1 ||
    data.mortuaryLine ||
    data.wakeLine1;

  return (
    <article
      className={`esquela-print mx-auto max-w-[720px] bg-white px-6 py-8 sm:px-10 ${className}`}
    >
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <h1 className="font-sans text-xl font-bold leading-tight" style={{ color: brandColor }}>
          {brand.emphasis ? (
            <>
              {brand.prefix}{" "}
              <span className="uppercase">{brand.emphasis}</span>
            </>
          ) : (
            brand.prefix
          )}
        </h1>
        {(data.contact.address ||
          data.contact.phone ||
          data.contact.email ||
          data.contact.website) && (
          <address className="font-sans text-[11px] not-italic leading-snug text-[#666] sm:text-right">
            {data.contact.address && <div>{data.contact.address}</div>}
            {data.contact.phone && <div>Telèfon: {data.contact.phone}</div>}
            {data.contact.email && <div>e-mail: {data.contact.email}</div>}
            {data.contact.website && <div>{data.contact.website}</div>}
          </address>
        )}
      </header>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        {data.photoUrl && (
          <div className="mx-auto shrink-0 sm:mx-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.photoUrl}
              alt={data.deceasedName}
              className="aspect-[3/4] w-[132px] border border-zinc-300 object-cover"
            />
          </div>
        )}

        <div className="min-w-0 flex-1 font-serif text-[15px] leading-relaxed text-black">
          <h2 className="text-[26px] font-bold uppercase tracking-wide">
            {data.deceasedName}
          </h2>

          {!hasBody && (
            <p className="mt-4 text-sm text-zinc-500">
              L&apos;empleat encara no ha publicat el text de l&apos;esquela.
            </p>
          )}

          {data.deathLine && (
            <p className="mt-3">{data.deathLine}</p>
          )}

          {data.showEpd && hasBody && (
            <p className="my-4 text-center font-normal tracking-[0.25em]">
              E.P.D.
            </p>
          )}

          {data.funeralLine1 && (
            <p className="font-bold">{data.funeralLine1}</p>
          )}

          {data.funeralLine2 && (
            <p className="font-bold">{data.funeralLine2}</p>
          )}

          {data.mortuaryLine && (
            <p className="mt-3">{data.mortuaryLine}</p>
          )}

          {data.wakeLine1 && (
            <p className="mt-3">{data.wakeLine1}</p>
          )}

          {data.wakeLine2 && (
            <p className="mt-1 pl-8 font-bold">{data.wakeLine2}</p>
          )}
        </div>
      </div>
    </article>
  );
}
