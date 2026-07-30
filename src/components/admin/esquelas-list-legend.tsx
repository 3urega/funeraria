type LegendItem = {
  term: string;
  detail: string;
  border: string;
  dot: string;
  badge: string;
};

const ITEMS: LegendItem[] = [
  {
    term: "Codi",
    detail:
      "Codi de visita per a familiars (zona familiar) i per compartir amb la família.",
    border: "border-l-sky-500",
    dot: "bg-sky-500",
    badge: "bg-sky-100 text-sky-800",
  },
  {
    term: "Activa",
    detail:
      "El familiar pot entrar amb el codi. Si està desactivada, el codi no funciona.",
    border: "border-l-emerald-500",
    dot: "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-800",
  },
  {
    term: "Visible",
    detail:
      "L'esquela apareix al llistat públic de la web (/esquelas) i a la home.",
    border: "border-l-indigo-500",
    dot: "bg-indigo-500",
    badge: "bg-indigo-100 text-indigo-800",
  },
  {
    term: "Llesta",
    detail:
      "Marca interna: la ficha està completa i revisada. És independent d'Activa i Visible — pots publicar abans de marcar-la com a llesta.",
    border: "border-l-violet-500",
    dot: "bg-violet-500",
    badge: "bg-violet-100 text-violet-800",
  },
  {
    term: "Foto familiar",
    detail:
      "Foto enviada pel familiar que encara cal retocar o que s'ha rebutjat.",
    border: "border-l-amber-500",
    dot: "bg-amber-500",
    badge: "bg-amber-100 text-amber-900",
  },
  {
    term: "Missatges",
    detail:
      "Missatges conmemoratius de visitants pendents de revisar des de l'esquela.",
    border: "border-l-orange-500",
    dot: "bg-orange-500",
    badge: "bg-orange-100 text-orange-900",
  },
];

/**
 * Llegenda de columnes i estats de la llista `/admin/esquelas`.
 */
export function EsquelasListLegend() {
  return (
    <section
      className="mb-4 overflow-hidden rounded-xl border border-zinc-200/80 bg-gradient-to-br from-zinc-50 via-white to-zinc-50 shadow-sm"
      aria-label="Llegenda de columnes"
    >
      <header className="flex items-start gap-3 border-b border-zinc-100 bg-white/70 px-4 py-3.5 sm:px-5">
        <span
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-sm font-semibold text-white shadow-sm"
          aria-hidden
        >
          i
        </span>
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-zinc-900">
            Llegenda de columnes
          </h2>
          <p className="mt-0.5 text-xs text-zinc-500">
            Passa el cursor per sobre de cada capçalera de la taula per veure
            un resum ràpid.
          </p>
        </div>
      </header>

      <dl className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
        {ITEMS.map(({ term, detail, border, dot, badge }) => (
          <div
            key={term}
            className={`rounded-lg border border-zinc-100 border-l-4 bg-white p-3.5 shadow-sm ring-1 ring-black/[0.02] transition hover:-translate-y-px hover:shadow-md ${border}`}
          >
            <div className="mb-2 flex items-center gap-2">
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${dot}`}
                aria-hidden
              />
              <dt>
                <span
                  className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${badge}`}
                >
                  {term}
                </span>
              </dt>
            </div>
            <dd className="text-xs leading-relaxed text-zinc-600">{detail}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
