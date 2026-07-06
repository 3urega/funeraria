import { eq } from "drizzle-orm";
import { getDb } from "../src/lib/db";
import {
  contentSections,
  funeralHomes,
  siteConfig,
  wakeRooms,
} from "../src/lib/db/schema";
import { HOME_CONTENT_I18N } from "../src/lib/home/content-i18n";

const BRAND_NAME = "Funeraria Pujols";

const db = getDb();

db.update(funeralHomes)
  .set({ name: BRAND_NAME })
  .where(eq(funeralHomes.id, "fh-001"))
  .run();

db.update(siteConfig)
  .set({
    brandName: BRAND_NAME,
    theme: {
      primary: "#7B2427",
      dark: "#1E2A32",
      muted: "#F5F0E8",
      background: "#FAFAF8",
      heroImagePath: "/gironella-10-1024x698.jpg",
      publicLogoPath: "/funeraria pujols.png",
    },
  })
  .where(eq(siteConfig.funeralHomeId, "fh-001"))
  .run();

db.update(wakeRooms)
  .set({ name: BRAND_NAME })
  .where(eq(wakeRooms.id, "wake-001"))
  .run();

const sections = [
  { id: "cs-top-bar", key: "top_bar", content: HOME_CONTENT_I18N.topBar, order: 0 },
  { id: "cs-hero", key: "hero", content: HOME_CONTENT_I18N.hero, order: 1 },
  { id: "cs-services", key: "services", content: HOME_CONTENT_I18N.services, order: 2 },
  {
    id: "cs-why-us",
    key: "why_us",
    content: { ...HOME_CONTENT_I18N.whyUs, imagePath: "/rescate/salas/sala1.png" },
    order: 3,
  },
  {
    id: "cs-obituaries-intro",
    key: "obituaries_intro",
    content: HOME_CONTENT_I18N.obituariesIntro,
    order: 4,
  },
  { id: "cs-cta-blocks", key: "cta_blocks", content: HOME_CONTENT_I18N.ctaBlocks, order: 5 },
  { id: "cs-footer", key: "footer", content: HOME_CONTENT_I18N.footer, order: 6 },
];

for (const s of sections) {
  const existing = db
    .select()
    .from(contentSections)
    .where(eq(contentSections.id, s.id))
    .get();

  if (existing) {
    db.update(contentSections)
      .set({ contentI18n: s.content, isPublished: true, sortOrder: s.order })
      .where(eq(contentSections.id, s.id))
      .run();
  } else {
    db.insert(contentSections)
      .values({
        id: s.id,
        funeralHomeId: "fh-001",
        sectionKey: s.key,
        contentI18n: s.content,
        isPublished: true,
        sortOrder: s.order,
      })
      .run();
  }
}

console.log(`Home Pujols actualizada (ca + es): ${BRAND_NAME}`);
