import Link from "next/link";
import { HomeIcon } from "./home-icons";

type Block = {
  variant: "muted" | "dark";
  icon: string;
  title: string;
  text: string;
  linkLabel?: string;
  linkHref?: string;
  showPhone?: boolean;
};

type Props = {
  blocks: Block[];
  mutedTextureUrl: string;
  phone: string;
};

export function HomeCtaBlocks({ blocks, mutedTextureUrl, phone }: Props) {
  return (
    <section className="bg-zinc-50 py-16">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 lg:grid-cols-3">
        {blocks.map((block, i) => {
          if (block.variant === "dark") {
            return (
              <div
                key={i}
                className="flex flex-col justify-center rounded-lg px-8 py-10 text-white lg:col-span-1"
                style={{ backgroundColor: "var(--brand-dark)" }}
              >
                <HomeIcon
                  name={block.icon}
                  className="mb-4 h-8 w-8 text-[var(--brand-primary)]"
                />
                <h3 className="font-serif text-xl">{block.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
                  {block.text}
                </p>
                {block.showPhone && (
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="mt-6 font-serif text-3xl font-semibold tracking-wide hover:opacity-90"
                    style={{ color: "var(--brand-primary)" }}
                  >
                    {phone}
                  </a>
                )}
              </div>
            );
          }

          return (
            <div
              key={i}
              className="bg-marble flex flex-col rounded-lg px-8 py-10"
              style={{ backgroundImage: `url(${mutedTextureUrl})` }}
            >
              <HomeIcon
                name={block.icon}
                className="mb-4 h-8 w-8 text-[var(--brand-primary)]"
              />
              <h3 className="font-serif text-xl text-zinc-900">{block.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600">
                {block.text}
              </p>
              {block.linkLabel && block.linkHref && (
                <Link
                  href={block.linkHref}
                  className="mt-4 text-sm font-medium hover:underline"
                  style={{ color: "var(--brand-primary)" }}
                >
                  {block.linkLabel}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
