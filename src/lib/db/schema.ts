import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const funeralHomes = sqliteTable("funeral_homes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: text("created_at").notNull(),
});

export const siteConfig = sqliteTable("site_config", {
  id: text("id").primaryKey(),
  funeralHomeId: text("funeral_home_id")
    .notNull()
    .references(() => funeralHomes.id),
  contact: text("contact", { mode: "json" }).$type<{
    phone: string;
    email: string;
    address: string;
    website?: string;
    whatsapp?: string;
  }>(),
  brandName: text("brand_name"),
  mortuaryDefault: text("mortuary_default"),
  theme: text("theme", { mode: "json" }).$type<Record<string, string>>(),
  logoPath: text("logo_path"),
});

export const churches = sqliteTable("churches", {
  id: text("id").primaryKey(),
  funeralHomeId: text("funeral_home_id")
    .notNull()
    .references(() => funeralHomes.id),
  name: text("name").notNull(),
  city: text("city"),
  address: text("address"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  googlePlaceId: text("google_place_id"),
  googleMapsUrl: text("google_maps_url"),
  imagePath: text("image_path"),
});

export const cemeteries = sqliteTable("cemeteries", {
  id: text("id").primaryKey(),
  funeralHomeId: text("funeral_home_id")
    .notNull()
    .references(() => funeralHomes.id),
  name: text("name").notNull(),
  city: text("city"),
  address: text("address"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  googlePlaceId: text("google_place_id"),
  googleMapsUrl: text("google_maps_url"),
  imagePath: text("image_path"),
});

/** Sales de vetlla — catàleg assignable des del formulari esquela */
export const wakeRooms = sqliteTable("wake_rooms", {
  id: text("id").primaryKey(),
  funeralHomeId: text("funeral_home_id")
    .notNull()
    .references(() => funeralHomes.id),
  name: text("name").notNull(),
  description: text("description"),
  address: text("address"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  googlePlaceId: text("google_place_id"),
  googleMapsUrl: text("google_maps_url"),
  imagePath: text("image_path"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
});

export const poemTemplates = sqliteTable("poem_templates", {
  id: text("id").primaryKey(),
  funeralHomeId: text("funeral_home_id")
    .notNull()
    .references(() => funeralHomes.id),
  title: text("title").notNull(),
  text: text("text").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
});

export const obituaries = sqliteTable("obituaries", {
  id: text("id").primaryKey(),
  funeralHomeId: text("funeral_home_id")
    .notNull()
    .references(() => funeralHomes.id),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  visitCode: text("visit_code").notNull().unique(),
  expedientCode: text("expedient_code"),
  isReady: integer("is_ready", { mode: "boolean" }).notNull().default(false),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(false),
  isVisible: integer("is_visible", { mode: "boolean" }).notNull().default(false),
  churchId: text("church_id").references(() => churches.id),
  cemeteryId: text("cemetery_id").references(() => cemeteries.id),
  wakeRoomId: text("wake_room_id").references(() => wakeRooms.id),
  /** Esquela — avís de defunció (creat per l'empleat des del backoffice) */
  deathNotice: text("death_notice"),
  deathPlace: text("death_place"),
  deathDay: text("death_day"),
  ageAtDeath: integer("age_at_death"),
  funeralDatetime: text("funeral_datetime"),
  funeralDetails: text("funeral_details"),
  mortuaryAddress: text("mortuary_address"),
  /** @deprecated Usar wakeRoomId — fallback legacy */
  wakeLocation: text("wake_location"),
  wakeSchedule: text("wake_schedule"),
  wakeDetails: text("wake_details"),
  showEpd: integer("show_epd", { mode: "boolean" }).notNull().default(true),
  /** Foto retocada i publicada (escaneig admin o retoc de foto digital del familiar) */
  imagePath: text("image_path"),
  /** Via web: original digital enviat pel familiar (pendent de retocar) */
  customImagePath: text("custom_image_path"),
  /** pending = pendent de retocar per l'empleat | rejected = no utilitzable | null */
  familyImageStatus: text("family_image_status").$type<
    "pending" | "rejected" | null
  >(),
  /** Obituario — homenatge poètic (personalitzat pel familiar) */
  obituarioPoemTemplateId: text("obituario_poem_template_id").references(
    () => poemTemplates.id,
  ),
  obituarioText: text("obituario_text"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

/** Missatges conmemoratius — visitant → familiars a la sala de vetlla (no públics) */
export const commemorativeMessages = sqliteTable("commemorative_messages", {
  id: text("id").primaryKey(),
  obituaryId: text("obituary_id")
    .notNull()
    .references(() => obituaries.id),
  senderName: text("sender_name").notNull(),
  messageText: text("message_text").notNull(),
  reviewed: integer("reviewed", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull(),
});

/** Catàleg de flors — gestionat des del backoffice */
export const flowerProducts = sqliteTable("flower_products", {
  id: text("id").primaryKey(),
  funeralHomeId: text("funeral_home_id")
    .notNull()
    .references(() => funeralHomes.id),
  name: text("name").notNull(),
  description: text("description"),
  priceCents: integer("price_cents").notNull(),
  currency: text("currency").notNull().default("EUR"),
  imagePath: text("image_path"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

/** Comandes de flors vinculades a una esquela */
export const flowerOrders = sqliteTable("flower_orders", {
  id: text("id").primaryKey(),
  obituaryId: text("obituary_id")
    .notNull()
    .references(() => obituaries.id),
  funeralHomeId: text("funeral_home_id")
    .notNull()
    .references(() => funeralHomes.id),
  productId: text("product_id")
    .notNull()
    .references(() => flowerProducts.id),
  quantity: integer("quantity").notNull().default(1),
  dedicationText: text("dedication_text").notNull(),
  buyerName: text("buyer_name").notNull(),
  buyerEmail: text("buyer_email").notNull(),
  buyerPhone: text("buyer_phone").notNull(),
  status: text("status").notNull(),
  paymentReference: text("payment_reference"),
  totalCents: integer("total_cents").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const contentSections = sqliteTable("content_sections", {
  id: text("id").primaryKey(),
  funeralHomeId: text("funeral_home_id")
    .notNull()
    .references(() => funeralHomes.id),
  sectionKey: text("section_key").notNull(),
  contentI18n: text("content_i18n", { mode: "json" }).$type<
    Record<string, unknown>
  >(),
  isPublished: integer("is_published", { mode: "boolean" })
    .notNull()
    .default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const adminUsers = sqliteTable("admin_users", {
  id: text("id").primaryKey(),
  authUserId: text("auth_user_id").notNull(),
  funeralHomeId: text("funeral_home_id")
    .notNull()
    .references(() => funeralHomes.id),
  role: text("role").notNull().default("admin"),
});

export type Obituary = typeof obituaries.$inferSelect;
export type Church = typeof churches.$inferSelect;
export type Cemetery = typeof cemeteries.$inferSelect;
export type WakeRoom = typeof wakeRooms.$inferSelect;
export type PoemTemplate = typeof poemTemplates.$inferSelect;
export type CommemorativeMessage = typeof commemorativeMessages.$inferSelect;
export type FlowerProduct = typeof flowerProducts.$inferSelect;
export type FlowerOrder = typeof flowerOrders.$inferSelect;
export type ContentSection = typeof contentSections.$inferSelect;
