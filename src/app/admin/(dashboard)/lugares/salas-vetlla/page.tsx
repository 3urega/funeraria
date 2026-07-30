import Link from "next/link";
import { PlaceListFilters } from "@/components/admin/places/place-list-filters";
import { PlaceListTable } from "@/components/admin/places/place-list-table";
import { AdminListToolbar } from "@/components/admin/list/admin-list-toolbar";
import { AdminPagination } from "@/components/admin/list/admin-pagination";
import {
  activeFilterToParam,
  buildListQueryString,
  parsePlaceListParams,
  placeFiltersToQuery,
} from "@/lib/admin/list-params";
import { listWakeRoomsPaginated } from "@/lib/db/queries";

export const metadata = { title: "Admin — Sales de vetlla" };

type Props = {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    q?: string;
    active?: string;
  }>;
};

const BASE_PATH = "/admin/lugares/salas-vetlla";

export default async function AdminWakeRoomsPage({ searchParams }: Props) {
  const raw = await searchParams;
  const params = parsePlaceListParams(raw);
  const result = await listWakeRoomsPaginated(params);

  const queryBase = placeFiltersToQuery(params);
  const toolbarQuery = {
    q: params.q,
    pageSize: params.pageSize === 10 ? undefined : params.pageSize,
  };

  const toolbarItems = [
    {
      label: "Tots",
      href: `${BASE_PATH}${buildListQueryString({ ...toolbarQuery, active: undefined, page: undefined })}`,
      active: params.active === undefined,
    },
    {
      label: "Actius",
      href: `${BASE_PATH}${buildListQueryString({ ...toolbarQuery, active: "1", page: undefined })}`,
      active: params.active === true,
    },
    {
      label: "Inactius",
      href: `${BASE_PATH}${buildListQueryString({ ...toolbarQuery, active: "0", page: undefined })}`,
      active: params.active === false,
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sales de vetlla</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Nom, foto i text — visibles a la web pública si estan actives.
          </p>
        </div>
        <Link
          href="/admin/lugares/salas-vetlla/nueva"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800"
        >
          Nova sala
        </Link>
      </div>

      <AdminListToolbar items={toolbarItems} ariaLabel="Filtrar sales" />

      <PlaceListFilters
        basePath={BASE_PATH}
        params={params}
        searchPlaceholder="Cercar per nom o adreça…"
      />

      <PlaceListTable kind="wake_room" items={result.items} />

      <AdminPagination
        basePath={BASE_PATH}
        page={result.page}
        pageSize={result.pageSize}
        total={result.total}
        totalPages={result.totalPages}
        query={{
          ...queryBase,
          active: activeFilterToParam(params.active),
        }}
      />
    </div>
  );
}
