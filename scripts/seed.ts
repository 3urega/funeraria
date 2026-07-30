import fs from "fs/promises";
import path from "path";
import { getDb } from "../src/lib/db";
import { runSql } from "@/lib/db/exec";
import {
  adminUsers,
  cemeteries,
  churches,
  commemorativeMessages,
  contentSections,
  flowerProducts,
  funeralHomes,
  obituaries,
  poemTemplates,
  siteConfig,
  wakeRooms,
} from "../src/lib/db/schema";
import { HOME_CONTENT_I18N } from "../src/lib/home/content-i18n";

const FUNERAL_HOME_ID = "fh-001";
const BRAND_NAME = "Funeraria Pujols";
const NOW = new Date().toISOString();

/** 1×1 PNG transparente */
const PLACEHOLDER_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

async function writePlaceholder(relativePath: string) {
  const root = path.resolve(process.cwd(), "storage");
  const full = path.join(root, relativePath);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, PLACEHOLDER_PNG);
}

async function seed() {
  const db = getDb();

  await runSql(db.insert(funeralHomes)
    .values({
      id: FUNERAL_HOME_ID,
      name: BRAND_NAME,
      slug: "pujols",
      createdAt: NOW,
    }));

  await runSql(db.insert(siteConfig)
    .values({
      id: "sc-001",
      funeralHomeId: FUNERAL_HOME_ID,
      brandName: BRAND_NAME,
      mortuaryDefault: "Ctra. de Bassacs, 40",
      contact: {
        phone: "938250119",
        email: "funeraria@pujols.cat",
        address: "C/. Roser, 22 08680 GIRONELLA",
        website: "www.pujols.cat",
      },
      theme: {
        primary: "#7B2427",
        dark: "#1E2A32",
        muted: "#F5F0E8",
        background: "#FAFAF8",
        heroImagePath: "/gironella-10-1024x698.jpg",
        publicLogoPath: "/funeraria pujols.png",
      },
      logoPath: "site/logo.png",
    }));

  const churchId = "church-001";
  const cemeteryId = "cemetery-001";
  const wakeRoomId = "wake-001";

  await runSql(db.insert(churches)
    .values({
      id: churchId,
      funeralHomeId: FUNERAL_HOME_ID,
      name: "Església Parroquial de Gironella",
      city: "Gironella",
      address: "Plaça Major, 08680 Gironella",
      latitude: 42.0492,
      longitude: 1.8834,
      googlePlaceId: null,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=42.0492,1.8834",
      imagePath: "places/churches/church-001/photo.png",
    }));

  await runSql(db.insert(cemeteries)
    .values({
      id: cemeteryId,
      funeralHomeId: FUNERAL_HOME_ID,
      name: "Cementiri de Gironella",
      city: "Gironella",
      address: "Carrer del Cementiri, 08680 Gironella",
      latitude: 42.0515,
      longitude: 1.8798,
      googlePlaceId: null,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=42.0515,1.8798",
      imagePath: "places/cemeteries/cemetery-001/photo.png",
    }));

  await runSql(db.insert(wakeRooms)
    .values({
      id: wakeRoomId,
      funeralHomeId: FUNERAL_HOME_ID,
      name: BRAND_NAME,
      description:
        "Sales acollidores amb la màxima intimitat per rebre familiars i amics. Equipament modern i ambient serè.",
      address: "C/. Roser, 22 08680 GIRONELLA",
      latitude: 42.0486,
      longitude: 1.8841,
      googlePlaceId: null,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=42.0486,1.8841",
      imagePath: "places/wake-rooms/wake-001/photo.png",
      isActive: true,
    }));

  const obituaryPublicId = "obi-001";
  const obituaryPrivateId = "obi-002";
  const obituaryDraftId = "obi-003";

  await runSql(db.insert(poemTemplates)
    .values([
      {
        id: "poem-001",
        funeralHomeId: FUNERAL_HOME_ID,
        title: "Record etern",
        text: "No morir del tot és l'immortal,\nviure en el cor de qui ens estima.\nEl teu record brillarà sempre\ncom una estrella en la nit.",
        isActive: true,
      },
      {
        id: "poem-002",
        funeralHomeId: FUNERAL_HOME_ID,
        title: "Despedida",
        text: "Donat per tu, tornat a Déu,\nqui el va donar.\nEl teu amor i la teva llum\nqueden amb nosaltres per sempre.",
        isActive: true,
      },
      {
        id: "poem-003",
        funeralHomeId: FUNERAL_HOME_ID,
        title: "Sempre present",
        text: "Allà on hi ha un record,\nallà hi ha amor.\nI on hi ha amor, no hi ha mort.",
        isActive: true,
      },
    ]));

  await runSql(db.insert(obituaries)
    .values([
      {
        id: obituaryPublicId,
        funeralHomeId: FUNERAL_HOME_ID,
        slug: "ramon-sant-torner",
        name: "RAMON SANT TORNER",
        imagePath: "obituaries/obi-001/photo.png",
        deathPlace: "Berga",
        deathDay: "1",
        ageAtDeath: 75,
        funeralDatetime: "dimarts dia 3 a les 11:00",
        mortuaryAddress: "Ctra. de Bassacs, 40",
        wakeRoomId,
        wakeSchedule: "Dilluns de 17:00 a 19:00",
        showEpd: true,
        visitCode: "DEMO1234",
        expedientCode: "EXP-2026-001",
        isReady: true,
        isActive: true,
        isVisible: true,
        churchId,
        cemeteryId,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: obituaryPrivateId,
        funeralHomeId: FUNERAL_HOME_ID,
        slug: "joan-puig-martinez",
        name: "Joan Puig Martínez",
        imagePath: "obituaries/obi-002/photo.png",
        visitCode: "PRIV5678",
        expedientCode: "EXP-2026-002",
        isReady: true,
        isActive: true,
        isVisible: false,
        churchId,
        cemeteryId,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: obituaryDraftId,
        funeralHomeId: FUNERAL_HOME_ID,
        slug: "anna-ferrer-sola",
        name: "Anna Ferrer Solà",
        imagePath: null,
        visitCode: "DRFT9012",
        expedientCode: "EXP-2026-003",
        isReady: false,
        isActive: false,
        isVisible: false,
        createdAt: NOW,
        updatedAt: NOW,
      },
    ]));

  await runSql(db.insert(commemorativeMessages)
    .values([
      {
        id: "msg-demo-001",
        obituaryId: obituaryPublicId,
        senderName: "Maria Puig",
        messageText:
          "Ramón, sempre et recordarem amb afecte. Una abraçada a tota la família.",
        reviewed: false,
        createdAt: NOW,
      },
      {
        id: "msg-demo-002",
        obituaryId: obituaryPublicId,
        senderName: "Joan Martí",
        messageText: "Un record ple de gratitud per tot el que ens vas donar.",
        reviewed: true,
        createdAt: NOW,
      },
    ]));

  await runSql(db.insert(contentSections)
    .values([
      {
        id: "cs-top-bar",
        funeralHomeId: FUNERAL_HOME_ID,
        sectionKey: "top_bar",
        contentI18n: HOME_CONTENT_I18N.topBar,
        isPublished: true,
        sortOrder: 0,
      },
      {
        id: "cs-hero",
        funeralHomeId: FUNERAL_HOME_ID,
        sectionKey: "hero",
        contentI18n: HOME_CONTENT_I18N.hero,
        isPublished: true,
        sortOrder: 1,
      },
      {
        id: "cs-services",
        funeralHomeId: FUNERAL_HOME_ID,
        sectionKey: "services",
        contentI18n: HOME_CONTENT_I18N.services,
        isPublished: true,
        sortOrder: 2,
      },
      {
        id: "cs-why-us",
        funeralHomeId: FUNERAL_HOME_ID,
        sectionKey: "why_us",
        contentI18n: {
          ...HOME_CONTENT_I18N.whyUs,
          imagePath: "/rescate/salas/sala1.png",
        },
        isPublished: true,
        sortOrder: 3,
      },
      {
        id: "cs-obituaries-intro",
        funeralHomeId: FUNERAL_HOME_ID,
        sectionKey: "obituaries_intro",
        contentI18n: HOME_CONTENT_I18N.obituariesIntro,
        isPublished: true,
        sortOrder: 4,
      },
      {
        id: "cs-cta-blocks",
        funeralHomeId: FUNERAL_HOME_ID,
        sectionKey: "cta_blocks",
        contentI18n: HOME_CONTENT_I18N.ctaBlocks,
        isPublished: true,
        sortOrder: 5,
      },
      {
        id: "cs-footer",
        funeralHomeId: FUNERAL_HOME_ID,
        sectionKey: "footer",
        contentI18n: HOME_CONTENT_I18N.footer,
        isPublished: true,
        sortOrder: 6,
      },
    ]));

  await runSql(db.insert(flowerProducts)
    .values([
      {
        id: "flw-001",
        funeralHomeId: FUNERAL_HOME_ID,
        name: "Corona clàssica",
        description: "Corona tradicional de flors naturals, adequada per a funeral i vetlla.",
        priceCents: 8500,
        currency: "EUR",
        imagePath: "flowers/flw-001/photo.png",
        isActive: true,
        sortOrder: 1,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "flw-002",
        funeralHomeId: FUNERAL_HOME_ID,
        name: "Ramo de roses",
        description: "Ramo de roses blanques i vermelles amb fullatge.",
        priceCents: 4500,
        currency: "EUR",
        imagePath: "flowers/flw-002/photo.png",
        isActive: true,
        sortOrder: 2,
        createdAt: NOW,
        updatedAt: NOW,
      },
      {
        id: "flw-003",
        funeralHomeId: FUNERAL_HOME_ID,
        name: "Centre funerari",
        description: "Composició discreta per a sala de vetlla o cerimònia.",
        priceCents: 6200,
        currency: "EUR",
        imagePath: "flowers/flw-003/photo.png",
        isActive: true,
        sortOrder: 3,
        createdAt: NOW,
        updatedAt: NOW,
      },
    ]));

  await runSql(db.insert(adminUsers)
    .values({
      id: "au-001",
      authUserId: "dev-admin-001",
      funeralHomeId: FUNERAL_HOME_ID,
      role: "admin",
    }));

  await writePlaceholder("site/logo.png");
  await writePlaceholder("places/churches/church-001/photo.png");
  await writePlaceholder("places/cemeteries/cemetery-001/photo.png");
  await writePlaceholder("places/wake-rooms/wake-001/photo.png");
  await writePlaceholder("obituaries/obi-001/photo.png");
  await writePlaceholder("obituaries/obi-002/photo.png");
  await writePlaceholder("flowers/flw-001/photo.png");
  await writePlaceholder("flowers/flw-002/photo.png");
  await writePlaceholder("flowers/flw-003/photo.png");

  console.log("Seed completado.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
