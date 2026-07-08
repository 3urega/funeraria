"use client";

import { useState } from "react";

type Tab = "esquela" | "messages" | "flowers";

type Props = {
  messageCount: number;
  flowerOrderCount: number;
  esquelaPanel: React.ReactNode;
  messagesPanel: React.ReactNode;
  flowersPanel: React.ReactNode;
};

export function EsquelaAdminTabs({
  messageCount,
  flowerOrderCount,
  esquelaPanel,
  messagesPanel,
  flowersPanel,
}: Props) {
  const [tab, setTab] = useState<Tab>("esquela");

  const tabClass = (active: boolean) =>
    active
      ? "border-b-2 border-zinc-900 font-semibold text-zinc-900"
      : "border-b-2 border-transparent text-zinc-500 hover:text-zinc-700";

  return (
    <div>
      <nav className="mb-6 flex gap-6 border-b border-zinc-200 text-sm">
        <button
          type="button"
          className={tabClass(tab === "esquela")}
          onClick={() => setTab("esquela")}
        >
          Esquela
        </button>
        <button
          type="button"
          className={tabClass(tab === "messages")}
          onClick={() => setTab("messages")}
        >
          Missatges
          {messageCount > 0 ? (
            <span className="ml-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium">
              {messageCount}
            </span>
          ) : null}
        </button>
        <button
          type="button"
          className={tabClass(tab === "flowers")}
          onClick={() => setTab("flowers")}
        >
          Flors
          {flowerOrderCount > 0 ? (
            <span className="ml-1.5 rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium">
              {flowerOrderCount}
            </span>
          ) : null}
        </button>
      </nav>

      {tab === "esquela"
        ? esquelaPanel
        : tab === "messages"
          ? messagesPanel
          : flowersPanel}
    </div>
  );
}
