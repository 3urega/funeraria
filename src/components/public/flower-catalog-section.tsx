import { getActiveFlowerProducts } from "@/lib/db/queries";
import { getStorage } from "@/lib/storage";
import { FlowerCatalog } from "@/components/public/flower-catalog";

type Props = {
  obituaryId: string;
};

export async function FlowerCatalogSection({ obituaryId }: Props) {
  const products = await getActiveFlowerProducts();
  if (products.length === 0) return null;

  const storage = getStorage();
  const catalogProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    priceCents: product.priceCents,
    currency: product.currency,
    imageUrl: product.imagePath
      ? storage.getPublicUrl(product.imagePath)
      : null,
  }));

  return (
    <FlowerCatalog obituaryId={obituaryId} products={catalogProducts} />
  );
}
