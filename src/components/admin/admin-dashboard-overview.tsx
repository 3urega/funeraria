import Link from "next/link";

type SummaryStat = {
  label: string;
  value: number;
  description: string;
  href: string;
  cta: string;
  border: string;
  dot: string;
  badge: string;
};

type PendingStat = {
  label: string;
  value: number;
  description: string;
  href: string;
  cta: string;
};

type Props = {
  total: number;
  active: number;
  visible: number;
  pendingFamilyPhotos: number;
  unreviewedMessages: number;
};

const SUMMARY_STATS = (
  total: number,
  active: number,
  visible: number,
): SummaryStat[] => [
  {
    label: "Total esqueles",
    value: total,
    description:
      "Fitxes creades al backoffice. Inclou esborranys, actives i arxivades — és el recompte global del catàleg.",
    href: "/admin/esquelas",
    cta: "Veure totes les esqueles",
    border: "border-l-zinc-400",
    dot: "bg-zinc-400",
    badge: "bg-zinc-100 text-zinc-800",
  },
  {
    label: "Actives",
    value: active,
    description:
      "Esqueles amb el codi familiar operatiu. El familiar pot entrar a la zona familiar; si està desactivada, el codi no funciona.",
    href: "/admin/esquelas?active=1",
    cta: "Veure esqueles actives",
    border: "border-l-emerald-500",
    dot: "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-800",
  },
  {
    label: "Públiques",
    value: visible,
    description:
      "Esqueles visibles al llistat públic de la web (/esquelas) i a la home. Independent d'Activa: pots tenir codi actiu sense mostrar-la encara.",
    href: "/admin/esquelas?visible=1",
    cta: "Veure esqueles públiques",
    border: "border-l-indigo-500",
    dot: "bg-indigo-500",
    badge: "bg-indigo-100 text-indigo-800",
  },
];

function SummaryCard({
  label,
  value,
  description,
  href,
  cta,
  border,
  dot,
  badge,
}: SummaryStat) {
  return (
    <Link
      href={href}
      className={`group block rounded-xl border border-zinc-200/80 border-l-4 bg-white p-5 shadow-sm ring-1 ring-black/[0.02] transition hover:-translate-y-px hover:border-zinc-300 hover:shadow-md ${border}`}
    >
      <div className="mb-3 flex items-center gap-2">
        <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} aria-hidden />
        <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${badge}`}>
          {label}
        </span>
      </div>
      <p className="text-3xl font-bold tabular-nums tracking-tight text-zinc-900">
        {value}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-zinc-600">{description}</p>
      <p className="mt-3 text-xs font-medium text-zinc-500 group-hover:text-zinc-800 group-hover:underline">
        {cta} →
      </p>
    </Link>
  );
}

function PendingCard({ label, value, description, href, cta }: PendingStat) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-amber-200/90 border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50/90 to-white p-5 shadow-sm ring-1 ring-amber-100/80 transition hover:-translate-y-px hover:border-amber-300 hover:shadow-md"
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="h-2 w-2 shrink-0 rounded-full bg-amber-500" aria-hidden />
        <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900">
          {label}
        </span>
      </div>
      <p className="text-3xl font-bold tabular-nums tracking-tight text-amber-950">
        {value}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-amber-900/80">
        {description}
      </p>
      <p className="mt-3 text-xs font-medium text-amber-800 group-hover:underline">
        {cta} →
      </p>
    </Link>
  );
}

export function AdminDashboardOverview({
  total,
  active,
  visible,
  pendingFamilyPhotos,
  unreviewedMessages,
}: Props) {
  const summary = SUMMARY_STATS(total, active, visible);

  const pending: PendingStat[] = [
    {
      label: "Fotos familiars pendents",
      value: pendingFamilyPhotos,
      description:
        "Imatges enviades pel familiar des de la zona familiar que encara cal retocar, aprovar o substituir abans de publicar-les a l'esquela.",
      href: "/admin/esquelas?photoPending=1",
      cta: "Veure esqueles amb foto pendent",
    },
    {
      label: "Missatges sense revisar",
      value: unreviewedMessages,
      description:
        "Missatges conmemoratius de visitants pendents de moderació. Cal revisar-los a la pestanya Missatges abans que es mostrin públicament.",
      href: "/admin/esquelas?messagesPending=1",
      cta: "Veure esqueles amb missatges pendents",
    },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Dashboard
        </h1>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-zinc-500">
          Resum del catàleg d&apos;esqueles i tasques que requereixen la teva
          atenció. Cada número indica quants registres compleixen el criteri
          descrit a sota.
        </p>
      </header>

      <section aria-labelledby="dashboard-summary-heading">
        <h2
          id="dashboard-summary-heading"
          className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400"
        >
          Resum d&apos;esqueles
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {summary.map((stat) => (
            <SummaryCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      <section aria-labelledby="dashboard-pending-heading">
        <h2
          id="dashboard-pending-heading"
          className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400"
        >
          Accions pendents
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {pending.map((stat) => (
            <PendingCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>
    </div>
  );
}
