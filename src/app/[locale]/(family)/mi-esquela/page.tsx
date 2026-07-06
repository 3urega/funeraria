import { notFound } from "next/navigation";
import { getFamilySessionFromCookies } from "@/lib/auth/session";
import {
  getActivePoemTemplates,
  getFuneralHomeById,
  getObituaryWithPlaces,
  getSiteConfig,
} from "@/lib/db/queries";
import { getStorage } from "@/lib/storage";
import { FamilyLogoutButton } from "@/components/family/logout-button";
import { FamilyZone } from "@/components/family/family-zone";

export const metadata = {
  title: "La meva esquela",
  robots: { index: false, follow: false },
};

export default async function MiEsquelaPage() {
  const session = await getFamilySessionFromCookies();
  if (!session) notFound();

  const data = await getObituaryWithPlaces(session.obituaryId);
  if (!data) notFound();

  const [poemTemplates, siteConfig, funeralHome] = await Promise.all([
    getActivePoemTemplates(),
    getSiteConfig(),
    getFuneralHomeById(data.obituary.funeralHomeId),
  ]);

  const storage = getStorage();
  const officialImageUrl = data.obituary.imagePath
    ? storage.getPublicUrl(data.obituary.imagePath)
    : null;
  const pendingImageUrl =
    data.obituary.familyImageStatus === "pending" &&
    data.obituary.customImagePath
      ? storage.getPublicUrl(data.obituary.customImagePath)
      : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{data.obituary.name}</h1>
          <p className="mt-1 text-sm text-zinc-500">Zona familiar</p>
        </div>
        <FamilyLogoutButton />
      </div>

      {!data.obituary.isVisible && (
        <p className="mb-6 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Esquela privada — només accessible amb codi.
        </p>
      )}

      <FamilyZone
        obituary={data.obituary}
        poemTemplates={poemTemplates}
        poemTemplate={data.poemTemplate ?? null}
        officialImageUrl={officialImageUrl}
        pendingImageUrl={pendingImageUrl}
        familyImageStatus={data.obituary.familyImageStatus}
        esquelaContext={{
          funeralHomeName: funeralHome?.name ?? "Funerària",
          siteConfig: siteConfig
            ? {
                contact: siteConfig.contact,
                theme: siteConfig.theme,
                brandName: siteConfig.brandName,
                mortuaryDefault: siteConfig.mortuaryDefault,
              }
            : null,
          church: data.church ?? null,
          cemetery: data.cemetery ?? null,
          wakeRoom: data.wakeRoom ?? null,
        }}
      />
    </div>
  );
}
