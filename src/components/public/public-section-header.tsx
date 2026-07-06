type Props = {
  eyebrow: string;
  heading: string;
  intro?: string;
};

export function PublicSectionHeader({ eyebrow, heading, intro }: Props) {
  return (
    <div className="text-center">
      <p
        className="text-xs font-semibold uppercase tracking-[0.2em]"
        style={{ color: "var(--brand-primary)" }}
      >
        {eyebrow}
      </p>
      <h1 className="mt-3 font-serif text-3xl text-zinc-900 sm:text-4xl">
        {heading}
      </h1>
      {intro && (
        <p className="mx-auto mt-4 max-w-2xl text-zinc-600">{intro}</p>
      )}
    </div>
  );
}
