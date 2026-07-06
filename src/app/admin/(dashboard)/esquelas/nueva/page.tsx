import Link from "next/link";
import { EsquelaAdminForm } from "@/components/admin/esquela-admin-form";
import {
  getAllCemeteries,
  getAllChurches,
  getAllWakeRooms,
  getFuneralHomeById,
  getSiteConfig,
} from "@/lib/db/queries";
import { getFuneralHomeId } from "@/lib/site/tenant";

export const metadata = {
  title: "Admin — Nova esquela",
};

export default async function AdminNovaEsquelaPage() {
  const [churches, cemeteries, wakeRooms, siteConfig, funeralHome] =
    await Promise.all([
      getAllChurches(),
      getAllCemeteries(),
      getAllWakeRooms(),
      getSiteConfig(),
      getFuneralHomeById(getFuneralHomeId()),
    ]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Nova esquela</h1>
        <Link
          href="/admin/esquelas"
          className="text-sm text-zinc-500 hover:text-zinc-800"
        >
          ← Tornar al llistat
        </Link>
      </div>

      <EsquelaAdminForm
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
    </div>
  );
}
