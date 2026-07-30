import { and, asc, count, desc, eq, inArray, like, or } from "drizzle-orm";
import type { PaginatedResult } from "@/lib/admin/pagination";
import {
  clampPage,
  toLimitOffset,
  totalPages,
} from "@/lib/admin/pagination";
import type { ActiveFilter } from "@/lib/admin/list-params";
import { getDb } from "@/lib/db";
import { allRows, oneRow, runSql } from "@/lib/db/exec";
import { getFuneralHomeId } from "@/lib/site/tenant-id";
import {
  adminUsers,
  cemeteries,
  churches,
  commemorativeMessages,
  contentSections,
  flowerOrders,
  flowerProducts,
  funeralHomes,
  obituaries,
  poemTemplates,
  siteConfig,
  wakeRooms,
} from "@/lib/db/schema";
import type { CreateCommemorativeMessageInput } from "@/lib/commemorative/schema";
import type { FlowerCheckoutInput } from "@/lib/flowers/schema";
import type { FlowerOrderStatus } from "@/lib/flowers/types";

export async function getVisibleObituaries() {
  const db = getDb();
  return allRows(db
    .select()
    .from(obituaries)
    .where(
      and(
        eq(obituaries.funeralHomeId, getFuneralHomeId()),
        eq(obituaries.isVisible, true),
      ),
    ));
}

export async function getObituaryBySlug(slug: string) {
  const db = getDb();
  return oneRow(db
    .select()
    .from(obituaries)
    .where(eq(obituaries.slug, slug)));
}

export async function getObituaryById(id: string) {
  const db = getDb();
  return oneRow(db.select().from(obituaries).where(eq(obituaries.id, id)));
}

export async function getObituaryByIdForTenant(id: string) {
  const db = getDb();
  return oneRow(db
    .select()
    .from(obituaries)
    .where(
      and(
        eq(obituaries.id, id),
        eq(obituaries.funeralHomeId, getFuneralHomeId()),
      ),
    ));
}

export async function getObituaryByVisitCode(code: string) {
  const db = getDb();
  return oneRow(db
    .select()
    .from(obituaries)
    .where(
      and(
        eq(obituaries.funeralHomeId, getFuneralHomeId()),
        eq(obituaries.visitCode, code.toUpperCase()),
      ),
    ));
}

export async function getObituaryWithPlaces(id: string) {
  const obituary = await getObituaryById(id);
  if (!obituary) return null;

  const db = getDb();
  const church = obituary.churchId
    ? await oneRow(db
        .select()
        .from(churches)
        .where(eq(churches.id, obituary.churchId)))
    : null;
  const cemetery = obituary.cemeteryId
    ? await oneRow(db
        .select()
        .from(cemeteries)
        .where(eq(cemeteries.id, obituary.cemeteryId)))
    : null;
  const wakeRoom = obituary.wakeRoomId
    ? await oneRow(db
        .select()
        .from(wakeRooms)
        .where(eq(wakeRooms.id, obituary.wakeRoomId)))
    : null;
  const poemTemplate = obituary.obituarioPoemTemplateId
    ? await oneRow(db
        .select()
        .from(poemTemplates)
        .where(eq(poemTemplates.id, obituary.obituarioPoemTemplateId)))
    : null;

  return { obituary, church, cemetery, wakeRoom, poemTemplate };
}

export async function getActivePoemTemplates() {
  const db = getDb();
  return allRows(db
    .select()
    .from(poemTemplates)
    .where(
      and(
        eq(poemTemplates.funeralHomeId, getFuneralHomeId()),
        eq(poemTemplates.isActive, true),
      ),
    ));
}

export async function getAllPoemTemplates() {
  const db = getDb();
  return allRows(db
    .select()
    .from(poemTemplates)
    .where(eq(poemTemplates.funeralHomeId, getFuneralHomeId())));
}

export type PoemTemplateListFilters = {
  page: number;
  pageSize: number;
  active?: ActiveFilter;
};

function poemTemplateListConditions(active?: ActiveFilter) {
  const conditions = [eq(poemTemplates.funeralHomeId, getFuneralHomeId())];
  if (active === true) {
    conditions.push(eq(poemTemplates.isActive, true));
  } else if (active === false) {
    conditions.push(eq(poemTemplates.isActive, false));
  }
  return and(...conditions);
}

export async function listPoemTemplatesPaginated(
  filters: PoemTemplateListFilters,
): Promise<PaginatedResult<(typeof poemTemplates.$inferSelect)>> {
  const db = getDb();
  const where = poemTemplateListConditions(filters.active);

  const countRow = await oneRow(
    db.select({ total: count() }).from(poemTemplates).where(where),
  );
  const total = countRow?.total ?? 0;
  const page = clampPage(filters.page, total, filters.pageSize);
  const { limit, offset } = toLimitOffset(page, filters.pageSize);

  const items = await allRows(
    db
      .select()
      .from(poemTemplates)
      .where(where)
      .orderBy(asc(poemTemplates.title))
      .limit(limit)
      .offset(offset),
  );

  return {
    items,
    total,
    page,
    pageSize: filters.pageSize,
    totalPages: totalPages(total, filters.pageSize),
  };
}

export async function getPoemTemplateById(id: string) {
  const db = getDb();
  return oneRow(db
    .select()
    .from(poemTemplates)
    .where(
      and(
        eq(poemTemplates.id, id),
        eq(poemTemplates.funeralHomeId, getFuneralHomeId()),
      ),
    ));
}

export async function getAllObituaries() {
  const db = getDb();
  return allRows(db
    .select()
    .from(obituaries)
    .where(eq(obituaries.funeralHomeId, getFuneralHomeId())));
}

export type ObituaryListFilters = {
  page: number;
  pageSize: number;
  active?: true;
  visible?: true;
  ready?: true;
  photoPending?: true;
  messagesPending?: true;
  q?: string;
};

function obituaryListConditions(filters: Omit<ObituaryListFilters, "page" | "pageSize">) {
  const db = getDb();
  const conditions = [eq(obituaries.funeralHomeId, getFuneralHomeId())];

  if (filters.active === true) {
    conditions.push(eq(obituaries.isActive, true));
  }
  if (filters.visible === true) {
    conditions.push(eq(obituaries.isVisible, true));
  }
  if (filters.ready === true) {
    conditions.push(eq(obituaries.isReady, true));
  }
  if (filters.photoPending === true) {
    conditions.push(eq(obituaries.familyImageStatus, "pending"));
  }
  if (filters.messagesPending === true) {
    conditions.push(
      inArray(
        obituaries.id,
        db
          .select({ id: commemorativeMessages.obituaryId })
          .from(commemorativeMessages)
          .where(eq(commemorativeMessages.reviewed, false)),
      ),
    );
  }

  const q = filters.q?.trim();
  if (q && q.length >= 1) {
    const pattern = `%${q}%`;
    conditions.push(
      or(
        like(obituaries.name, pattern),
        like(obituaries.visitCode, pattern),
        like(obituaries.expedientCode, pattern),
      )!,
    );
  }

  return and(...conditions);
}

export async function listObituariesPaginated(
  filters: ObituaryListFilters,
): Promise<PaginatedResult<(typeof obituaries.$inferSelect)>> {
  const db = getDb();
  const where = obituaryListConditions(filters);

  const countRow = await oneRow(
    db.select({ total: count() }).from(obituaries).where(where),
  );
  const total = countRow?.total ?? 0;
  const page = clampPage(filters.page, total, filters.pageSize);
  const { limit, offset } = toLimitOffset(page, filters.pageSize);

  const items = await allRows(
    db
      .select()
      .from(obituaries)
      .where(where)
      .orderBy(desc(obituaries.updatedAt))
      .limit(limit)
      .offset(offset),
  );

  return {
    items,
    total,
    page,
    pageSize: filters.pageSize,
    totalPages: totalPages(total, filters.pageSize),
  };
}

export async function getUnreviewedCountsForObituaryIds(
  ids: string[],
): Promise<Record<string, number>> {
  if (ids.length === 0) return {};

  const db = getDb();
  const rows = await allRows(
    db
      .select({
        obituaryId: commemorativeMessages.obituaryId,
        count: count(),
      })
      .from(commemorativeMessages)
      .where(
        and(
          eq(commemorativeMessages.reviewed, false),
          inArray(commemorativeMessages.obituaryId, ids),
        ),
      )
      .groupBy(commemorativeMessages.obituaryId),
  );

  return Object.fromEntries(rows.map((r) => [r.obituaryId, r.count]));
}

export async function getFuneralHomeById(id: string) {
  const db = getDb();
  return oneRow(db.select().from(funeralHomes).where(eq(funeralHomes.id, id)));
}

export async function getSiteConfig() {
  const db = getDb();
  return oneRow(db
    .select()
    .from(siteConfig)
    .where(eq(siteConfig.funeralHomeId, getFuneralHomeId())));
}

export async function updateSiteConfig(data: {
  brandName: string;
  mortuaryDefault?: string | null;
  contact: {
    phone: string;
    email: string;
    address: string;
    website?: string | null;
    whatsapp?: string | null;
  };
  theme: Record<string, string>;
  logoPath?: string | null;
}) {
  const db = getDb();
  const existing = await getSiteConfig();
  const funeralHomeId = getFuneralHomeId();

  if (existing) {
    await runSql(db.update(siteConfig)
      .set({
        brandName: data.brandName,
        mortuaryDefault: data.mortuaryDefault ?? null,
        contact: {
          phone: data.contact.phone,
          email: data.contact.email,
          address: data.contact.address,
          website: data.contact.website ?? undefined,
          whatsapp: data.contact.whatsapp ?? undefined,
        },
        theme: data.theme,
        ...(data.logoPath !== undefined ? { logoPath: data.logoPath } : {}),
      })
      .where(eq(siteConfig.id, existing.id)));
    return existing.id;
  }

  const id = `sc-${Date.now()}`;
  await runSql(db.insert(siteConfig)
    .values({
      id,
      funeralHomeId,
      brandName: data.brandName,
      mortuaryDefault: data.mortuaryDefault ?? null,
      contact: {
        phone: data.contact.phone,
        email: data.contact.email,
        address: data.contact.address,
        website: data.contact.website ?? undefined,
        whatsapp: data.contact.whatsapp ?? undefined,
      },
      theme: data.theme,
      logoPath: data.logoPath ?? null,
    }));
  return id;
}

export async function getPublishedContentSections() {
  const db = getDb();
  return allRows(db
    .select()
    .from(contentSections)
    .where(
      and(
        eq(contentSections.funeralHomeId, getFuneralHomeId()),
        eq(contentSections.isPublished, true),
      ),
    ));
}

export async function getContentSectionByKey(sectionKey: string) {
  const db = getDb();
  return oneRow(db
    .select()
    .from(contentSections)
    .where(
      and(
        eq(contentSections.funeralHomeId, getFuneralHomeId()),
        eq(contentSections.sectionKey, sectionKey),
      ),
    ));
}

export async function getAllContentSectionsForAdmin() {
  const db = getDb();
  return allRows(db
    .select()
    .from(contentSections)
    .where(eq(contentSections.funeralHomeId, getFuneralHomeId())));
}

export async function upsertContentSection(
  sectionKey: string,
  contentI18n: Record<string, unknown>,
  isPublished: boolean,
) {
  const db = getDb();
  const existing = await getContentSectionByKey(sectionKey);
  const funeralHomeId = getFuneralHomeId();

  if (existing) {
    await runSql(db.update(contentSections)
      .set({ contentI18n, isPublished })
      .where(eq(contentSections.id, existing.id)));
    return existing.id;
  }

  const sortOrderMap: Record<string, number> = {
    top_bar: 0,
    hero: 1,
    services: 2,
    why_us: 3,
    obituaries_intro: 4,
    cta_blocks: 5,
    footer: 6,
  };

  const id = `cs-${sectionKey}`;
  await runSql(db.insert(contentSections)
    .values({
      id,
      funeralHomeId,
      sectionKey,
      contentI18n,
      isPublished,
      sortOrder: sortOrderMap[sectionKey] ?? 99,
    }));
  return id;
}

export async function getHomeContentSections() {
  const sections = await getPublishedContentSections();
  const map: Record<string, Record<string, unknown>> = {};
  for (const s of sections) {
    if (s.contentI18n && typeof s.contentI18n === "object") {
      map[s.sectionKey] = s.contentI18n as Record<string, unknown>;
    }
  }
  return map;
}

export async function getActiveWakeRooms() {
  const db = getDb();
  return allRows(db
    .select()
    .from(wakeRooms)
    .where(
      and(
        eq(wakeRooms.funeralHomeId, getFuneralHomeId()),
        eq(wakeRooms.isActive, true),
      ),
    ));
}

export async function getAllWakeRooms() {
  const db = getDb();
  return allRows(db
    .select()
    .from(wakeRooms)
    .where(eq(wakeRooms.funeralHomeId, getFuneralHomeId())));
}

export async function getWakeRoomById(id: string) {
  const db = getDb();
  return oneRow(db
    .select()
    .from(wakeRooms)
    .where(
      and(eq(wakeRooms.id, id), eq(wakeRooms.funeralHomeId, getFuneralHomeId())),
    ));
}

export async function getAllChurches() {
  const db = getDb();
  return allRows(db
    .select()
    .from(churches)
    .where(eq(churches.funeralHomeId, getFuneralHomeId())));
}

export async function getChurchById(id: string) {
  const db = getDb();
  return oneRow(db
    .select()
    .from(churches)
    .where(
      and(eq(churches.id, id), eq(churches.funeralHomeId, getFuneralHomeId())),
    ));
}

export async function getAllCemeteries() {
  const db = getDb();
  return allRows(db
    .select()
    .from(cemeteries)
    .where(eq(cemeteries.funeralHomeId, getFuneralHomeId())));
}

export async function getCemeteryById(id: string) {
  const db = getDb();
  return oneRow(db
    .select()
    .from(cemeteries)
    .where(
      and(eq(cemeteries.id, id), eq(cemeteries.funeralHomeId, getFuneralHomeId())),
    ));
}

export type PlaceListFilters = {
  page: number;
  pageSize: number;
  q?: string;
  active?: ActiveFilter;
};

function churchListConditions(q?: string) {
  const conditions = [eq(churches.funeralHomeId, getFuneralHomeId())];
  const term = q?.trim();
  if (term && term.length >= 1) {
    const pattern = `%${term}%`;
    conditions.push(
      or(like(churches.name, pattern), like(churches.city, pattern))!,
    );
  }
  return and(...conditions);
}

function cemeteryListConditions(q?: string) {
  const conditions = [eq(cemeteries.funeralHomeId, getFuneralHomeId())];
  const term = q?.trim();
  if (term && term.length >= 1) {
    const pattern = `%${term}%`;
    conditions.push(
      or(like(cemeteries.name, pattern), like(cemeteries.city, pattern))!,
    );
  }
  return and(...conditions);
}

function wakeRoomListConditions(filters: Omit<PlaceListFilters, "page" | "pageSize">) {
  const conditions = [eq(wakeRooms.funeralHomeId, getFuneralHomeId())];
  if (filters.active === true) {
    conditions.push(eq(wakeRooms.isActive, true));
  } else if (filters.active === false) {
    conditions.push(eq(wakeRooms.isActive, false));
  }
  const term = filters.q?.trim();
  if (term && term.length >= 1) {
    const pattern = `%${term}%`;
    conditions.push(
      or(like(wakeRooms.name, pattern), like(wakeRooms.address, pattern))!,
    );
  }
  return and(...conditions);
}

export async function listChurchesPaginated(
  filters: PlaceListFilters,
): Promise<PaginatedResult<(typeof churches.$inferSelect)>> {
  const db = getDb();
  const where = churchListConditions(filters.q);

  const countRow = await oneRow(
    db.select({ total: count() }).from(churches).where(where),
  );
  const total = countRow?.total ?? 0;
  const page = clampPage(filters.page, total, filters.pageSize);
  const { limit, offset } = toLimitOffset(page, filters.pageSize);

  const items = await allRows(
    db
      .select()
      .from(churches)
      .where(where)
      .orderBy(asc(churches.name))
      .limit(limit)
      .offset(offset),
  );

  return {
    items,
    total,
    page,
    pageSize: filters.pageSize,
    totalPages: totalPages(total, filters.pageSize),
  };
}

export async function listCemeteriesPaginated(
  filters: PlaceListFilters,
): Promise<PaginatedResult<(typeof cemeteries.$inferSelect)>> {
  const db = getDb();
  const where = cemeteryListConditions(filters.q);

  const countRow = await oneRow(
    db.select({ total: count() }).from(cemeteries).where(where),
  );
  const total = countRow?.total ?? 0;
  const page = clampPage(filters.page, total, filters.pageSize);
  const { limit, offset } = toLimitOffset(page, filters.pageSize);

  const items = await allRows(
    db
      .select()
      .from(cemeteries)
      .where(where)
      .orderBy(asc(cemeteries.name))
      .limit(limit)
      .offset(offset),
  );

  return {
    items,
    total,
    page,
    pageSize: filters.pageSize,
    totalPages: totalPages(total, filters.pageSize),
  };
}

export async function listWakeRoomsPaginated(
  filters: PlaceListFilters,
): Promise<PaginatedResult<(typeof wakeRooms.$inferSelect)>> {
  const db = getDb();
  const where = wakeRoomListConditions(filters);

  const countRow = await oneRow(
    db.select({ total: count() }).from(wakeRooms).where(where),
  );
  const total = countRow?.total ?? 0;
  const page = clampPage(filters.page, total, filters.pageSize);
  const { limit, offset } = toLimitOffset(page, filters.pageSize);

  const items = await allRows(
    db
      .select()
      .from(wakeRooms)
      .where(where)
      .orderBy(asc(wakeRooms.name))
      .limit(limit)
      .offset(offset),
  );

  return {
    items,
    total,
    page,
    pageSize: filters.pageSize,
    totalPages: totalPages(total, filters.pageSize),
  };
}

export async function slugExists(
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  const row = await getObituaryBySlug(slug);
  if (!row) return false;
  if (excludeId && row.id === excludeId) return false;
  return true;
}

export async function visitCodeExists(
  code: string,
  excludeId?: string,
): Promise<boolean> {
  const row = await getObituaryByVisitCode(code);
  if (!row) return false;
  if (excludeId && row.id === excludeId) return false;
  return true;
}

export type PlaceIdsInput = {
  churchId: string;
  cemeteryId: string;
  wakeRoomId: string;
};

/** Valida que els IDs de llocs pertanyen al tenant actual. */
export async function validatePlaceIds({
  churchId,
  cemeteryId,
  wakeRoomId,
}: PlaceIdsInput): Promise<boolean> {
  const [church, cemetery, wakeRoom] = await Promise.all([
    getChurchById(churchId),
    getCemeteryById(cemeteryId),
    getWakeRoomById(wakeRoomId),
  ]);
  return Boolean(church && cemetery && wakeRoom);
}

export async function getCommemorativeMessagesByObituaryId(obituaryId: string) {
  const obituary = await getObituaryByIdForTenant(obituaryId);
  if (!obituary) return [];

  const db = getDb();
  return allRows(db
    .select()
    .from(commemorativeMessages)
    .where(eq(commemorativeMessages.obituaryId, obituaryId))
    .orderBy(desc(commemorativeMessages.createdAt)));
}

export async function insertCommemorativeMessage(
  input: CreateCommemorativeMessageInput,
) {
  const obituary = await getObituaryById(input.obituaryId);
  if (!obituary) {
    return { ok: false as const, error: "NOT_FOUND" as const };
  }
  if (obituary.funeralHomeId !== getFuneralHomeId()) {
    return { ok: false as const, error: "NOT_FOUND" as const };
  }
  if (!obituary.isVisible) {
    return { ok: false as const, error: "NOT_VISIBLE" as const };
  }

  const id = `msg-${Date.now()}`;
  const createdAt = new Date().toISOString();

  await runSql(getDb()
    .insert(commemorativeMessages)
    .values({
      id,
      obituaryId: input.obituaryId,
      senderName: input.senderName,
      messageText: input.messageText,
      createdAt,
    }));

  return { ok: true as const, id };
}

export async function getCommemorativeMessageByIdForTenant(id: string) {
  const db = getDb();
  const row = await oneRow(
    db
      .select({
        message: commemorativeMessages,
        funeralHomeId: obituaries.funeralHomeId,
      })
      .from(commemorativeMessages)
      .innerJoin(obituaries, eq(commemorativeMessages.obituaryId, obituaries.id))
      .where(eq(commemorativeMessages.id, id)),
  );

  if (!row || row.funeralHomeId !== getFuneralHomeId()) return null;
  return row.message;
}

export async function updateCommemorativeMessageReviewed(
  id: string,
  reviewed: boolean,
) {
  const message = await getCommemorativeMessageByIdForTenant(id);
  if (!message) {
    return { ok: false as const, error: "NOT_FOUND" as const };
  }

  await runSql(getDb()
    .update(commemorativeMessages)
    .set({ reviewed })
    .where(eq(commemorativeMessages.id, id)));

  return { ok: true as const };
}

export async function markAllCommemorativeMessagesReviewedForObituary(
  obituaryId: string,
) {
  const obituary = await getObituaryByIdForTenant(obituaryId);
  if (!obituary) {
    return { ok: false as const, error: "NOT_FOUND" as const };
  }

  const db = getDb();
  const pending = await allRows(
    db
      .select({ id: commemorativeMessages.id })
      .from(commemorativeMessages)
      .where(
        and(
          eq(commemorativeMessages.obituaryId, obituaryId),
          eq(commemorativeMessages.reviewed, false),
        ),
      ),
  );

  if (pending.length === 0) {
    return { ok: true as const, updated: 0 };
  }

  await runSql(
    db
      .update(commemorativeMessages)
      .set({ reviewed: true })
      .where(
        and(
          eq(commemorativeMessages.obituaryId, obituaryId),
          eq(commemorativeMessages.reviewed, false),
        ),
      ),
  );

  return { ok: true as const, updated: pending.length };
}

export async function countUnreviewedCommemorativeMessages() {
  const db = getDb();
  const rows = await allRows(
    db
      .select({ id: commemorativeMessages.id })
      .from(commemorativeMessages)
      .innerJoin(obituaries, eq(commemorativeMessages.obituaryId, obituaries.id))
      .where(
        and(
          eq(obituaries.funeralHomeId, getFuneralHomeId()),
          eq(commemorativeMessages.reviewed, false),
        ),
      ),
  );
  return rows.length;
}

export async function getAdminPendingStats() {
  const db = getDb();
  const fhId = getFuneralHomeId();
  const [photoRows, messageRows] = await Promise.all([
    allRows(
      db
        .select({ id: obituaries.id })
        .from(obituaries)
        .where(
          and(
            eq(obituaries.funeralHomeId, fhId),
            eq(obituaries.familyImageStatus, "pending"),
          ),
        ),
    ),
    allRows(
      db
        .select({ id: commemorativeMessages.id })
        .from(commemorativeMessages)
        .innerJoin(obituaries, eq(commemorativeMessages.obituaryId, obituaries.id))
        .where(
          and(
            eq(obituaries.funeralHomeId, fhId),
            eq(commemorativeMessages.reviewed, false),
          ),
        ),
    ),
  ]);
  return {
    pendingFamilyPhotos: photoRows.length,
    unreviewedMessages: messageRows.length,
  };
}

export async function getUnreviewedMessageCountsByObituary() {
  const db = getDb();
  const rows = await allRows(
    db
      .select({
        obituaryId: commemorativeMessages.obituaryId,
        count: count(),
      })
      .from(commemorativeMessages)
      .innerJoin(obituaries, eq(commemorativeMessages.obituaryId, obituaries.id))
      .where(
        and(
          eq(obituaries.funeralHomeId, getFuneralHomeId()),
          eq(commemorativeMessages.reviewed, false),
        ),
      )
      .groupBy(commemorativeMessages.obituaryId),
  );
  return Object.fromEntries(rows.map((r) => [r.obituaryId, r.count]));
}

export async function getActiveFlowerProducts() {
  const db = getDb();
  return allRows(db
    .select()
    .from(flowerProducts)
    .where(
      and(
        eq(flowerProducts.funeralHomeId, getFuneralHomeId()),
        eq(flowerProducts.isActive, true),
      ),
    )
    .orderBy(flowerProducts.sortOrder, flowerProducts.name));
}

export type FlowerProductListFilters = {
  page: number;
  pageSize: number;
  active?: ActiveFilter;
};

function flowerProductListConditions(active?: ActiveFilter) {
  const conditions = [eq(flowerProducts.funeralHomeId, getFuneralHomeId())];
  if (active === true) {
    conditions.push(eq(flowerProducts.isActive, true));
  } else if (active === false) {
    conditions.push(eq(flowerProducts.isActive, false));
  }
  return and(...conditions);
}

export async function listFlowerProductsPaginated(
  filters: FlowerProductListFilters,
): Promise<PaginatedResult<(typeof flowerProducts.$inferSelect)>> {
  const db = getDb();
  const where = flowerProductListConditions(filters.active);

  const countRow = await oneRow(
    db.select({ total: count() }).from(flowerProducts).where(where),
  );
  const total = countRow?.total ?? 0;
  const page = clampPage(filters.page, total, filters.pageSize);
  const { limit, offset } = toLimitOffset(page, filters.pageSize);

  const items = await allRows(
    db
      .select()
      .from(flowerProducts)
      .where(where)
      .orderBy(asc(flowerProducts.sortOrder), asc(flowerProducts.name))
      .limit(limit)
      .offset(offset),
  );

  return {
    items,
    total,
    page,
    pageSize: filters.pageSize,
    totalPages: totalPages(total, filters.pageSize),
  };
}

export async function getAllFlowerProducts() {
  const db = getDb();
  return allRows(db
    .select()
    .from(flowerProducts)
    .where(eq(flowerProducts.funeralHomeId, getFuneralHomeId()))
    .orderBy(flowerProducts.sortOrder, flowerProducts.name));
}

export async function getFlowerProductById(id: string) {
  const db = getDb();
  return oneRow(db
    .select()
    .from(flowerProducts)
    .where(
      and(
        eq(flowerProducts.id, id),
        eq(flowerProducts.funeralHomeId, getFuneralHomeId()),
      ),
    ));
}

export async function getActiveFlowerProductById(id: string) {
  const product = await getFlowerProductById(id);
  if (!product?.isActive) return null;
  return product;
}

export type FlowerOrderFilters = {
  status?: FlowerOrderStatus;
  obituaryId?: string;
};

function flowerOrderListConditions(filters: FlowerOrderFilters = {}) {
  const conditions = [eq(flowerOrders.funeralHomeId, getFuneralHomeId())];
  if (filters.status) {
    conditions.push(eq(flowerOrders.status, filters.status));
  }
  if (filters.obituaryId) {
    conditions.push(eq(flowerOrders.obituaryId, filters.obituaryId));
  }
  return and(...conditions);
}

export type FlowerOrderListFilters = {
  page: number;
  pageSize: number;
  status?: FlowerOrderStatus;
};

export type FlowerOrderRow = {
  order: typeof flowerOrders.$inferSelect;
  product: typeof flowerProducts.$inferSelect;
  obituary: typeof obituaries.$inferSelect;
};

export async function listFlowerOrdersPaginated(
  filters: FlowerOrderListFilters,
): Promise<PaginatedResult<FlowerOrderRow>> {
  const db = getDb();
  const where = flowerOrderListConditions({ status: filters.status });

  const countRow = await oneRow(
    db.select({ total: count() }).from(flowerOrders).where(where),
  );
  const total = countRow?.total ?? 0;
  const page = clampPage(filters.page, total, filters.pageSize);
  const { limit, offset } = toLimitOffset(page, filters.pageSize);

  const items = await allRows(
    db
      .select({
        order: flowerOrders,
        product: flowerProducts,
        obituary: obituaries,
      })
      .from(flowerOrders)
      .innerJoin(flowerProducts, eq(flowerOrders.productId, flowerProducts.id))
      .innerJoin(obituaries, eq(flowerOrders.obituaryId, obituaries.id))
      .where(where)
      .orderBy(desc(flowerOrders.createdAt))
      .limit(limit)
      .offset(offset),
  );

  return {
    items,
    total,
    page,
    pageSize: filters.pageSize,
    totalPages: totalPages(total, filters.pageSize),
  };
}

export async function getAllFlowerOrders(filters: FlowerOrderFilters = {}) {
  const db = getDb();
  const where = flowerOrderListConditions(filters);

  return allRows(db
    .select({
      order: flowerOrders,
      product: flowerProducts,
      obituary: obituaries,
    })
    .from(flowerOrders)
    .innerJoin(flowerProducts, eq(flowerOrders.productId, flowerProducts.id))
    .innerJoin(obituaries, eq(flowerOrders.obituaryId, obituaries.id))
    .where(where)
    .orderBy(desc(flowerOrders.createdAt)));
}

export async function getFlowerOrdersByObituaryId(obituaryId: string) {
  const obituary = await getObituaryByIdForTenant(obituaryId);
  if (!obituary) return [];
  return getAllFlowerOrders({ obituaryId });
}

export async function getFlowerOrderById(id: string) {
  const db = getDb();
  return oneRow(db
    .select({
      order: flowerOrders,
      product: flowerProducts,
      obituary: obituaries,
    })
    .from(flowerOrders)
    .innerJoin(flowerProducts, eq(flowerOrders.productId, flowerProducts.id))
    .innerJoin(obituaries, eq(flowerOrders.obituaryId, obituaries.id))
    .where(
      and(
        eq(flowerOrders.id, id),
        eq(flowerOrders.funeralHomeId, getFuneralHomeId()),
      ),
    ));
}

export async function insertFlowerOrder(input: FlowerCheckoutInput) {
  const obituary = await getObituaryById(input.obituaryId);
  if (!obituary) {
    return { ok: false as const, error: "NOT_FOUND" as const };
  }
  if (obituary.funeralHomeId !== getFuneralHomeId()) {
    return { ok: false as const, error: "NOT_FOUND" as const };
  }
  if (!obituary.isVisible) {
    return { ok: false as const, error: "NOT_VISIBLE" as const };
  }

  const product = await getActiveFlowerProductById(input.productId);
  if (!product) {
    return { ok: false as const, error: "PRODUCT_NOT_FOUND" as const };
  }

  const quantity = 1;
  const totalCents = product.priceCents * quantity;
  const id = `flo-${Date.now()}`;
  const now = new Date().toISOString();

  await runSql(
    getDb()
      .insert(flowerOrders)
      .values({
        id,
        obituaryId: input.obituaryId,
        funeralHomeId: getFuneralHomeId(),
        productId: product.id,
        quantity,
        dedicationText: input.dedicationText,
        buyerName: input.buyerName,
        buyerEmail: input.buyerEmail,
        buyerPhone: input.buyerPhone,
        status: "paid",
        paymentReference: `stub-dev-${id}`,
        totalCents,
        createdAt: now,
        updatedAt: now,
      }),
  );

  return { ok: true as const, id };
}

export async function updateFlowerOrderStatus(
  id: string,
  status: FlowerOrderStatus,
) {
  const existing = await getFlowerOrderById(id);
  if (!existing) {
    return { ok: false as const, error: "NOT_FOUND" as const };
  }

  await runSql(getDb()
    .update(flowerOrders)
    .set({ status, updatedAt: new Date().toISOString() })
    .where(eq(flowerOrders.id, id)));

  return { ok: true as const };
}

export async function getAdminUserByAuthId(authUserId: string) {
  const db = getDb();
  return oneRow(
    db
      .select()
      .from(adminUsers)
      .where(
        and(
          eq(adminUsers.authUserId, authUserId),
          eq(adminUsers.funeralHomeId, getFuneralHomeId()),
        ),
      ),
  );
}
