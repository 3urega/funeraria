import Link from "next/link";
import { notFound } from "next/navigation";
import { EsquelaAdminForm } from "@/components/admin/esquela-admin-form";
import { EsquelaAdminTabs } from "@/components/admin/esquela-admin-tabs";
import { EsquelaMessagesPanel } from "@/components/admin/esquela-messages-panel";
import { EsquelaFlowerOrdersPanel } from "@/components/admin/esquela-flower-orders-panel";
import {
  getAllCemeteries,
  getAllChurches,
  getAllWakeRooms,
  getCommemorativeMessagesByObituaryId,
  getFlowerOrdersByObituaryId,
  getFuneralHomeById,
  getObituaryByIdForTenant,
  getSiteConfig,
} from "@/lib/db/queries";
import { getFuneralHomeId } from "@/lib/site/tenant";
import { getStorage } from "@/lib/storage";
import { mediaPublicUrl } from "@/lib/storage/public-url";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const obituary = await getObituaryByIdForTenant(id);
  return {
    title: obituary
      ? `Admin — Editar ${obituary.name}`
      : "Admin — Editar esquela",
  };
}

export default async function AdminEditarEsquelaPage({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  const { tab: tabParam } = await searchParams;
  const initialTab =
    tabParam === "flowers" || tabParam === "messages" ? tabParam : undefined;
  const obituary = await getObituaryByIdForTenant(id);
  if (!obituary) notFound();

  const [churches, cemeteries, wakeRooms, siteConfig, funeralHome, messages, flowerOrders] =
    await Promise.all([
      getAllChurches(),
      getAllCemeteries(),
      getAllWakeRooms(),
      getSiteConfig(),
      getFuneralHomeById(getFuneralHomeId()),
      getCommemorativeMessagesByObituaryId(id),
      getFlowerOrdersByObituaryId(id),
    ]);

  const storage = getStorage();
  const imageUrl = obituary.imagePath
    ? mediaPublicUrl(storage, obituary.imagePath, obituary.updatedAt)
    : null;
  const pendingImageUrl = obituary.customImagePath
    ? mediaPublicUrl(storage, obituary.customImagePath, obituary.updatedAt)
    : null;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Editar esquela — {obituary.name}</h1>
        <Link
          href="/admin/esquelas"
          className="text-sm text-zinc-500 hover:text-zinc-800"
        >
          ← Tornar al llistat
        </Link>
      </div>

      <EsquelaAdminTabs
        initialTab={initialTab}
        messageCount={messages.length}
        unreviewedMessageCount={messages.filter((m) => !m.reviewed).length}
        flowerOrderCount={flowerOrders.length}
        esquelaPanel={
          <EsquelaAdminForm
            obituary={obituary}
            imageUrl={imageUrl}
            pendingImageUrl={pendingImageUrl}
            familyImageStatus={obituary.familyImageStatus}
            churches={churches}
            cemeteries={cemeteries}
            wakeRooms={wakeRooms}
            siteConfig={
              siteConfig
                ? {
                    brandName: siteConfig.brandName,
                    mortuaryDefault: siteConfig.mortuaryDefault,
                    contact: siteConfig.contact,
                    theme: siteConfig.theme,
                  }
                : null
            }
            funeralHomeName={funeralHome?.name ?? "Funerària"}
          />
        }
        messagesPanel={<EsquelaMessagesPanel messages={messages} />}
        flowersPanel={<EsquelaFlowerOrdersPanel orders={flowerOrders} />}
      />
    </div>
  );
}
