import Link from "next/link";
import { FlowerProductsTable } from "@/components/admin/flower-products-table";
import { AdminListToolbar } from "@/components/admin/list/admin-list-toolbar";
import { AdminPagination } from "@/components/admin/list/admin-pagination";
import {
  activeFilterToParam,
  buildListQueryString,
  parsePoemListParams,
} from "@/lib/admin/list-params";
import { listFlowerProductsPaginated } from "@/lib/db/queries";
import { getStorage } from "@/lib/storage";
import { mediaPublicUrl } from "@/lib/storage/public-url";

export const metadata = { title: "Admin — Flors" };

type Props = {
  searchParams: Promise<{ page?: string; pageSize?: string; active?: string }>;
};

export default async function AdminFloresPage({ searchParams }: Props) {
  const raw = await searchParams;
  const params = parsePoemListParams(raw);
  const result = await listFlowerProductsPaginated(params);
  const storage = getStorage();

  const imageUrls = Object.fromEntries(
    result.items.map((product) => [
      product.id,
      product.imagePath
        ? mediaPublicUrl(storage, product.imagePath, product.updatedAt)
        : null,
    ]),
  );

  const queryBase = {
    active: activeFilterToParam(params.active),
    pageSize: params.pageSize === 10 ? undefined : params.pageSize,
  };

  const toolbarItems = [
    {
      label: "Tots",
      href: `/admin/flores${buildListQueryString({ ...queryBase, active: undefined, page: undefined })}`,
      active: params.active === undefined,
    },
    {
      label: "Actius",
      href: `/admin/flores${buildListQueryString({ ...queryBase, active: "1", page: undefined })}`,
      active: params.active === true,
    },
    {
      label: "Inactius",
      href: `/admin/flores${buildListQueryString({ ...queryBase, active: "0", page: undefined })}`,
      active: params.active === false,
    },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Flors</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Catàleg de productes per a la venda des de les esqueles.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/flores/comandas"
            className="rounded-md border px-4 py-2 text-sm hover:bg-zinc-50"
          >
            Comandes
          </Link>
          <Link
            href="/admin/flores/nueva"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800"
          >
            Nou producte
          </Link>
        </div>
      </div>

      <AdminListToolbar items={toolbarItems} ariaLabel="Filtrar productes" />

      <FlowerProductsTable products={result.items} imageUrls={imageUrls} />

      <AdminPagination
        basePath="/admin/flores"
        page={result.page}
        pageSize={result.pageSize}
        total={result.total}
        totalPages={result.totalPages}
        query={{ active: activeFilterToParam(params.active) }}
      />
    </div>
  );
}
