"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { FormEvent, useState } from "react";
import { ImagePicker } from "@/components/ui/image-picker";
import type { Cemetery, Church, Obituary, PoemTemplate, WakeRoom } from "@/lib/db/schema";
import { EsquelaView } from "./esquela-view";
import type { EsquelaPrintData } from "@/lib/esquela/types";

type EsquelaContext = {
  funeralHomeName: string;
  siteConfig: {
    contact?: EsquelaPrintData["contact"] | null;
    theme?: Record<string, string> | null;
    brandName?: string | null;
    mortuaryDefault?: string | null;
  } | null;
  church: Church | null;
  cemetery: Cemetery | null;
  wakeRoom: WakeRoom | null;
};

type Props = {
  obituary: Obituary;
  poemTemplates: PoemTemplate[];
  poemTemplate: PoemTemplate | null;
  officialImageUrl: string | null;
  pendingImageUrl: string | null;
  familyImageStatus: Obituary["familyImageStatus"];
  esquelaContext: EsquelaContext;
};

export function FamilyZone({
  obituary,
  poemTemplates,
  poemTemplate,
  officialImageUrl,
  pendingImageUrl,
  familyImageStatus,
  esquelaContext,
}: Props) {
  const router = useRouter();

  return (
    <div className="space-y-10">
      <EsquelaView
        obituary={obituary}
        officialImageUrl={officialImageUrl}
        funeralHomeName={esquelaContext.funeralHomeName}
        siteConfig={esquelaContext.siteConfig}
        church={esquelaContext.church}
        cemetery={esquelaContext.cemetery}
        wakeRoom={esquelaContext.wakeRoom}
      />

      <EsquelaPhotoForm
        pendingImageUrl={pendingImageUrl}
        familyImageStatus={familyImageStatus}
        onSaved={() => router.refresh()}
      />

      <ObituarioSection
        poemTemplates={poemTemplates}
        poemTemplate={poemTemplate}
        obituarioPoemTemplateId={obituary.obituarioPoemTemplateId}
        obituarioText={obituary.obituarioText}
        onSaved={() => router.refresh()}
      />
    </div>
  );
}

function EsquelaPhotoForm({
  pendingImageUrl,
  familyImageStatus,
  onSaved,
}: {
  pendingImageUrl: string | null;
  familyImageStatus: Obituary["familyImageStatus"];
  onSaved: () => void;
}) {
  const t = useTranslations("family");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isPending = familyImageStatus === "pending";
  const isRejected = familyImageStatus === "rejected";

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.set("customImage", file);

    const res = await fetch("/api/family/esquela", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      setError(t("photoUploadError"));
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    onSaved();
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg border p-6">
      <h3 className="mb-2 text-lg font-semibold">{t("photoTitle")}</h3>
      <p className="mb-4 text-sm text-zinc-500">{t("photoIntro")}</p>

      {isPending && (
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p className="font-medium">{t("photoPendingTitle")}</p>
          <p className="mt-1 text-amber-800">{t("photoPendingText")}</p>
        </div>
      )}

      {isRejected && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          <p className="font-medium">{t("photoRejectedTitle")}</p>
          <p className="mt-1 text-red-800">{t("photoRejectedText")}</p>
        </div>
      )}

      {isPending && pendingImageUrl && !preview && (
        <div className="mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pendingImageUrl}
            alt={t("photoSentAlt")}
            className="max-h-48 rounded-lg border object-contain"
          />
          <p className="mt-2 text-xs text-zinc-500">{t("photoSentOriginal")}</p>
        </div>
      )}

      <ImagePicker
        id="family-photo"
        variant="photo"
        previewUrl={preview}
        previewAlt={t("photoSentAlt")}
        showPendingHint={false}
        hint="JPEG, PNG o WebP. Màxim 5 MB."
        onFileSelect={(selected) => {
          setFile(selected);
          if (preview) URL.revokeObjectURL(preview);
          setPreview(URL.createObjectURL(selected));
        }}
      />

      {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
      {success && <p className="mb-2 text-sm text-green-700">{t("photoSuccess")}</p>}

      <button
        type="submit"
        disabled={loading || !file}
        className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? t("photoSubmitting") : t("photoSubmit")}
      </button>
    </form>
  );
}

function ObituarioSection({
  poemTemplates,
  poemTemplate,
  obituarioPoemTemplateId,
  obituarioText,
  onSaved,
}: {
  poemTemplates: PoemTemplate[];
  poemTemplate: PoemTemplate | null;
  obituarioPoemTemplateId: string | null;
  obituarioText: string | null;
  onSaved: () => void;
}) {
  const t = useTranslations("family");
  const [templateId, setTemplateId] = useState(obituarioPoemTemplateId ?? "");
  const [text, setText] = useState(obituarioText ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const selectedPoem = poemTemplates.find((p) => p.id === templateId);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.set("obituarioPoemTemplateId", templateId);
    formData.set("obituarioText", text);

    const res = await fetch("/api/family/obituario", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      setError(t("obituarySaveError"));
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    onSaved();
  }

  return (
    <div className="space-y-4">
      <section className="rounded-lg border bg-zinc-50 p-6">
        <h2 className="mb-4 text-xl font-semibold">{t("obituaryTitle")}</h2>
        <p className="mb-4 text-sm text-zinc-500">{t("obituaryIntro")}</p>

        {(poemTemplate || obituarioText) && (
          <div className="mb-4 space-y-3">
            {poemTemplate && (
              <blockquote className="border-l-4 border-blue-400 pl-4 italic text-zinc-700">
                <p className="mb-1 text-sm font-medium not-italic text-zinc-500">
                  {poemTemplate.title}
                </p>
                {poemTemplate.text.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </blockquote>
            )}
            {obituarioText && (
              <p className="whitespace-pre-line text-zinc-700">{obituarioText}</p>
            )}
          </div>
        )}

        {!poemTemplate && !obituarioText && (
          <p className="text-sm text-zinc-500">{t("obituaryEmpty")}</p>
        )}
      </section>

      <form onSubmit={onSubmit} className="rounded-lg border p-6">
        <h3 className="mb-4 text-lg font-semibold">{t("obituaryCustomize")}</h3>

        <div className="mb-4">
          <label htmlFor="poem" className="mb-1 block text-sm font-medium">
            {t("poemLabel")}
          </label>
          <select
            id="poem"
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2"
          >
            <option value="">{t("poemNone")}</option>
            {poemTemplates.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="obituarioText" className="mb-1 block text-sm font-medium">
            {t("customTextLabel")}
          </label>
          <textarea
            id="obituarioText"
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("customTextPlaceholder")}
            className="w-full rounded-md border border-zinc-300 px-3 py-2"
          />
          <p className="mt-1 text-xs text-zinc-500">{t("customTextHint")}</p>
        </div>

        {selectedPoem && (
          <div className="mb-4 rounded bg-blue-50/50 p-3 text-sm italic text-zinc-600">
            {t("poemPreview", { title: selectedPoem.title })}
          </div>
        )}

        {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
        {success && <p className="mb-2 text-sm text-green-700">{t("obituarySaved")}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-zinc-800 px-4 py-2 text-white hover:bg-zinc-700 disabled:opacity-50"
        >
          {loading ? t("obituarySaving") : t("obituarySave")}
        </button>
      </form>
    </div>
  );
}
