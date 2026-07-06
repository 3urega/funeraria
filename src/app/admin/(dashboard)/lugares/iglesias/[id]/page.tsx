import { notFound } from "next/navigation";
import { ChurchForm } from "@/components/admin/church-form";
import { getChurchById } from "@/lib/db/queries";
import { getStorage } from "@/lib/storage";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const church = await getChurchById(id);
  return { title: church ? `Admin — ${church.name}` : "Admin — Església" };
}

export default async function EditChurchPage({ params }: Props) {
  const { id } = await params;
  const church = await getChurchById(id);
  if (!church) notFound();

  const imageUrl = church.imagePath
    ? getStorage().getPublicUrl(church.imagePath)
    : null;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Editar església</h1>
      <ChurchForm church={church} imageUrl={imageUrl} />
    </div>
  );
}
