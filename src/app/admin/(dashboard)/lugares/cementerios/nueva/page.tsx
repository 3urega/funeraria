import { CemeteryForm } from "@/components/admin/cemetery-form";

export const metadata = { title: "Admin — Nou cementiri" };

export default function NewCemeteryPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Nou cementiri</h1>
      <CemeteryForm />
    </div>
  );
}
