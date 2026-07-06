import { notFound } from "next/navigation";
import { getWakeRoomById } from "@/lib/db/queries";
import { getStorage } from "@/lib/storage";
import { WakeRoomForm } from "@/components/admin/wake-room-form";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const room = await getWakeRoomById(id);
  return { title: room ? `Editar — ${room.name}` : "Sala no trobada" };
}

export default async function EditWakeRoomPage({ params }: Props) {
  const { id } = await params;
  const room = await getWakeRoomById(id);
  if (!room) notFound();

  const imageUrl = room.imagePath
    ? getStorage().getPublicUrl(room.imagePath)
    : null;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Editar sala de vetlla</h1>
      <WakeRoomForm room={room} imageUrl={imageUrl} />
    </div>
  );
}
