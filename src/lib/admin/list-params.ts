import {
  clampPage,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/lib/admin/pagination";

export type ActiveFilter = true | false | undefined;

export type PoemListParams = {
  page: number;
  pageSize: number;
  active: ActiveFilter;
};

/** Parseja el paràmetre `page` de la URL (enter ≥ 1). */
export function parsePageSearchParam(
  value: string | undefined,
  maxPage?: number,
): number {
  const parsed = Number.parseInt(value ?? "1", 10);
  const page = Number.isFinite(parsed) && parsed >= 1 ? parsed : 1;
  if (maxPage !== undefined) {
    return Math.min(page, Math.max(1, maxPage));
  }
  return page;
}

/** Parseja `pageSize` acotat entre MIN_PAGE_SIZE i MAX_PAGE_SIZE. */
export function parsePageSizeSearchParam(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? String(DEFAULT_PAGE_SIZE), 10);
  if (!Number.isFinite(parsed)) return DEFAULT_PAGE_SIZE;
  return Math.min(MAX_PAGE_SIZE, Math.max(MIN_PAGE_SIZE, parsed));
}

/** `1` = actius, `0` = inactius, altres = tots. */
export function parseActiveFilter(value: string | undefined): ActiveFilter {
  if (value === "1" || value === "true") return true;
  if (value === "0" || value === "false") return false;
  return undefined;
}

/** Serialitza paràmetres de llista per a `<Link href>`. */
export function buildListQueryString(
  params: Record<string, string | number | undefined | null>,
): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export function activeFilterToParam(active: ActiveFilter): string | undefined {
  if (active === true) return "1";
  if (active === false) return "0";
  return undefined;
}

/** Params de `/admin/poemas` des de searchParams de Next.js. */
export function parsePoemListParams(searchParams: {
  page?: string;
  pageSize?: string;
  active?: string;
}): PoemListParams {
  const pageSize = parsePageSizeSearchParam(searchParams.pageSize);
  const page = parsePageSearchParam(searchParams.page);
  return {
    page,
    pageSize,
    active: parseActiveFilter(searchParams.active),
  };
}

/** Re-acota la pàgina un cop es coneix el total (després de la query). */
export function clampPoemListParams(
  params: PoemListParams,
  total: number,
): PoemListParams {
  return {
    ...params,
    page: clampPage(params.page, total, params.pageSize),
  };
}
