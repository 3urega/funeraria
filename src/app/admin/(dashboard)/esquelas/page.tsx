import Link from "next/link";
import { EsquelasListLegend } from "@/components/admin/esquelas-list-legend";
import { EsquelasTable } from "@/components/admin/esquelas-table";
import { AdminListSearch } from "@/components/admin/list/admin-list-search";
import { AdminListToolbar } from "@/components/admin/list/admin-list-toolbar";
import { AdminPagination } from "@/components/admin/list/admin-pagination";
import {
  booleanOnToParam,
  buildListQueryString,
  esquelaFiltersToQuery,
  esquelaToggleFilterHref,
  parseEsquelaListParams,
} from "@/lib/admin/list-params";
import {
  getUnreviewedCountsForObituaryIds,
  listObituariesPaginated,
} from "@/lib/db/queries";

export const metadata = {
  title: "Admin — Esquelas",
};

type Props = {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    active?: string;
    visible?: string;
    ready?: string;
    photoPending?: string;
    messagesPending?: string;
    q?: string;
  }>;
};

const BASE_PATH = "/admin/esquelas";

export default async function AdminEsquelasPage({ searchParams }: Props) {
  const raw = await searchParams;
  const params = parseEsquelaListParams(raw);
  const result = await listObituariesPaginated(params);
  const unreviewedCounts = await getUnreviewedCountsForObituaryIds(
    result.items.map((o) => o.id),
  );

  const queryBase = esquelaFiltersToQuery(params);
  const hasBooleanFilters =
    params.active === true ||
    params.visible === true ||
    params.ready === true ||
    params.photoPending === true ||
    params.messagesPending === true;

  const toolbarItems = [
    {
      label: "Actives",
      href: esquelaToggleFilterHref(BASE_PATH, params, "active"),
      active: params.active === true,
    },
    {
      label: "Visibles",
      href: esquelaToggleFilterHref(BASE_PATH, params, "visible"),
      active: params.visible === true,
    },
    {
      label: "Llestes",
      href: esquelaToggleFilterHref(BASE_PATH, params, "ready"),
      active: params.ready === true,
    },
    {
      label: "Foto pendent",
      href: esquelaToggleFilterHref(BASE_PATH, params, "photoPending"),
      active: params.photoPending === true,
    },
    {
      label: "Missatges pendents",
      href: esquelaToggleFilterHref(BASE_PATH, params, "messagesPending"),
      active: params.messagesPending === true,
    },
    ...(hasBooleanFilters
      ? [
          {
            label: "Netejar filtres",
            href: `${BASE_PATH}${buildListQueryString({ q: params.q })}`,
            active: false,
          },
        ]
      : []),
  ];

  const searchHiddenParams: Record<string, string | undefined> = {
    active: booleanOnToParam(params.active),
    visible: booleanOnToParam(params.visible),
    ready: booleanOnToParam(params.ready),
    photoPending: booleanOnToParam(params.photoPending),
    messagesPending: booleanOnToParam(params.messagesPending),
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Esquelas</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Gestió d&apos;esqueles, codis de visita i estat de publicació.
          </p>
        </div>
        <Link
          href="/admin/esquelas/nueva"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800"
        >
          Nova esquela
        </Link>
      </div>

      <AdminListSearch
        basePath={BASE_PATH}
        q={params.q}
        hiddenParams={searchHiddenParams}
      />

      <AdminListToolbar items={toolbarItems} ariaLabel="Filtrar esqueles" />

      <EsquelasListLegend />

      <EsquelasTable
        obituaries={result.items}
        unreviewedCounts={unreviewedCounts}
      />

      <AdminPagination
        basePath={BASE_PATH}
        page={result.page}
        pageSize={result.pageSize}
        total={result.total}
        totalPages={result.totalPages}
        query={queryBase}
      />
    </div>
  );
}
