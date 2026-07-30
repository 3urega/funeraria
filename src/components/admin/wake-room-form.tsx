"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type { WakeRoom } from "@/lib/db/schema";
import { ImagePicker } from "@/components/ui/image-picker";
import { PlaceAddressField } from "./place-address-field";
import {
  emptyPlaceLocation,
  placeLocationFromRecord,
  type PlaceLocationInput,
} from "@/lib/geo/types";

type Props = {
  room?: WakeRoom;
  imageUrl?: string | null;
};

export function WakeRoomForm({ room, imageUrl }: Props) {
  const router = useRouter();
  const isEdit = Boolean(room);

  const [name, setName] = useState(room?.name ?? "");
  const [description, setDescription] = useState(room?.description ?? "");
  const [location, setLocation] = useState<PlaceLocationInput>(
    room ? placeLocationFromRecord(room) : emptyPlaceLocation(),
  );
  const [isActive, setIsActive] = useState(room?.isActive ?? true);
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
      description,
      ...location,
      isActive,
    };

    let roomId = room?.id;

    if (isEdit && roomId) {
      const res = await fetch(`/api/admin/wake-rooms/${roomId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        setError("Error en guardar la sala.");
        setLoading(false);
        return;
      }
    } else {
      const res = await fetch("/api/admin/wake-rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        setError("Error en crear la sala.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      roomId = data.id as string;
    }

    if (file && roomId) {
      const formData = new FormData();
      formData.set("image", file);
      const photoRes = await fetch(`/api/admin/wake-rooms/${roomId}/photo`, {
        method: "POST",
        body: formData,
      });
      if (!photoRes.ok) {
        setError("Sala guardada, però error en pujar la foto.");
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    router.push("/admin/lugares/salas-vetlla");
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
          placeholder="Ex. Funerària Pujols — Sala principal"
        />
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium">
          Text descriptiu
        </label>
        <textarea
          id="description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border border-zinc-300 px-3 py-2"
          placeholder="Descripció de la sala per a la web pública…"
        />
      </div>

      <PlaceAddressField value={location} onChange={setLocation} />

      <ImagePicker
        id="wake-room-photo"
        label="Foto"
        variant="photo"
        previewUrl={displayImage ?? null}
        previewAlt={name || "Sala"}
        pendingFileName={file?.name}
        hint="JPEG, PNG o WebP. Màxim 5 MB."
        onFileSelect={(selected) => {
          setFile(selected);
          if (preview) URL.revokeObjectURL(preview);
          setPreview(URL.createObjectURL(selected));
        }}
      />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        Activa (visible a la web pública i assignable a esquelas)
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {loading ? "Guardant…" : isEdit ? "Desar canvis" : "Crear sala"}
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
