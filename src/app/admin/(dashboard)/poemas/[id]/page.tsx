import { notFound } from "next/navigation";
import { PoemTemplateForm } from "@/components/admin/poem-template-form";
import { getPoemTemplateById } from "@/lib/db/queries";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const poem = await getPoemTemplateById(id);
  return { title: poem ? `Admin — ${poem.title}` : "Admin — Poema" };
}

export default async function EditPoemTemplatePage({ params }: Props) {
  const { id } = await params;
  const poem = await getPoemTemplateById(id);
  if (!poem) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Editar poema</h1>
      <PoemTemplateForm poem={poem} />
    </div>
  );
}
