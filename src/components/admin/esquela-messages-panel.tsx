"use client";

import { useMemo, useState } from "react";
import type { CommemorativeMessage } from "@/lib/db/schema";

type Props = {
  messages: CommemorativeMessage[];
};

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("ca-ES", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function EsquelaMessagesPanel({ messages: initialMessages }: Props) {
  const [messages, setMessages] = useState(initialMessages);
  const [showOnlyPending, setShowOnlyPending] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  const visibleMessages = useMemo(
    () =>
      showOnlyPending
        ? messages.filter((msg) => !msg.reviewed)
        : messages,
    [messages, showOnlyPending],
  );

  const unreviewedCount = messages.filter((msg) => !msg.reviewed).length;

  async function toggleReviewed(msg: CommemorativeMessage) {
    const nextReviewed = !msg.reviewed;
    setSavingId(msg.id);
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msg.id ? { ...m, reviewed: nextReviewed } : m,
      ),
    );

    const res = await fetch(`/api/admin/commemorative-messages/${msg.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewed: nextReviewed }),
    });

    if (!res.ok) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msg.id ? { ...m, reviewed: msg.reviewed } : m,
        ),
      );
    }
    setSavingId(null);
  }

  if (messages.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-6 py-12 text-center text-sm text-zinc-500">
        Cap missatge rebut encara.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-600">
          {unreviewedCount > 0 ? (
            <span className="font-medium text-amber-800">
              {unreviewedCount} pendent{unreviewedCount === 1 ? "" : "s"} de
              revisar
            </span>
          ) : (
            <span className="text-zinc-500">Tots els missatges revisats</span>
          )}
        </p>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            checked={showOnlyPending}
            onChange={(e) => setShowOnlyPending(e.target.checked)}
            className="rounded border-zinc-300"
          />
          Només pendents
        </label>
      </div>

      {visibleMessages.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-6 py-8 text-center text-sm text-zinc-500">
          No hi ha missatges pendents de revisar.
        </p>
      ) : (
        visibleMessages.map((msg) => (
          <article
            key={msg.id}
            className={`rounded-lg border bg-white p-5 shadow-sm ${
              msg.reviewed
                ? "border-zinc-200"
                : "border-amber-300 bg-amber-50/30"
            }`}
          >
            <div className="mb-3 flex flex-wrap items-start justify-between gap-3 border-b border-zinc-100 pb-3">
              <div>
                <h3 className="font-semibold text-zinc-900">{msg.senderName}</h3>
                <time className="text-xs text-zinc-500" dateTime={msg.createdAt}>
                  {formatDate(msg.createdAt)}
                </time>
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
                <input
                  type="checkbox"
                  checked={msg.reviewed}
                  disabled={savingId === msg.id}
                  onChange={() => toggleReviewed(msg)}
                  className="rounded border-zinc-300"
                />
                Revisat
              </label>
            </div>
            <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-700">
              {msg.messageText}
            </p>
          </article>
        ))
      )}
    </div>
  );
}
