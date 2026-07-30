type Props = {
  /** Ruta del formulari GET (ex. `/admin/esquelas`). */
  basePath: string;
  q?: string;
  /** Params a preservar com a hidden inputs (filtres actius). */
  hiddenParams?: Record<string, string | undefined>;
};

/**
 * Cerca per query string via formulari GET (RSC-friendly).
 */
export function AdminListSearch({
  basePath,
  q,
  hiddenParams = {},
}: Props) {
  return (
    <form method="GET" action={basePath} className="mb-4 flex flex-wrap gap-2">
      {Object.entries(hiddenParams).map(([key, value]) =>
        value ? (
          <input key={key} type="hidden" name={key} value={value} />
        ) : null,
      )}
      <input
        type="search"
        name="q"
        defaultValue={q ?? ""}
        placeholder="Cercar per nom o codi…"
        className="min-w-[12rem] flex-1 rounded-md border border-zinc-300 px-3 py-1.5 text-sm"
      />
      <button
        type="submit"
        className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm hover:bg-zinc-50"
      >
        Cercar
      </button>
    </form>
  );
}
