import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { getFuneralHomeId } from "@/lib/site/tenant";
import {
  cemeteries,
  churches,
  commemorativeMessages,
  contentSections,
  funeralHomes,
  obituaries,
  poemTemplates,
  siteConfig,
  wakeRooms,
} from "@/lib/db/schema";
import type { CreateCommemorativeMessageInput } from "@/lib/commemorative/schema";

export async function getVisibleObituaries() {
  const db = getDb();
  return db
    .select()
    .from(obituaries)
    .where(
      and(
        eq(obituaries.funeralHomeId, getFuneralHomeId()),
        eq(obituaries.isVisible, true),
      ),
    )
    .all();
}

export async function getObituaryBySlug(slug: string) {
  const db = getDb();
  return db
    .select()
    .from(obituaries)
    .where(eq(obituaries.slug, slug))
    .get();
}

export async function getObituaryById(id: string) {
  const db = getDb();
  return db.select().from(obituaries).where(eq(obituaries.id, id)).get();
}

export async function getObituaryByIdForTenant(id: string) {
  const db = getDb();
  return db
    .select()
    .from(obituaries)
    .where(
      and(
        eq(obituaries.id, id),
        eq(obituaries.funeralHomeId, getFuneralHomeId()),
      ),
    )
    .get();
}

export async function getObituaryByVisitCode(code: string) {
  const db = getDb();
  return db
    .select()
    .from(obituaries)
    .where(
      and(
        eq(obituaries.funeralHomeId, getFuneralHomeId()),
        eq(obituaries.visitCode, code.toUpperCase()),
      ),
    )
    .get();
}

export async function getObituaryWithPlaces(id: string) {
  const obituary = await getObituaryById(id);
  if (!obituary) return null;

  const db = getDb();
  const church = obituary.churchId
    ? db
        .select()
        .from(churches)
        .where(eq(churches.id, obituary.churchId))
        .get()
    : null;
  const cemetery = obituary.cemeteryId
    ? db
        .select()
        .from(cemeteries)
        .where(eq(cemeteries.id, obituary.cemeteryId))
        .get()
    : null;
  const wakeRoom = obituary.wakeRoomId
    ? db
        .select()
        .from(wakeRooms)
        .where(eq(wakeRooms.id, obituary.wakeRoomId))
        .get()
    : null;
  const poemTemplate = obituary.obituarioPoemTemplateId
    ? db
        .select()
        .from(poemTemplates)
        .where(eq(poemTemplates.id, obituary.obituarioPoemTemplateId))
        .get()
    : null;

  return { obituary, church, cemetery, wakeRoom, poemTemplate };
}

export async function getActivePoemTemplates() {
  const db = getDb();
  return db
    .select()
    .from(poemTemplates)
    .where(
      and(
        eq(poemTemplates.funeralHomeId, getFuneralHomeId()),
        eq(poemTemplates.isActive, true),
      ),
    )
    .all();
}

export async function getAllObituaries() {
  const db = getDb();
  return db
    .select()
    .from(obituaries)
    .where(eq(obituaries.funeralHomeId, getFuneralHomeId()))
    .all();
}

export async function getFuneralHomeById(id: string) {
  const db = getDb();
  return db.select().from(funeralHomes).where(eq(funeralHomes.id, id)).get();
}

export async function getSiteConfig() {
  const db = getDb();
  return db
    .select()
    .from(siteConfig)
    .where(eq(siteConfig.funeralHomeId, getFuneralHomeId()))
    .get();
}

export async function getPublishedContentSections() {
  const db = getDb();
  return db
    .select()
    .from(contentSections)
    .where(
      and(
        eq(contentSections.funeralHomeId, getFuneralHomeId()),
        eq(contentSections.isPublished, true),
      ),
    )
    .all();
}

export async function getContentSectionByKey(sectionKey: string) {
  const db = getDb();
  return db
    .select()
    .from(contentSections)
    .where(
      and(
        eq(contentSections.funeralHomeId, getFuneralHomeId()),
        eq(contentSections.sectionKey, sectionKey),
      ),
    )
    .get();
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
  return db
    .select()
    .from(wakeRooms)
    .where(
      and(
        eq(wakeRooms.funeralHomeId, getFuneralHomeId()),
        eq(wakeRooms.isActive, true),
      ),
    )
    .all();
}

export async function getAllWakeRooms() {
  const db = getDb();
  return db
    .select()
    .from(wakeRooms)
    .where(eq(wakeRooms.funeralHomeId, getFuneralHomeId()))
    .all();
}

export async function getWakeRoomById(id: string) {
  const db = getDb();
  return db
    .select()
    .from(wakeRooms)
    .where(
      and(eq(wakeRooms.id, id), eq(wakeRooms.funeralHomeId, getFuneralHomeId())),
    )
    .get();
}

export async function getAllChurches() {
  const db = getDb();
  return db
    .select()
    .from(churches)
    .where(eq(churches.funeralHomeId, getFuneralHomeId()))
    .all();
}

export async function getChurchById(id: string) {
  const db = getDb();
  return db
    .select()
    .from(churches)
    .where(
      and(eq(churches.id, id), eq(churches.funeralHomeId, getFuneralHomeId())),
    )
    .get();
}

export async function getAllCemeteries() {
  const db = getDb();
  return db
    .select()
    .from(cemeteries)
    .where(eq(cemeteries.funeralHomeId, getFuneralHomeId()))
    .all();
}

export async function getCemeteryById(id: string) {
  const db = getDb();
  return db
    .select()
    .from(cemeteries)
    .where(
      and(eq(cemeteries.id, id), eq(cemeteries.funeralHomeId, getFuneralHomeId())),
    )
    .get();
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
  return db
    .select()
    .from(commemorativeMessages)
    .where(eq(commemorativeMessages.obituaryId, obituaryId))
    .orderBy(desc(commemorativeMessages.createdAt))
    .all();
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

  getDb()
    .insert(commemorativeMessages)
    .values({
      id,
      obituaryId: input.obituaryId,
      senderName: input.senderName,
      messageText: input.messageText,
      createdAt,
    })
    .run();

  return { ok: true as const, id };
}
