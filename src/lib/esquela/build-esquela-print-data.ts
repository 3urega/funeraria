import type { Cemetery, Church, Obituary, WakeRoom } from "@/lib/db/schema";
import type { EsquelaContact, EsquelaPrintData } from "./types";

type SiteConfigInput = {
  contact?: EsquelaContact | null;
  theme?: Record<string, string> | null;
  brandName?: string | null;
  mortuaryDefault?: string | null;
};

type Input = {
  obituary: Obituary;
  church: Church | null;
  cemetery: Cemetery | null;
  wakeRoom: WakeRoom | null;
  funeralHomeName: string;
  siteConfig: SiteConfigInput | null;
  photoUrl: string | null;
};

function churchArticle(name: string): string {
  const lower = name.toLowerCase();
  if (lower.startsWith("església") || lower.startsWith("esglesia")) {
    return name;
  }
  return `Església ${name}`;
}

function hasStructuredFields(obituary: Obituary): boolean {
  return Boolean(
    obituary.deathPlace &&
      obituary.deathDay &&
      obituary.ageAtDeath != null &&
      obituary.funeralDatetime,
  );
}

/** Converteix camps de BD en dades per a la plantilla d'esquela impresa. */
export function buildEsquelaPrintData({
  obituary,
  church,
  wakeRoom,
  funeralHomeName,
  siteConfig,
  photoUrl,
}: Input): EsquelaPrintData {
  const contact: EsquelaContact = {
    address: siteConfig?.contact?.address ?? "",
    phone: siteConfig?.contact?.phone ?? "",
    email: siteConfig?.contact?.email ?? "",
    website: siteConfig?.contact?.website,
  };

  const brandName = siteConfig?.brandName ?? funeralHomeName;
  const brandColor = siteConfig?.theme?.primary;
  const showEpd = obituary.showEpd ?? true;

  if (hasStructuredFields(obituary)) {
    const mortuaryAddress =
      obituary.mortuaryAddress ?? siteConfig?.mortuaryDefault ?? null;

    const wakeLocationLabel =
      wakeRoom?.name ?? obituary.wakeLocation ?? null;

    return {
      brandName,
      brandColor,
      contact,
      deceasedName: obituary.name,
      photoUrl,
      showEpd,
      deathLine: `Morí a ${obituary.deathPlace} el dia ${obituary.deathDay} a l'edat de ${obituary.ageAtDeath} anys`,
      funeralLine1: `Enterrament i funeral, ${obituary.funeralDatetime}`,
      funeralLine2: church
        ? `A l'${churchArticle(church.name)}`
        : null,
      mortuaryLine: mortuaryAddress
        ? `Casa mortuòria: ${mortuaryAddress}`
        : null,
      wakeLine1: wakeLocationLabel
        ? `Sales de vetlla: ${wakeLocationLabel}`
        : null,
      wakeLine2: obituary.wakeSchedule ?? null,
    };
  }

  // Fallback: blocs de text lliure (compatibilitat seed antic)
  const funeralLines = obituary.funeralDetails?.split("\n") ?? [];
  const wakeLines = obituary.wakeDetails?.split("\n") ?? [];

  return {
    brandName,
    brandColor,
    contact,
    deceasedName: obituary.name,
    photoUrl,
    showEpd,
    deathLine: obituary.deathNotice ?? null,
    funeralLine1: funeralLines[0] ?? null,
    funeralLine2: funeralLines[1] ?? (church ? `A l'${churchArticle(church.name)}` : null),
    mortuaryLine: null,
    wakeLine1: wakeLines[0] ?? null,
    wakeLine2: wakeLines[1] ?? null,
  };
}
