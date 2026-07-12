import Link from "next/link";
import { HomeCmsEditor } from "@/components/admin/home-cms/home-cms-editor";
import {
  getAllContentSectionsForAdmin,
  getContentSectionByKey,
} from "@/lib/db/queries";
import { PUJOLS_ASSETS } from "@/lib/home/defaults";

export const metadata = { title: "Admin — Contingut home" };

export default async function AdminHomeCmsPage() {
  const [sections, whyUsSection] = await Promise.all([
    getAllContentSectionsForAdmin(),
    getContentSectionByKey("why_us"),
  ]);

  const whyUsImageUrl =
    (whyUsSection?.contentI18n as { imagePath?: string } | undefined)
      ?.imagePath ?? PUJOLS_ASSETS.whyUsImageUrl;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Contingut de la home</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Edita les seccions de la pàgina d&apos;inici en català i castellà.
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="rounded-md border px-4 py-2 text-sm hover:bg-zinc-50"
        >
          Obrir home →
        </Link>
      </div>
      <HomeCmsEditor sections={sections} whyUsImageUrl={whyUsImageUrl} />
    </div>
  );
}
