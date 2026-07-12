"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type { PoemTemplate } from "@/lib/db/schema";

type Props = {
  poem?: PoemTemplate;
};

export function PoemTemplateForm({ poem }: Props) {
  const router = useRouter();
  const isEdit = Boolean(poem);

  const [title, setTitle] = useState(poem?.title ?? "");
  const [text, setText] = useState(poem?.text ?? "");
  const [isActive, setIsActive] = useState(poem?.isActive ?? true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = { title, text, isActive };

    if (isEdit && poem) {
      const res = await fetch(`/api/admin/poem-templates/${poem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        setError("Error en guardar el poema.");
        setLoading(false);
        return;
      }
      router.push("/admin/poemas");
      router.refresh();
      return;
    }

    const res = await fetch("/api/admin/poem-templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      setError("Error en crear el poema.");
      setLoading(false);
      return;
    }

    const data = (await res.json()) as { id: string };
    router.push(`/admin/poemas/${data.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-6">
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium">
          Títol
        </label>
        <input
          id="title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="text" className="mb-1 block text-sm font-medium">
          Text del poema
        </label>
        <textarea
          id="text"
          required
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full rounded-md border px-3 py-2 font-serif leading-relaxed"
        />
        <p className="mt-1 text-xs text-zinc-500">
          Una línia per vers; es mostrarà amb salts de línia a l&apos;obituari.
        </p>
      </div>

      {text.trim() && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
            Vista prèvia
          </p>
          <p className="font-serif text-zinc-800 whitespace-pre-line">{text}</p>
        </div>
      )}

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        Actiu (visible per als familiars)
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {loading ? "Guardant…" : isEdit ? "Desar canvis" : "Crear poema"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/poemas")}
          className="rounded-md border px-4 py-2 text-sm hover:bg-zinc-50"
        >
          Cancel·lar
        </button>
      </div>
    </form>
  );
}
