"use client";

type LocalizedValue = { ca: string; es: string };

type Props = {
  label: string;
  value: LocalizedValue;
  onChange: (value: LocalizedValue) => void;
  multiline?: boolean;
  rows?: number;
};

export function LocalizedField({
  label,
  value,
  onChange,
  multiline = false,
  rows = 3,
}: Props) {
  const Input = multiline ? "textarea" : "input";

  return (
    <fieldset className="rounded-md border border-zinc-200 p-3">
      <legend className="px-1 text-sm font-medium text-zinc-700">{label}</legend>
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-zinc-500">Català</label>
          <Input
            value={value.ca}
            onChange={(e) => onChange({ ...value, ca: e.target.value })}
            rows={multiline ? rows : undefined}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-zinc-500">Castellà</label>
          <Input
            value={value.es}
            onChange={(e) => onChange({ ...value, es: e.target.value })}
            rows={multiline ? rows : undefined}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
      </div>
    </fieldset>
  );
}

export function emptyLocalized(): LocalizedValue {
  return { ca: "", es: "" };
}

export function localizedFromDb(
  value: unknown,
  fallback: { ca?: string; es?: string } = {},
): LocalizedValue {
  if (!value || typeof value !== "object") {
    return { ca: fallback.ca ?? "", es: fallback.es ?? "" };
  }
  const v = value as Record<string, string>;
  return { ca: v.ca ?? fallback.ca ?? "", es: v.es ?? fallback.es ?? "" };
}
