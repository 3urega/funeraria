import Link from "next/link";
import { EsquelasListFilters } from "@/components/admin/esquelas-list-filters";
import { EsquelasListLegend } from "@/components/admin/esquelas-list-legend";
import { EsquelasTable } from "@/components/admin/esquelas-table";
import { AdminPagination } from "@/components/admin/list/admin-pagination";
import {
  esquelaFiltersToQuery,
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

      <EsquelasListFilters basePath={BASE_PATH} params={params} />

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
