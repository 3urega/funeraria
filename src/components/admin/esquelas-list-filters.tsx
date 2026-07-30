import Link from "next/link";
import {
  buildEsquelaListHref,
  clearEsquelaBooleanFilters,
  countEsquelaBooleanFilters,
  esquelaToggleFilterHref,
  type EsquelaListParams,
} from "@/lib/admin/list-params";

type FilterDef = {
  key: "active" | "visible" | "ready" | "photoPending" | "messagesPending";
  label: string;
};

const FILTERS: FilterDef[] = [
  { key: "active", label: "Actives" },
  { key: "visible", label: "Visibles" },
  { key: "ready", label: "Llestes" },
  { key: "photoPending", label: "Foto pendent" },
  { key: "messagesPending", label: "Missatges pendents" },
];

type Props = {
  basePath: string;
  params: EsquelaListParams;
};

/**
 * Barra unificada: filtres (add/remove) + cerca. Sense duplicats ni chips ambigua.
 */
export function EsquelasListFilters({ basePath, params }: Props) {
  const activeCount = countEsquelaBooleanFilters(params);
  const activeFilters = FILTERS.filter(({ key }) => params[key] === true);

  return (
    <section
      className="mb-4 space-y-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
      aria-label="Filtres i cerca"
    >
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          Filtrar per
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {FILTERS.map(({ key, label }) => {
            const isOn = params[key] === true;
            return (
              <Link
                key={key}
                href={esquelaToggleFilterHref(basePath, params, key)}
                aria-pressed={isOn}
                className={
                  isOn
                    ? "inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-zinc-800"
                    : "inline-flex items-center rounded-full border border-zinc-300 bg-zinc-50 px-3 py-1.5 text-sm text-zinc-700 transition hover:border-zinc-400 hover:bg-white"
                }
              >
                {isOn && (
                  <span aria-hidden className="text-xs opacity-80">
                    ✓
                  </span>
                )}
                {label}
              </Link>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-zinc-500">
          Clica un filtre per activar-lo; torna a clicar per desactivar-lo. Es
          poden combinar.
        </p>
      </div>

      {activeCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-t border-zinc-100 pt-3">
          <span className="text-xs font-medium text-zinc-600">
            Filtres actius ({activeCount}):
          </span>
          {activeFilters.map(({ key, label }) => (
            <Link
              key={key}
              href={esquelaToggleFilterHref(basePath, params, key)}
              className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-800 hover:bg-zinc-200"
              title={`Treure filtre «${label}»`}
            >
              {label}
              <span aria-hidden className="text-zinc-500">
                ×
              </span>
            </Link>
          ))}
          {activeCount >= 2 && (
            <Link
              href={buildEsquelaListHref(
                basePath,
                clearEsquelaBooleanFilters(params),
                { resetPage: true },
              )}
              className="text-xs font-medium text-blue-600 hover:underline"
            >
              Netejar tot
            </Link>
          )}
        </div>
      )}

      <form
        method="GET"
        action={basePath}
        className="flex flex-wrap gap-2 border-t border-zinc-100 pt-3"
      >
        {activeFilters.map(({ key }) => (
          <input key={key} type="hidden" name={key} value="1" />
        ))}
        <label className="sr-only" htmlFor="esquela-search">
          Cercar per nom o codi
        </label>
        <input
          id="esquela-search"
          type="search"
          name="q"
          defaultValue={params.q ?? ""}
          placeholder="Cercar per nom o codi…"
          className="min-w-[12rem] flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm"
        />
        <button
          type="submit"
          className="rounded-md bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Cercar
        </button>
        {params.q && (
          <Link
            href={buildEsquelaListHref(basePath, { ...params, q: undefined }, {
              resetPage: true,
            })}
            className="self-center text-sm text-zinc-600 hover:underline"
          >
            Esborrar cerca
          </Link>
        )}
      </form>
    </section>
  );
}
