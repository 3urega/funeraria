/** Resultat paginat estàndard per a llistes admin. */
export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export const DEFAULT_PAGE_SIZE = 10;
export const MIN_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 50;

/** Calcula el nombre total de pàgines. */
export function totalPages(total: number, pageSize: number): number {
  if (total <= 0) return 1;
  return Math.ceil(total / pageSize);
}

/** Converteix pàgina i mida en limit/offset per a Drizzle. */
export function toLimitOffset(
  page: number,
  pageSize: number,
): { limit: number; offset: number } {
  return {
    limit: pageSize,
    offset: (page - 1) * pageSize,
  };
}

/** Acota la pàgina a [1, totalPages]. */
export function clampPage(page: number, total: number, pageSize: number): number {
  const max = totalPages(total, pageSize);
  return Math.min(Math.max(1, page), max);
}

/** Rang visible per al text «Mostrant X–Y de Z». */
export function formatPageRange(
  page: number,
  pageSize: number,
  total: number,
): { from: number; to: number } {
  if (total === 0) return { from: 0, to: 0 };
  return {
    from: (page - 1) * pageSize + 1,
    to: Math.min(page * pageSize, total),
  };
}
