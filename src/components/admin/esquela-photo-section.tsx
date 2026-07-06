"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type { Obituary } from "@/lib/db/schema";

type Props = {
  obituaryId: string;
  imageUrl: string | null;
  pendingImageUrl: string | null;
  familyImageStatus: Obituary["familyImageStatus"];
  onImagePublished?: (imageUrl: string) => void;
};

export function EsquelaPhotoSection({
  obituaryId,
  imageUrl,
  pendingImageUrl,
  familyImageStatus,
  onImagePublished,
}: Props) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isPending = familyImageStatus === "pending";
  const isRejected = familyImageStatus === "rejected";
  const displayPublished = preview ?? imageUrl;

  async function onUpload(e: FormEvent) {
    e.preventDefault();
    if (!file) return;

    setUploadLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.set("image", file);

    const res = await fetch(`/api/admin/esquelas/${obituaryId}/photo`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;
      if (data?.error === "INVALID_IMAGE_TYPE") {
        setError("Format no vàlid. Usa JPEG, PNG o WebP.");
      } else if (data?.error === "IMAGE_TOO_LARGE") {
        setError("La imatge supera el límit de 5 MB.");
      } else {
        setError("Error en pujar la foto.");
      }
      setUploadLoading(false);
      return;
    }

    const data = (await res.json()) as { imageUrl?: string };
    if (data.imageUrl) {
      onImagePublished?.(data.imageUrl);
    }

    setSuccess("Foto retocada publicada correctament.");
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setUploadLoading(false);
    router.refresh();
  }

  async function onReject() {
    if (
      !window.confirm(
        "Rebutjar la foto del familiar? Podrà enviar-ne una altra des de la zona familiar.",
      )
    ) {
      return;
    }

    setRejectLoading(true);
    setError(null);
    setSuccess(null);

    const res = await fetch(
      `/api/admin/esquelas/${obituaryId}/photo/reject`,
      { method: "POST" },
    );

    if (!res.ok) {
      setError("No s'ha pogut rebutjar la foto pendent.");
      setRejectLoading(false);
      return;
    }

    setSuccess("Foto del familiar marcada com a no utilitzable.");
    setRejectLoading(false);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {displayPublished && (
        <div>
          <p className="mb-2 text-sm font-medium text-zinc-700">Foto publicada</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayPublished}
            alt="Foto publicada"
            className="max-h-48 rounded-lg border object-cover"
          />
        </div>
      )}

      <form onSubmit={onUpload} className="space-y-3">
        <div>
          <label htmlFor="esquela-photo" className="mb-1 block text-sm font-medium">
            Pujar / escanejar foto retocada
          </label>
          <input
            id="esquela-photo"
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
          <p className="mt-1 text-xs text-zinc-500">
            Escaneig o versió retocada externament. Es publica a l&apos;esquela.
          </p>
        </div>
        <button
          type="submit"
          disabled={!file || uploadLoading}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {uploadLoading ? "Pujant…" : "Pujar foto retocada"}
        </button>
      </form>

      {isPending && pendingImageUrl && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
          <p className="mb-2 text-sm font-medium text-amber-900">
            Foto pendent del familiar
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pendingImageUrl}
            alt="Foto pendent del familiar"
            className="mb-3 max-h-48 rounded border object-cover"
          />
          <p className="mb-3 text-sm text-amber-900">
            Descarrega, retoca externament i puja la versió retocada amunt.
            L&apos;original del familiar no es publica directament.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={pendingImageUrl}
              download
              className="rounded-md border border-amber-300 bg-white px-3 py-1.5 text-sm text-amber-900 hover:bg-amber-100"
            >
              Descarregar per retocar
            </a>
            <button
              type="button"
              onClick={onReject}
              disabled={rejectLoading}
              className="rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              {rejectLoading ? "Rebutjant…" : "Rebutjar foto"}
            </button>
          </div>
        </div>
      )}

      {isRejected && (
        <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          La darrera foto del familiar va ser marcada com a no utilitzable. El
          familiar pot enviar-ne una altra.
        </p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-700">{success}</p>}
    </div>
  );
}
