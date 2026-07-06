import { HomeIcon } from "./home-icons";

type Props = {
  eyebrow: string;
  heading: string;
  imageUrl: string;
  features: { icon: string; title: string; text: string }[];
};

export function HomeWhyUs({ eyebrow, heading, imageUrl, features }: Props) {
  return (
    <section className="grid lg:grid-cols-2">
      <div className="relative min-h-[320px] lg:min-h-[480px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <div
        className="flex flex-col justify-center px-6 py-14 text-white lg:px-12 lg:py-20"
        style={{ backgroundColor: "var(--brand-dark)" }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-[0.2em]"
          style={{ color: "var(--brand-primary)" }}
        >
          {eyebrow}
        </p>
        <h2 className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">
          {heading}
        </h2>

        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {features.map((f) => (
            <div key={f.title} className="flex gap-4">
              <HomeIcon
                name={f.icon}
                className="h-8 w-8 shrink-0 text-[var(--brand-primary)]"
              />
              <div>
                <h3 className="font-medium">{f.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-white/70">
                  {f.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
