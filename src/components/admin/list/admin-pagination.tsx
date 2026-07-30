import Link from "next/link";
import { buildListQueryString } from "@/lib/admin/list-params";
import { formatPageRange } from "@/lib/admin/pagination";

type Props = {
  /** Ruta base sense query (ex. `/admin/poemas`). */
  basePath: string;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  /** Paràmetres extra a preservar (active, status, q…). */
  query?: Record<string, string | number | undefined | null>;
};

/**
 * Paginació per enllaços (RSC-friendly). Mostra rang i enllaços Prev/Next.
 */
export function AdminPagination({
  basePath,
  page,
  pageSize,
  total,
  totalPages,
  query = {},
}: Props) {
  if (total <= pageSize) return null;

  const { from, to } = formatPageRange(page, pageSize, total);

  function hrefForPage(targetPage: number) {
    return `${basePath}${buildListQueryString({
      ...query,
      page: targetPage === 1 ? undefined : targetPage,
      pageSize: pageSize === 10 ? undefined : pageSize,
    })}`;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) =>
      p === 1 ||
      p === totalPages ||
      (p >= page - 1 && p <= page + 1),
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 text-sm text-zinc-600">
      <p>
        Mostrant {from}–{to} de {total}
      </p>
      <nav className="flex flex-wrap items-center gap-1" aria-label="Paginació">
        {page > 1 ? (
          <Link
            href={hrefForPage(page - 1)}
            className="rounded-md border px-3 py-1.5 hover:bg-zinc-50"
          >
            ← Anterior
          </Link>
        ) : (
          <span className="rounded-md border px-3 py-1.5 text-zinc-300">
            ← Anterior
          </span>
        )}
        {pages.map((p, index) => {
          const prev = pages[index - 1];
          const showEllipsis = prev !== undefined && p - prev > 1;
          return (
            <span key={p} className="flex items-center gap-1">
              {showEllipsis && <span className="px-1 text-zinc-400">…</span>}
              {p === page ? (
                <span className="rounded-md bg-zinc-900 px-3 py-1.5 text-white">
                  {p}
                </span>
              ) : (
                <Link
                  href={hrefForPage(p)}
                  className="rounded-md border px-3 py-1.5 hover:bg-zinc-50"
                >
                  {p}
                </Link>
              )}
            </span>
          );
        })}
        {page < totalPages ? (
          <Link
            href={hrefForPage(page + 1)}
            className="rounded-md border px-3 py-1.5 hover:bg-zinc-50"
          >
            Següent →
          </Link>
        ) : (
          <span className="rounded-md border px-3 py-1.5 text-zinc-300">
            Següent →
          </span>
        )}
      </nav>
    </div>
  );
}
