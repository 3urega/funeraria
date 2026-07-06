import { getTranslations } from "next-intl/server";
import { FamilyAccessForm } from "@/components/family/access-form";

export async function generateMetadata() {
  const t = await getTranslations("family");
  return { title: t("accessTitle") };
}

export default async function AccesoPage() {
  const t = await getTranslations("family");

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="mb-2 text-center text-2xl font-bold">{t("accessTitle")}</h1>
      <p className="mb-8 text-center text-zinc-600">{t("accessIntro")}</p>
      <FamilyAccessForm />
    </div>
  );
}
