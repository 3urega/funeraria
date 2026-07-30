"use client";

import { useId, useState } from "react";

export type ImagePickerVariant = "logo" | "banner" | "photo";

export type ImagePickerProps = {
  id?: string;
  label?: string;
  hint?: string;
  accept?: string;
  previewUrl: string | null;
  previewAlt: string;
  pendingFileName?: string | null;
  pendingHint?: string;
  showPendingHint?: boolean;
  showDragHint?: boolean;
  variant?: ImagePickerVariant;
  onFileSelect: (file: File) => void;
};

const PREVIEW_BOX: Record<ImagePickerVariant, string> = {
  logo: "h-20 w-full max-w-[200px] sm:h-16 sm:w-44",
  banner: "aspect-[16/9] w-full max-w-md",
  photo: "h-48 w-full max-w-xs",
};

const PREVIEW_IMG: Record<ImagePickerVariant, string> = {
  logo: "max-h-14 w-auto max-w-full object-contain p-2",
  banner: "h-full w-full object-cover",
  photo: "h-full w-full object-cover",
};

export function ImagePicker({
  id,
  label,
  hint,
  accept = "image/jpeg,image/png,image/webp",
  previewUrl,
  previewAlt,
  pendingFileName,
  pendingHint = "es pujarà en desar",
  showPendingHint = true,
  showDragHint = true,
  variant = "banner",
  onFileSelect,
}: ImagePickerProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [dragOver, setDragOver] = useState(false);
  const isLogo = variant === "logo";

  function pickFile(file: File | undefined) {
    if (!file) return;
    onFileSelect(file);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    pickFile(e.dataTransfer.files?.[0]);
  }

  return (
    <div>
      {label ? (
        <p className="mb-2 text-sm font-medium text-zinc-800">{label}</p>
      ) : null}
      <div
        className={[
          "relative overflow-hidden rounded-lg border-2 border-dashed transition-colors",
          dragOver
            ? "border-zinc-500 bg-zinc-50"
            : "border-zinc-200 bg-zinc-50/50 hover:border-zinc-300",
          isLogo ? "p-4" : "p-4 sm:p-5",
        ].join(" ")}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setDragOver(false);
          }
        }}
        onDrop={onDrop}
      >
        <div
          className={[
            "flex gap-4",
            isLogo ? "flex-col sm:flex-row sm:items-center" : "flex-col",
          ].join(" ")}
        >
          <div
            className={[
              "flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-zinc-200 bg-white",
              PREVIEW_BOX[variant],
            ].join(" ")}
          >
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt={previewAlt}
                className={PREVIEW_IMG[variant]}
              />
            ) : (
              <div className="flex flex-col items-center gap-1 px-4 py-6 text-zinc-400">
                <ImageIcon className="h-8 w-8" />
                <span className="text-xs">Sense imatge</span>
              </div>
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
            <label
              htmlFor={inputId}
              className="inline-flex w-fit cursor-pointer items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            >
              {previewUrl ? "Canviar imatge" : "Escollir imatge"}
            </label>

            {pendingFileName && showPendingHint && (
              <p className="truncate text-sm text-zinc-600">
                <span className="font-medium">{pendingFileName}</span>
                <span className="text-zinc-500"> — {pendingHint}</span>
              </p>
            )}

            {hint && (
              <p className="text-xs leading-relaxed text-zinc-500">{hint}</p>
            )}

            {showDragHint && (
              <p className="text-xs text-zinc-400">
                També pots arrossegar un fitxer aquí
              </p>
            )}
          </div>
        </div>

        <input
          id={inputId}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => pickFile(e.target.files?.[0])}
        />
      </div>
    </div>
  );
}

function ImageIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8.5" cy="10" r="1.5" fill="currentColor" stroke="none" />
      <path
        d="M3 16l5-5 4 4 3-3 6 6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
