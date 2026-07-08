"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type { FlowerProduct } from "@/lib/db/schema";

type Props = {
  product?: FlowerProduct;
  imageUrl?: string | null;
};

function centsToEuroInput(cents: number): string {
  return (cents / 100).toFixed(2);
}

function euroInputToCents(value: string): number {
  const parsed = Number.parseFloat(value.replace(",", "."));
  if (Number.isNaN(parsed) || parsed <= 0) return 0;
  return Math.round(parsed * 100);
}

export function FlowerProductForm({ product, imageUrl }: Props) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [priceEuro, setPriceEuro] = useState(
    product ? centsToEuroInput(product.priceCents) : "",
  );
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [sortOrder, setSortOrder] = useState(
    product?.sortOrder?.toString() ?? "0",
  );
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const priceCents = euroInputToCents(priceEuro);
    if (priceCents <= 0) {
      setError("Indica un preu vàlid.");
      setLoading(false);
      return;
    }

    const payload = {
      name,
      description: description.trim() || null,
      priceCents,
      currency: "EUR",
      isActive,
      sortOrder: Number.parseInt(sortOrder, 10) || 0,
    };

    let productId = product?.id;

    if (isEdit && productId) {
      const res = await fetch(`/api/admin/flower-products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        setError("Error en guardar el producte.");
        setLoading(false);
        return;
      }
    } else {
      const res = await fetch("/api/admin/flower-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        setError("Error en crear el producte.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      productId = data.id as string;
    }

    if (file && productId) {
      const formData = new FormData();
      formData.set("image", file);
      const photoRes = await fetch(
        `/api/admin/flower-products/${productId}/photo`,
        { method: "POST", body: formData },
      );
      if (!photoRes.ok) {
        setError("Producte guardat, però error en pujar la foto.");
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    router.push("/admin/flores");
    router.refresh();
  }

  const displayImage = preview ?? imageUrl;

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Nom *
        </label>
        <input
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border border-zinc-300 px-3 py-2"
          placeholder="Ex. Corona clàssica"
        />
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium">
          Descripció
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[80px] w-full rounded-md border border-zinc-300 px-3 py-2"
          maxLength={2000}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="price" className="mb-1 block text-sm font-medium">
            Preu (€) *
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            min="0.01"
            required
            value={priceEuro}
            onChange={(e) => setPriceEuro(e.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2"
            placeholder="85.00"
          />
        </div>
        <div>
          <label htmlFor="sortOrder" className="mb-1 block text-sm font-medium">
            Ordre
          </label>
          <input
            id="sortOrder"
            type="number"
            min="0"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        Actiu (visible a la web)
      </label>

      <div>
        <label htmlFor="photo" className="mb-1 block text-sm font-medium">
          Foto
        </label>
        {displayImage && (
          <div className="mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayImage}
              alt={name || "Producte"}
              className="max-h-48 rounded-lg border object-cover"
            />
          </div>
        )}
        <input
          id="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => {
            const selected = e.target.files?.[0] ?? null;
            setFile(selected);
            if (preview) URL.revokeObjectURL(preview);
            setPreview(selected ? URL.createObjectURL(selected) : null);
          }}
          className="block w-full text-sm"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {loading ? "Guardant…" : isEdit ? "Desar canvis" : "Crear producte"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border px-4 py-2 text-sm"
        >
          Cancel·lar
        </button>
      </div>
    </form>
  );
}
