type IconProps = { className?: string };

export function HomeIcon({
  name,
  className = "h-8 w-8",
}: {
  name: string;
  className?: string;
}) {
  const props: IconProps = {
    className: `${className} text-[var(--brand-primary)]`,
  };

  switch (name) {
    case "flower":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
          <path d="M12 3c1.5 2 1.5 4.5 0 6.5M12 3c-1.5 2-1.5 4.5 0 6.5M12 9.5V21M7 12c2-1.5 4.5-1.5 6.5 0M7 12c-1.5 2-1.5 4.5 0 6.5M17 12c2 1.5 4.5 1.5 6.5 0M17 12c1.5-2 1.5-4.5 0-6.5" />
        </svg>
      );
    case "urn":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
          <path d="M8 4h8v3a4 4 0 01-8 0V4zM6 20h12v-2H6v2zM9 11h6v7H9v-7z" />
        </svg>
      );
    case "transfer":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
          <path d="M3 13h12l-3 3M18 6H6l3-3M21 3v6M3 21v-6" />
        </svg>
      );
    case "building":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
          <path d="M4 20V8l8-4 8 4v12M9 20v-6h6v6M12 8v4" />
        </svg>
      );
    case "florist":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
          <path d="M12 22V12M12 12C9 12 7 10 7 7s2-5 5-5 5 2 5 5-2 5-5 5zM5 22h14" />
        </svg>
      );
    case "document":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
          <path d="M8 4h8l4 4v12H8V4zM12 4v4h4M10 13h6M10 17h4" />
        </svg>
      );
    case "ceremony":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
          <path d="M12 21s-6-4.5-6-10a6 6 0 1112 0c0 5.5-6 10-6 10z" />
        </svg>
      );
    case "clock":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "people":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
          <path d="M16 11a3 3 0 10-6 0M4 20v-1a4 4 0 014-4h8a4 4 0 014 4v1M20 8a2 2 0 11-4 0" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
          <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3zM9 12l2 2 4-4" />
        </svg>
      );
    case "ribbon":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
          <circle cx="12" cy="9" r="5" />
          <path d="M8 20l4-3 4 3M8 14h8" />
        </svg>
      );
    case "leaf":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
          <path d="M6 20c6-1 10-5 12-12C12 6 8 10 6 20z" />
        </svg>
      );
    case "heart-hands":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
          <path d="M12 21s-6-3.5-6-8a4 4 0 017-2 4 4 0 017 2c0 4.5-6 8-6 8zM8 14h8" />
        </svg>
      );
    case "phone":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
          <path d="M6 4h4l2 5-3 2a11 11 0 005 5l2-3 5 2v4a2 2 0 01-2 2C9 21 3 15 3 7a2 2 0 012-3z" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}

export function PhoneIcon({ className = "h-4 w-4" }: { className?: string }) {
  return <HomeIcon name="phone" className={className} />;
}
