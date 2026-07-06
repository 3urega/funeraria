import Link from "next/link";
import { HomeIcon } from "./home-icons";

type Props = {
  id?: string;
  eyebrow: string;
  heading: string;
  items: { icon: string; label: string }[];
  ctaLabel: string;
  ctaHref: string;
  textureUrl: string;
};

export function HomeServicesGrid({
  id = "servicios",
  eyebrow,
  heading,
  items,
  ctaLabel,
  ctaHref,
  textureUrl,
}: Props) {
  return (
    <section
      id={id}
      className="bg-marble py-16 lg:py-20"
      style={{ backgroundImage: `url(${textureUrl})` }}
    >
      <div className="mx-auto max-w-7xl px-4 text-center">
        <p
          className="text-xs font-semibold uppercase tracking-[0.2em]"
          style={{ color: "var(--brand-primary)" }}
        >
          {eyebrow}
        </p>
        <h2 className="mt-3 font-serif text-3xl text-zinc-900 sm:text-4xl">
          {heading}
        </h2>

        <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-7">
          {items.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-3">
              <HomeIcon name={item.icon} className="h-10 w-10" />
              <span className="text-xs leading-snug text-zinc-700 sm:text-sm">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <Link
          href={ctaHref}
          className="mt-12 inline-block rounded border border-zinc-300 bg-white/80 px-8 py-3 text-sm font-medium text-zinc-800 transition hover:border-zinc-400"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
