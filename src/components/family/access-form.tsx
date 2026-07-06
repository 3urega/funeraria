"use client";

import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";
import { useRouter } from "@/i18n/navigation";

export function FamilyAccessForm() {
  const t = useTranslations("family");
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/family/access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.message ?? t("accessError"));
      setLoading(false);
      return;
    }

    router.push("/mi-esquela");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-sm space-y-4">
      <div>
        <label htmlFor="code" className="mb-1 block text-sm font-medium">
          {t("codeLabel")}
        </label>
        <input
          id="code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full rounded-md border border-zinc-300 px-3 py-2"
          placeholder="DEMO1234"
          required
          autoComplete="off"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md py-2 text-white hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: "var(--brand-primary, #7B2427)" }}
      >
        {loading ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
