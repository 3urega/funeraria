import Link from "next/link";
import { PlaceListFilters } from "@/components/admin/places/place-list-filters";
import { PlaceListTable } from "@/components/admin/places/place-list-table";
import { AdminPagination } from "@/components/admin/list/admin-pagination";
import {
  parsePlaceListParams,
  placeFiltersToQuery,
} from "@/lib/admin/list-params";
import { listChurchesPaginated } from "@/lib/db/queries";

export const metadata = { title: "Admin — Esglésies" };

type Props = {
  searchParams: Promise<{ page?: string; pageSize?: string; q?: string }>;
};

const BASE_PATH = "/admin/lugares/iglesias";

export default async function AdminChurchesPage({ searchParams }: Props) {
  const raw = await searchParams;
  const params = parsePlaceListParams(raw);
  const result = await listChurchesPaginated(params);
  const queryBase = placeFiltersToQuery(params);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Esglésies</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Catàleg assignable des del formulari d&apos;esquela.
          </p>
        </div>
        <Link
          href="/admin/lugares/iglesias/nueva"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800"
        >
          Nova església
        </Link>
      </div>

      <PlaceListFilters basePath={BASE_PATH} params={params} />

      <PlaceListTable kind="church" items={result.items} />

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
