import { ChurchForm } from "@/components/admin/church-form";

export const metadata = { title: "Admin — Nova església" };

export default function NewChurchPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Nova església</h1>
      <ChurchForm />
    </div>
  );
}
