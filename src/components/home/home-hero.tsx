import Link from "next/link";
import { PhoneIcon } from "./home-icons";

type Props = {
  title: string;
  subtitle: string;
  text: string;
  primaryButton: string;
  secondaryButton: string;
  secondaryButtonHref: string;
  imageUrl: string;
  phone: string;
};

export function HomeHero({
  title,
  subtitle,
  text,
  primaryButton,
  secondaryButton,
  secondaryButtonHref,
  imageUrl,
  phone,
}: Props) {
  return (
    <section className="relative min-h-[520px] overflow-hidden lg:min-h-[600px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />

      <div className="relative mx-auto flex max-w-7xl flex-col justify-center px-4 py-20 lg:min-h-[600px] lg:py-28">
        <div className="max-w-2xl text-white">
          <h1 className="font-serif text-4xl font-medium leading-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-4 text-lg text-white/90 sm:text-xl">{subtitle}</p>
          <p className="mt-4 max-w-xl whitespace-pre-line text-sm leading-relaxed text-white/75 sm:text-base">
            {text}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 rounded px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
              style={{ backgroundColor: "var(--brand-primary)" }}
            >
              <PhoneIcon className="h-4 w-4" />
              {primaryButton}
            </a>
            <Link
              href={secondaryButtonHref}
              className="inline-flex items-center rounded border border-white/80 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              {secondaryButton}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
