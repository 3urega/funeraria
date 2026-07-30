import Link from "next/link";

export type AdminListToolbarItem = {
  label: string;
  href: string;
  active?: boolean;
};

type Props = {
  items: AdminListToolbarItem[];
  /** Etiqueta d'accessibilitat per al grup de filtres. */
  ariaLabel?: string;
};

/**
 * Barra de filtres amb enllaços (tabs). L'estat actiu ve marcat per la pàgina servidor.
 */
export function AdminListToolbar({
  items,
  ariaLabel = "Filtres",
}: Props) {
  return (
    <div
      className="mb-4 flex flex-wrap gap-2"
      role="tablist"
      aria-label={ariaLabel}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          role="tab"
          aria-selected={item.active}
          className={
            item.active
              ? "rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white"
              : "rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50"
          }
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
