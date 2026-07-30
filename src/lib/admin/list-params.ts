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

/** `1` / `true` = filtre actiu; altres = sense filtre. */
export function parseBooleanOnFilter(value: string | undefined): true | undefined {
  if (value === "1" || value === "true") return true;
  return undefined;
}

export function booleanOnToParam(value: true | undefined): string | undefined {
  return value === true ? "1" : undefined;
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

export type EsquelaListParams = {
  page: number;
  pageSize: number;
  active?: true;
  visible?: true;
  ready?: true;
  photoPending?: true;
  messagesPending?: true;
  q?: string;
};

/**
 * Params de `/admin/esquelas` des de searchParams de Next.js.
 * Noms de filtres alineats amb enllaços del dashboard (RD-121):
 * `photoPending=1`, `messagesPending=1`, etc.
 */
export function parseEsquelaListParams(searchParams: {
  page?: string;
  pageSize?: string;
  active?: string;
  visible?: string;
  ready?: string;
  photoPending?: string;
  messagesPending?: string;
  q?: string;
}): EsquelaListParams {
  const pageSize = parsePageSizeSearchParam(searchParams.pageSize);
  const page = parsePageSearchParam(searchParams.page);
  const q = searchParams.q?.trim();
  return {
    page,
    pageSize,
    active: parseBooleanOnFilter(searchParams.active),
    visible: parseBooleanOnFilter(searchParams.visible),
    ready: parseBooleanOnFilter(searchParams.ready),
    photoPending: parseBooleanOnFilter(searchParams.photoPending),
    messagesPending: parseBooleanOnFilter(searchParams.messagesPending),
    q: q && q.length >= 1 ? q : undefined,
  };
}

/** Serialitza filtres d'esquela per a paginació i chips (sense `page`). */
export function esquelaFiltersToQuery(
  params: EsquelaListParams,
): Record<string, string | number | undefined | null> {
  return {
    active: booleanOnToParam(params.active),
    visible: booleanOnToParam(params.visible),
    ready: booleanOnToParam(params.ready),
    photoPending: booleanOnToParam(params.photoPending),
    messagesPending: booleanOnToParam(params.messagesPending),
    q: params.q,
    pageSize: params.pageSize === 10 ? undefined : params.pageSize,
  };
}

type EsquelaToggleFilterKey =
  | "active"
  | "visible"
  | "ready"
  | "photoPending"
  | "messagesPending";

/** Enllaç per activar/desactivar un chip de filtre (reset `page`). */
export function esquelaToggleFilterHref(
  basePath: string,
  params: EsquelaListParams,
  key: EsquelaToggleFilterKey,
): string {
  const query = esquelaFiltersToQuery(params);
  if (params[key]) {
    query[key] = undefined;
  } else {
    query[key] = "1";
  }
  query.page = undefined;
  return `${basePath}${buildListQueryString(query)}`;
}
