import type { Obituary } from "@/lib/db/schema";
import { buildEsquelaPrintData } from "@/lib/esquela/build-esquela-print-data";
import type { EsquelaPrintData } from "@/lib/esquela/types";
import { EsquelaPrintLayout } from "@/components/esquela/esquela-print-layout";

type SiteConfigInput = Parameters<typeof buildEsquelaPrintData>[0]["siteConfig"];

type Props = {
  obituary: Obituary;
  officialImageUrl: string | null;
  funeralHomeName: string;
  siteConfig: SiteConfigInput;
  church: Parameters<typeof buildEsquelaPrintData>[0]["church"];
  cemetery: Parameters<typeof buildEsquelaPrintData>[0]["cemetery"];
  wakeRoom: Parameters<typeof buildEsquelaPrintData>[0]["wakeRoom"];
  /** Si es passa, es fa servir directament (p. ex. vista prèvia admin). */
  printData?: EsquelaPrintData;
};

/** Vista de l'esquela — plantilla impresa (patró Pujols). */
export function EsquelaView({
  obituary,
  officialImageUrl,
  funeralHomeName,
  siteConfig,
  church,
  cemetery,
  wakeRoom,
  printData,
}: Props) {
  const data =
    printData ??
    buildEsquelaPrintData({
      obituary,
      church,
      cemetery,
      wakeRoom,
      funeralHomeName,
      siteConfig,
      photoUrl: officialImageUrl,
    });

  return <EsquelaPrintLayout data={data} />;
}
