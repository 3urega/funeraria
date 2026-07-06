import { getTranslations } from "next-intl/server";
import { CommemorativeMessageForm } from "@/components/public/commemorative-message-form";
import { PublicSectionHeader } from "@/components/public/public-section-header";

type Props = {
  obituaryId: string;
};

export async function CommemorativeMessageSection({ obituaryId }: Props) {
  const t = await getTranslations("commemorative");

  return (
    <section className="mt-10">
      <PublicSectionHeader eyebrow={t("eyebrow")} heading={t("heading")} />
      <div className="mt-8">
        <CommemorativeMessageForm obituaryId={obituaryId} />
      </div>
    </section>
  );
}
