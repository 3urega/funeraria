import Link from "next/link";
import { PoemasTable } from "@/components/admin/poemas-table";
import { AdminListToolbar } from "@/components/admin/list/admin-list-toolbar";
import { AdminPagination } from "@/components/admin/list/admin-pagination";
import {
  activeFilterToParam,
  buildListQueryString,
  parsePoemListParams,
} from "@/lib/admin/list-params";
import { listPoemTemplatesPaginated } from "@/lib/db/queries";

export const metadata = { title: "Admin — Poemas" };

type Props = {
  searchParams: Promise<{ page?: string; pageSize?: string; active?: string }>;
};

export default async function AdminPoemasPage({ searchParams }: Props) {
  const raw = await searchParams;
  const params = parsePoemListParams(raw);
  const result = await listPoemTemplatesPaginated(params);

  const queryBase = {
    active: activeFilterToParam(params.active),
    pageSize: params.pageSize === 10 ? undefined : params.pageSize,
  };

  const toolbarItems = [
    {
      label: "Tots",
      href: `/admin/poemas${buildListQueryString({ ...queryBase, active: undefined, page: undefined })}`,
      active: params.active === undefined,
    },
    {
      label: "Actius",
      href: `/admin/poemas${buildListQueryString({ ...queryBase, active: "1", page: undefined })}`,
      active: params.active === true,
    },
    {
      label: "Inactius",
      href: `/admin/poemas${buildListQueryString({ ...queryBase, active: "0", page: undefined })}`,
      active: params.active === false,
    },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Poemas</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Catàleg d&apos;obituaris poètics que els familiars poden triar.
          </p>
        </div>
        <Link
          href="/admin/poemas/nueva"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800"
        >
          Nou poema
        </Link>
      </div>

      <AdminListToolbar items={toolbarItems} ariaLabel="Filtrar poemes" />

      <PoemasTable poems={result.items} />

      <AdminPagination
        basePath="/admin/poemas"
        page={result.page}
        pageSize={result.pageSize}
        total={result.total}
        totalPages={result.totalPages}
        query={{ active: activeFilterToParam(params.active) }}
      />
    </div>
  );
}
