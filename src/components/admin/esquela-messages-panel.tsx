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

export function EsquelaMessagesPanel({ messages }: Props) {
  if (messages.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-6 py-12 text-center text-sm text-zinc-500">
        Cap missatge rebut encara.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <article
          key={msg.id}
          className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
        >
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2 border-b border-zinc-100 pb-3">
            <h3 className="font-semibold text-zinc-900">{msg.senderName}</h3>
            <time className="text-xs text-zinc-500" dateTime={msg.createdAt}>
              {formatDate(msg.createdAt)}
            </time>
          </div>
          <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-700">
            {msg.messageText}
          </p>
        </article>
      ))}
    </div>
  );
}
