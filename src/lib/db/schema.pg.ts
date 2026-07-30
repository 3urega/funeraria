import {
  boolean,
  doublePrecision,
  integer,
  jsonb,
  pgTable,
  text,
} from "drizzle-orm/pg-core";

export const funeralHomes = pgTable("funeral_homes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: text("created_at").notNull(),
});

export const siteConfig = pgTable("site_config", {
  id: text("id").primaryKey(),
  funeralHomeId: text("funeral_home_id")
    .notNull()
    .references(() => funeralHomes.id),
  contact: jsonb("contact").$type<{
    phone: string;
    email: string;
    address: string;
    website?: string;
    whatsapp?: string;
  }>(),
  brandName: text("brand_name"),
  mortuaryDefault: text("mortuary_default"),
  theme: jsonb("theme").$type<Record<string, string>>(),
  logoPath: text("logo_path"),
});

export const churches = pgTable("churches", {
  id: text("id").primaryKey(),
  funeralHomeId: text("funeral_home_id")
    .notNull()
    .references(() => funeralHomes.id),
  name: text("name").notNull(),
  city: text("city"),
  address: text("address"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  googlePlaceId: text("google_place_id"),
  googleMapsUrl: text("google_maps_url"),
  imagePath: text("image_path"),
});

export const cemeteries = pgTable("cemeteries", {
  id: text("id").primaryKey(),
  funeralHomeId: text("funeral_home_id")
    .notNull()
    .references(() => funeralHomes.id),
  name: text("name").notNull(),
  city: text("city"),
  address: text("address"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  googlePlaceId: text("google_place_id"),
  googleMapsUrl: text("google_maps_url"),
  imagePath: text("image_path"),
});

export const wakeRooms = pgTable("wake_rooms", {
  id: text("id").primaryKey(),
  funeralHomeId: text("funeral_home_id")
    .notNull()
    .references(() => funeralHomes.id),
  name: text("name").notNull(),
  description: text("description"),
  address: text("address"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  googlePlaceId: text("google_place_id"),
  googleMapsUrl: text("google_maps_url"),
  imagePath: text("image_path"),
  isActive: boolean("is_active").notNull().default(true),
});

export const poemTemplates = pgTable("poem_templates", {
  id: text("id").primaryKey(),
  funeralHomeId: text("funeral_home_id")
    .notNull()
    .references(() => funeralHomes.id),
  title: text("title").notNull(),
  text: text("text").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const obituaries = pgTable("obituaries", {
  id: text("id").primaryKey(),
  funeralHomeId: text("funeral_home_id")
    .notNull()
    .references(() => funeralHomes.id),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  visitCode: text("visit_code").notNull().unique(),
  expedientCode: text("expedient_code"),
  isReady: boolean("is_ready").notNull().default(false),
  isActive: boolean("is_active").notNull().default(false),
  isVisible: boolean("is_visible").notNull().default(false),
  churchId: text("church_id").references(() => churches.id),
  cemeteryId: text("cemetery_id").references(() => cemeteries.id),
  wakeRoomId: text("wake_room_id").references(() => wakeRooms.id),
  deathNotice: text("death_notice"),
  deathPlace: text("death_place"),
  deathDay: text("death_day"),
  ageAtDeath: integer("age_at_death"),
  funeralDatetime: text("funeral_datetime"),
  funeralDetails: text("funeral_details"),
  mortuaryAddress: text("mortuary_address"),
  wakeLocation: text("wake_location"),
  wakeSchedule: text("wake_schedule"),
  wakeDetails: text("wake_details"),
  showEpd: boolean("show_epd").notNull().default(true),
  imagePath: text("image_path"),
  customImagePath: text("custom_image_path"),
  familyImageStatus: text("family_image_status").$type<
    "pending" | "rejected" | null
  >(),
  obituarioPoemTemplateId: text("obituario_poem_template_id").references(
    () => poemTemplates.id,
  ),
  obituarioText: text("obituario_text"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const commemorativeMessages = pgTable("commemorative_messages", {
  id: text("id").primaryKey(),
  obituaryId: text("obituary_id")
    .notNull()
    .references(() => obituaries.id),
  senderName: text("sender_name").notNull(),
  messageText: text("message_text").notNull(),
  reviewed: boolean("reviewed").notNull().default(false),
  createdAt: text("created_at").notNull(),
});

export const flowerProducts = pgTable("flower_products", {
  id: text("id").primaryKey(),
  funeralHomeId: text("funeral_home_id")
    .notNull()
    .references(() => funeralHomes.id),
  name: text("name").notNull(),
  description: text("description"),
  priceCents: integer("price_cents").notNull(),
  currency: text("currency").notNull().default("EUR"),
  imagePath: text("image_path"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const flowerOrders = pgTable("flower_orders", {
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

export const contentSections = pgTable("content_sections", {
  id: text("id").primaryKey(),
  funeralHomeId: text("funeral_home_id")
    .notNull()
    .references(() => funeralHomes.id),
  sectionKey: text("section_key").notNull(),
  contentI18n: jsonb("content_i18n").$type<Record<string, unknown>>(),
  isPublished: boolean("is_published").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const adminUsers = pgTable("admin_users", {
  id: text("id").primaryKey(),
  authUserId: text("auth_user_id").notNull(),
  funeralHomeId: text("funeral_home_id")
    .notNull()
    .references(() => funeralHomes.id),
  role: text("role").notNull().default("admin"),
});
