type Props = {
  availabilityText: string;
  urgencyLabel: string;
  phone: string;
};

export function HomeTopBar({ availabilityText, urgencyLabel, phone }: Props) {
  return (
    <div
      className="text-sm text-white"
      style={{ backgroundColor: "var(--brand-dark)" }}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-2 sm:flex-row">
        <span>{availabilityText}</span>
        <a
          href={`tel:${phone.replace(/\s/g, "")}`}
          className="flex items-center gap-2 font-medium hover:opacity-90"
        >
          <span className="opacity-80">{urgencyLabel}</span>
          <span className="font-semibold">{phone}</span>
        </a>
      </div>
    </div>
  );
}
