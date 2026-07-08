import { FlowerProductForm } from "@/components/admin/flower-product-form";

export const metadata = { title: "Admin — Nou producte de flors" };

export default function NewFlowerProductPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Nou producte de flors</h1>
      <FlowerProductForm />
    </div>
  );
}
