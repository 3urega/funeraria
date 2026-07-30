"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type { Cemetery } from "@/lib/db/schema";
import { ImagePicker } from "@/components/ui/image-picker";
import { PlaceAddressField } from "./place-address-field";
import {
  emptyPlaceLocation,
  placeLocationFromRecord,
  type PlaceLocationInput,
} from "@/lib/geo/types";

type Props = {
  cemetery?: Cemetery;
  imageUrl?: string | null;
};

export function CemeteryForm({ cemetery, imageUrl }: Props) {
  const router = useRouter();
  const isEdit = Boolean(cemetery);

  const [name, setName] = useState(cemetery?.name ?? "");
  const [location, setLocation] = useState<PlaceLocationInput>(
    cemetery ? placeLocationFromRecord(cemetery) : emptyPlaceLocation(),
  );
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      name,
      ...location,
    };

    let cemeteryId = cemetery?.id;

    if (isEdit && cemeteryId) {
      const res = await fetch(`/api/admin/cemeteries/${cemeteryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        setError("Error en guardar el cementiri.");
        setLoading(false);
        return;
      }
    } else {
      const res = await fetch("/api/admin/cemeteries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        setError("Error en crear el cementiri.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      cemeteryId = data.id as string;
    }

    if (file && cemeteryId) {
      const formData = new FormData();
      formData.set("image", file);
      const photoRes = await fetch(`/api/admin/cemeteries/${cemeteryId}/photo`, {
        method: "POST",
        body: formData,
      });
      if (!photoRes.ok) {
        setError("Cementiri guardat, però error en pujar la foto.");
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    router.push("/admin/lugares/cementerios");
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
          placeholder="Ex. Cementiri de Gironella"
        />
      </div>

      <PlaceAddressField value={location} onChange={setLocation} showCity />

      <ImagePicker
        id="cemetery-photo"
        label="Foto"
        variant="photo"
        previewUrl={displayImage ?? null}
        previewAlt={name || "Cementiri"}
        pendingFileName={file?.name}
        hint="JPEG, PNG o WebP. Màxim 5 MB."
        onFileSelect={(selected) => {
          setFile(selected);
          if (preview) URL.revokeObjectURL(preview);
          setPreview(URL.createObjectURL(selected));
        }}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {loading ? "Guardant…" : isEdit ? "Desar canvis" : "Crear cementiri"}
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
