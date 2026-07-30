import Link from "next/link";
import { FlowerOrdersTable } from "@/components/admin/flower-orders-table";
import { AdminListToolbar } from "@/components/admin/list/admin-list-toolbar";
import { AdminPagination } from "@/components/admin/list/admin-pagination";
import {
  buildListQueryString,
  flowerOrderFiltersToQuery,
  parseFlowerOrderListParams,
} from "@/lib/admin/list-params";
import { listFlowerOrdersPaginated } from "@/lib/db/queries";
import {
  FLOWER_ORDER_STATUS_LABELS,
  type FlowerOrderStatus,
} from "@/lib/flowers/types";

export const metadata = { title: "Admin — Comandes de flors" };

const TOOLBAR_STATUSES: FlowerOrderStatus[] = [
  "paid",
  "in_preparation",
  "delivered",
  "cancelled",
];

type Props = {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    status?: string;
  }>;
};

export default async function AdminFlowerOrdersPage({ searchParams }: Props) {
  const raw = await searchParams;
  const params = parseFlowerOrderListParams(raw);
  const result = await listFlowerOrdersPaginated(params);

  const queryBase = flowerOrderFiltersToQuery(params);

  const toolbarItems = [
    {
      label: "Totes",
      href: `/admin/flores/comandas${buildListQueryString({
        ...queryBase,
        status: undefined,
        page: undefined,
      })}`,
      active: params.status === undefined,
    },
    ...TOOLBAR_STATUSES.map((status) => ({
      label: FLOWER_ORDER_STATUS_LABELS[status],
      href: `/admin/flores/comandas${buildListQueryString({
        ...queryBase,
        status,
        page: undefined,
      })}`,
      active: params.status === status,
    })),
  ];

  const emptyMessage = params.status
    ? "Cap resultats amb aquests filtres."
    : "Cap comanda encara.";

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Comandes de flors</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Totes les comandes de la funerària.
          </p>
        </div>
        <Link
          href="/admin/flores"
          className="rounded-md border px-4 py-2 text-sm hover:bg-zinc-50"
        >
          ← Catàleg
        </Link>
      </div>

      <AdminListToolbar items={toolbarItems} ariaLabel="Filtrar comandes" />

      <FlowerOrdersTable
        orders={result.items}
        emptyMessage={emptyMessage}
      />

      <AdminPagination
        basePath="/admin/flores/comandas"
        page={result.page}
        pageSize={result.pageSize}
        total={result.total}
        totalPages={result.totalPages}
        query={flowerOrderFiltersToQuery(params)}
      />
    </div>
  );
}
