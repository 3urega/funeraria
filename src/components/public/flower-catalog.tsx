"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { formatPriceCents } from "@/lib/flowers/types";

export type FlowerCatalogProduct = {
  id: string;
  name: string;
  description: string | null;
  priceCents: number;
  currency: string;
  imageUrl: string | null;
};

type Props = {
  obituaryId: string;
  products: FlowerCatalogProduct[];
};

export function FlowerCatalog({ obituaryId, products }: Props) {
  const t = useTranslations("flowers");
  const [selected, setSelected] = useState<FlowerCatalogProduct | null>(null);
  const [dedicationText, setDedicationText] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!selected) return;

    setLoading(true);
    setError(null);

    const res = await fetch("/api/public/flowers/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        obituaryId,
        productId: selected.id,
        dedicationText,
        buyerName,
        buyerEmail,
        buyerPhone,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(
        data.error === "NOT_FOUND"
          ? t("errorNotFound")
          : data.error === "PRODUCT_NOT_FOUND"
            ? t("errorProduct")
            : (data.message ?? t("errorGeneric")),
      );
      setLoading(false);
      return;
    }

    setSuccess(true);
    setSelected(null);
    setDedicationText("");
    setBuyerName("");
    setBuyerEmail("");
    setBuyerPhone("");
    setLoading(false);
  }

  if (products.length === 0) return null;

  if (success) {
    return (
      <section className="mt-10 rounded-lg border border-green-200 bg-green-50 p-6">
        <h2 className="mb-2 text-xl font-semibold text-green-900">
          {t("successTitle")}
        </h2>
        <p className="text-sm text-green-800">{t("successMessage")}</p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-4 text-sm font-medium underline"
          style={{ color: "var(--brand-primary)" }}
        >
          {t("buyAnother")}
        </button>
      </section>
    );
  }

  return (
    <section className="mt-10">
      <p className="mb-1 text-xs font-semibold tracking-wide text-zinc-500">
        {t("eyebrow")}
      </p>
      <h2 className="mb-2 text-xl font-semibold">{t("heading")}</h2>
      <p className="mb-6 text-sm text-zinc-600">{t("intro")}</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <article
            key={product.id}
            className="overflow-hidden rounded-lg border bg-white shadow-sm"
          >
            {product.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-40 w-full object-cover"
              />
            ) : (
              <div className="flex h-40 items-center justify-center bg-zinc-100 text-sm text-zinc-400">
                {t("noImage")}
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold">{product.name}</h3>
              {product.description && (
                <p className="mt-1 text-sm text-zinc-600">{product.description}</p>
              )}
              <p className="mt-3 font-medium">
                {formatPriceCents(product.priceCents, product.currency)}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelected(product);
                  setError(null);
                }}
                className="mt-3 w-full rounded-md py-2 text-sm text-white hover:opacity-90"
                style={{ backgroundColor: "var(--brand-primary, #7B2427)" }}
              >
                {t("buy")}
              </button>
            </div>
          </article>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">{t("checkoutTitle")}</h3>
                <p className="text-sm text-zinc-600">{selected.name}</p>
                <p className="font-medium">
                  {formatPriceCents(selected.priceCents, selected.currency)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-zinc-500 hover:text-zinc-800"
                aria-label={t("close")}
              >
                ×
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="dedicationText"
                  className="mb-1 block text-sm font-medium"
                >
                  {t("dedicationLabel")} *
                </label>
                <textarea
                  id="dedicationText"
                  value={dedicationText}
                  onChange={(e) => setDedicationText(e.target.value)}
                  className="min-h-[100px] w-full rounded-md border border-zinc-300 px-3 py-2"
                  required
                  maxLength={500}
                  placeholder={t("dedicationPlaceholder")}
                />
              </div>

              <div>
                <label htmlFor="buyerName" className="mb-1 block text-sm font-medium">
                  {t("buyerNameLabel")} *
                </label>
                <input
                  id="buyerName"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2"
                  required
                  maxLength={200}
                />
              </div>

              <div>
                <label htmlFor="buyerEmail" className="mb-1 block text-sm font-medium">
                  {t("buyerEmailLabel")} *
                </label>
                <input
                  id="buyerEmail"
                  type="email"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2"
                  required
                  maxLength={200}
                />
              </div>

              <div>
                <label htmlFor="buyerPhone" className="mb-1 block text-sm font-medium">
                  {t("buyerPhoneLabel")} *
                </label>
                <input
                  id="buyerPhone"
                  type="tel"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2"
                  required
                  maxLength={50}
                />
              </div>

              <p className="text-xs text-zinc-500">{t("paymentStubNote")}</p>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-md py-2 text-white hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: "var(--brand-primary, #7B2427)" }}
                >
                  {loading ? t("submitting") : t("submit")}
                </button>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="rounded-md border px-4 py-2 text-sm"
                >
                  {t("cancel")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
