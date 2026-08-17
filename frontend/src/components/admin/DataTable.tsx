import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

export interface DataTableColumn<T> {
  header: string;
  accessor: (row: T) => ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  keyFor: (row: T) => string;
  renderMobileCard: (row: T) => ReactNode;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({ columns, data, keyFor, renderMobileCard, onRowClick }: DataTableProps<T>) {
  return (
    <div>
      <div className="hidden overflow-x-auto rounded-md border border-border sm:block">
        <table className="w-full text-left text-small">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {columns.map((col) => (
                <th key={col.header} scope="col" className={cn("px-4 py-3 font-medium text-muted-foreground", col.className)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={keyFor(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn("border-b border-border last:border-b-0", onRowClick && "cursor-pointer transition-colors hover:bg-muted/50")}
              >
                {columns.map((col) => (
                  <td key={col.header} className={cn("px-4 py-3 align-middle text-foreground", col.className)}>
                    {col.accessor(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 sm:hidden">
        {data.map((row) => (
          <div key={keyFor(row)} onClick={onRowClick ? () => onRowClick(row) : undefined} className={onRowClick ? "cursor-pointer" : undefined}>
            {renderMobileCard(row)}
          </div>
        ))}
      </div>
    </div>
  );
}
