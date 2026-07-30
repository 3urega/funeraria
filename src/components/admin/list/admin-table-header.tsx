import type { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  /** Text explicatiu al passar el cursor per sobre la capçalera. */
  hint?: string;
  className?: string;
};

/**
 * Capçalera de columna amb tooltip natiu (`title`) per aclarir el significat del camp.
 */
export function AdminTableHeader({ children, hint, className }: Props) {
  return (
    <th
      title={hint}
      className={`px-4 py-3 font-medium ${hint ? "cursor-help" : ""} ${className ?? ""}`.trim()}
    >
      {children}
    </th>
  );
}
