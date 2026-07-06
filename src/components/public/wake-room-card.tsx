import { getTranslations } from "next-intl/server";
import type { WakeRoom } from "@/lib/db/schema";
import { getStorage } from "@/lib/storage";

type Props = { room: WakeRoom };

export async function WakeRoomCard({ room }: Props) {
  const t = await getTranslations("wakeRooms");
  const tCommon = await getTranslations("common");

  const imageUrl = room.imagePath
    ? getStorage().getPublicUrl(room.imagePath)
    : null;

  return (
    <article className="group overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition hover:shadow-md">
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={room.name}
          className="aspect-[4/3] w-full object-cover transition group-hover:scale-[1.02]"
        />
      ) : (
        <div className="flex aspect-[4/3] items-center justify-center bg-zinc-100 text-sm text-zinc-400">
          {tCommon("noPhoto")}
        </div>
      )}
      <div className="p-5">
        <h2 className="font-serif text-lg font-semibold text-zinc-900">
          {room.name}
        </h2>
        {room.description && (
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-zinc-600">
            {room.description}
          </p>
        )}
        {room.address && (
          <p className="mt-3 text-sm text-zinc-500">{room.address}</p>
        )}
        {room.googleMapsUrl && (
          <a
            href={room.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm font-medium transition hover:underline"
            style={{ color: "var(--brand-primary)" }}
          >
            {t("mapsLink")}
          </a>
        )}
      </div>
    </article>
  );
}
