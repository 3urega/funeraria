import * as sqlite from "./schema.sqlite";
import * as pg from "./schema.pg";

export function isPostgresDriver(): boolean {
  return (process.env.DATABASE_DRIVER ?? "sqlite") === "postgres";
}

function pick<T>(sqliteVal: T, pgVal: unknown): T {
  return (isPostgresDriver() ? pgVal : sqliteVal) as T;
}

export const funeralHomes = pick(sqlite.funeralHomes, pg.funeralHomes);
export const siteConfig = pick(sqlite.siteConfig, pg.siteConfig);
export const churches = pick(sqlite.churches, pg.churches);
export const cemeteries = pick(sqlite.cemeteries, pg.cemeteries);
export const wakeRooms = pick(sqlite.wakeRooms, pg.wakeRooms);
export const poemTemplates = pick(sqlite.poemTemplates, pg.poemTemplates);
export const obituaries = pick(sqlite.obituaries, pg.obituaries);
export const commemorativeMessages = pick(
  sqlite.commemorativeMessages,
  pg.commemorativeMessages,
);
export const flowerProducts = pick(sqlite.flowerProducts, pg.flowerProducts);
export const flowerOrders = pick(sqlite.flowerOrders, pg.flowerOrders);
export const contentSections = pick(
  sqlite.contentSections,
  pg.contentSections,
);
export const adminUsers = pick(sqlite.adminUsers, pg.adminUsers);

export type Obituary = typeof sqlite.obituaries.$inferSelect;
export type Church = typeof sqlite.churches.$inferSelect;
export type Cemetery = typeof sqlite.cemeteries.$inferSelect;
export type WakeRoom = typeof sqlite.wakeRooms.$inferSelect;
export type PoemTemplate = typeof sqlite.poemTemplates.$inferSelect;
export type CommemorativeMessage =
  typeof sqlite.commemorativeMessages.$inferSelect;
export type FlowerProduct = typeof sqlite.flowerProducts.$inferSelect;
export type FlowerOrder = typeof sqlite.flowerOrders.$inferSelect;
export type ContentSection = typeof sqlite.contentSections.$inferSelect;
export type AdminUser = typeof sqlite.adminUsers.$inferSelect;
