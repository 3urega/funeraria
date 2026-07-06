"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

type Props = {
  obituaryId: string;
};

export function CommemorativeMessageForm({ obituaryId }: Props) {
  const t = useTranslations("commemorative");
  const [senderName, setSenderName] = useState("");
  const [messageText, setMessageText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/public/commemorative", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ obituaryId, senderName, messageText }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(
        data.error === "NOT_FOUND"
          ? t("errorNotFound")
          : (data.message ?? t("errorGeneric")),
      );
      setLoading(false);
      return;
    }

    setSuccess(true);
    setSenderName("");
    setMessageText("");
    setLoading(false);
  }

  if (success) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <p className="font-medium text-green-900">{t("success")}</p>
        <p className="mt-2 text-sm text-green-800">{t("privacyNote")}</p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-4 text-sm font-medium underline"
          style={{ color: "var(--brand-primary)" }}
        >
          {t("sendAnother")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-lg space-y-4">
      <p className="text-center text-sm text-zinc-600">{t("intro")}</p>
      <p className="text-center text-xs text-zinc-500">{t("privacyNote")}</p>

      <div>
        <label htmlFor="senderName" className="mb-1 block text-sm font-medium">
          {t("senderNameLabel")}
        </label>
        <input
          id="senderName"
          type="text"
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
          className="w-full rounded-md border border-zinc-300 px-3 py-2"
          required
          maxLength={200}
        />
      </div>

      <div>
        <label htmlFor="messageText" className="mb-1 block text-sm font-medium">
          {t("messageLabel")}
        </label>
        <textarea
          id="messageText"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          className="min-h-[120px] w-full rounded-md border border-zinc-300 px-3 py-2"
          required
          maxLength={4000}
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
