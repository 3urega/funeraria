import { getTranslations } from "next-intl/server";
import { PublicSectionHeader } from "@/components/public/public-section-header";
import { WakeRoomCard } from "@/components/public/wake-room-card";
import { getActiveWakeRooms } from "@/lib/db/queries";
import { PUJOLS_ASSETS } from "@/lib/home/defaults";

export async function generateMetadata() {
  const t = await getTranslations("wakeRooms");
  return {
    title: t("title"),
    description: t("intro"),
  };
}

export default async function SalesDeVetllaPage() {
  const t = await getTranslations("wakeRooms");
  const tCommon = await getTranslations("common");
  const rooms = await getActiveWakeRooms();

  return (
    <section
      className="py-16 lg:py-20"
      style={{
        backgroundImage: `url(${PUJOLS_ASSETS.textures.services})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mx-auto max-w-7xl px-4">
        <PublicSectionHeader
          eyebrow={t("eyebrow")}
          heading={t("title")}
          intro={t("intro")}
        />

        {rooms.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <WakeRoomCard key={room.id} room={room} />
            ))}
          </div>
        ) : (
          <p className="mt-12 text-center text-zinc-500">
            {tCommon("noWakeRooms")}
          </p>
        )}
      </div>
    </section>
  );
}
