import { PoemTemplateForm } from "@/components/admin/poem-template-form";

export const metadata = { title: "Admin — Nou poema" };

export default function NewPoemTemplatePage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Nou poema</h1>
      <PoemTemplateForm />
    </div>
  );
}
