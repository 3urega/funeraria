import { notFound } from "next/navigation";
import { CemeteryForm } from "@/components/admin/cemetery-form";
import { getCemeteryById } from "@/lib/db/queries";
import { getStorage } from "@/lib/storage";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const cemetery = await getCemeteryById(id);
  return { title: cemetery ? `Admin — ${cemetery.name}` : "Admin — Cementiri" };
}

export default async function EditCemeteryPage({ params }: Props) {
  const { id } = await params;
  const cemetery = await getCemeteryById(id);
  if (!cemetery) notFound();

  const imageUrl = cemetery.imagePath
    ? getStorage().getPublicUrl(cemetery.imagePath)
    : null;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Editar cementiri</h1>
      <CemeteryForm cemetery={cemetery} imageUrl={imageUrl} />
    </div>
  );
}
