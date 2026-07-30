import type { ReactNode } from "react";
import { AdminTableHeader } from "@/components/admin/list/admin-table-header";

export type AdminDataTableColumn = {
  key: string;
  label: string;
  className?: string;
  /** Text explicatiu al fer hover sobre la capçalera. */
  hint?: string;
};

type Props = {
  columns: AdminDataTableColumn[];
  children: ReactNode;
  emptyMessage?: string;
  isEmpty?: boolean;
};

/**
 * Contenidor de taula admin amb capçalera i estil consistent.
 * Reutilitzable per esqueles, llocs, flors, etc. (RD-116+).
 */
export function AdminDataTable({
  columns,
  children,
  emptyMessage = "Cap resultats.",
  isEmpty = false,
}: Props) {
  if (isEmpty) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-6 py-12 text-center text-sm text-zinc-500">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-50">
          <tr>
            {columns.map((col) => (
              <AdminTableHeader
                key={col.key}
                hint={col.hint}
                className={col.className}
              >
                {col.label}
              </AdminTableHeader>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
