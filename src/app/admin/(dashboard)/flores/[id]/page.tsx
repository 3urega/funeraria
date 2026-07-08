import { notFound } from "next/navigation";
import { FlowerProductForm } from "@/components/admin/flower-product-form";
import { getFlowerProductById } from "@/lib/db/queries";
import { getStorage } from "@/lib/storage";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const product = await getFlowerProductById(id);
  return {
    title: product
      ? `Admin — Editar ${product.name}`
      : "Admin — Editar producte",
  };
}

export default async function EditFlowerProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getFlowerProductById(id);
  if (!product) notFound();

  const imageUrl = product.imagePath
    ? getStorage().getPublicUrl(product.imagePath)
    : null;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Editar producte — {product.name}</h1>
      <FlowerProductForm product={product} imageUrl={imageUrl} />
    </div>
  );
}
