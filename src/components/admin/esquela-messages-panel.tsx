"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { CommemorativeMessage } from "@/lib/db/schema";

const MESSAGES_PAGE_SIZE = 20;

type Props = {
  obituaryId: string;
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

export function EsquelaMessagesPanel({
  obituaryId,
  messages: initialMessages,
}: Props) {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [showOnlyPending, setShowOnlyPending] = useState(false);
  const [visibleCount, setVisibleCount] = useState(MESSAGES_PAGE_SIZE);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [bulkSaving, setBulkSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMessages(initialMessages);
    setVisibleCount(MESSAGES_PAGE_SIZE);
  }, [initialMessages]);

  useEffect(() => {
    setVisibleCount(MESSAGES_PAGE_SIZE);
  }, [showOnlyPending]);

  const filteredMessages = useMemo(
    () =>
      showOnlyPending
        ? messages.filter((msg) => !msg.reviewed)
        : messages,
    [messages, showOnlyPending],
  );

  const paginatedMessages = filteredMessages.slice(0, visibleCount);
  const hasMore = filteredMessages.length > visibleCount;
  const unreviewedCount = messages.filter((msg) => !msg.reviewed).length;

  async function toggleReviewed(msg: CommemorativeMessage) {
    const nextReviewed = !msg.reviewed;
    setSavingId(msg.id);
    setError(null);
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
      setError("No s'ha pogut actualitzar el missatge.");
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msg.id ? { ...m, reviewed: msg.reviewed } : m,
        ),
      );
    }
    setSavingId(null);
  }

  async function markAllReviewed() {
    setBulkSaving(true);
    setError(null);

    const res = await fetch(
      "/api/admin/commemorative-messages/mark-reviewed",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ obituaryId }),
      },
    );

    if (!res.ok) {
      setError("No s'han pogut marcar els missatges com a revisats.");
      setBulkSaving(false);
      return;
    }

    setBulkSaving(false);
    router.refresh();
  }

  if (messages.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-6 py-12 text-center text-sm text-zinc-500">
        Cap missatge rebut encara.
      </p>
    );
  }

  const from = filteredMessages.length === 0 ? 0 : 1;
  const to = Math.min(visibleCount, filteredMessages.length);

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}

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
        <div className="flex flex-wrap items-center gap-3">
          {unreviewedCount > 0 && (
            <button
              type="button"
              disabled={bulkSaving}
              onClick={() => void markAllReviewed()}
              className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
            >
              {bulkSaving ? "Marcant…" : "Marcar tots com a revisats"}
            </button>
          )}
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
      </div>

      {filteredMessages.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-6 py-8 text-center text-sm text-zinc-500">
          No hi ha missatges pendents de revisar.
        </p>
      ) : (
        <>
          {filteredMessages.length > MESSAGES_PAGE_SIZE && (
            <p className="text-xs text-zinc-500">
              Mostrant {from}–{to} de {filteredMessages.length}
            </p>
          )}

          {paginatedMessages.map((msg) => (
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
                  <h3 className="font-semibold text-zinc-900">
                    {msg.senderName}
                  </h3>
                  <time
                    className="text-xs text-zinc-500"
                    dateTime={msg.createdAt}
                  >
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
          ))}

          {hasMore && (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() =>
                  setVisibleCount((n) => n + MESSAGES_PAGE_SIZE)
                }
                className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
              >
                Mostrar més
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
