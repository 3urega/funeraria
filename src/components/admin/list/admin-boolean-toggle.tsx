"use client";

import { useState } from "react";

type Props = {
  checked: boolean;
  disabled?: boolean;
  /** Etiqueta per a lectors de pantalla. */
  ariaLabel: string;
  onToggle: (next: boolean) => Promise<void>;
};

/**
 * Toggle boolean per a llistes admin (actiu/visible/etc.).
 * Gestiona estat de càrrega local mentre s'executa la mutació.
 */
export function AdminBooleanToggle({
  checked,
  disabled = false,
  ariaLabel,
  onToggle,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleChange() {
    if (disabled || loading) return;
    const next = !checked;
    setLoading(true);
    try {
      await onToggle(next);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled || loading}
      onClick={handleChange}
      className={[
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-zinc-900" : "bg-zinc-200",
      ].join(" ")}
    >
      <span
        className={[
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition",
          checked ? "translate-x-5" : "translate-x-0",
        ].join(" ")}
      />
    </button>
  );
}
