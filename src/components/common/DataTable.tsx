"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

export function DataTable<T extends object>({
  columns,
  data,
  getRowId,
}: {
  columns: Array<ColumnDef<T>>;
  data: T[];
  getRowId?: (originalRow: T, index: number) => string;
}) {
  const [pageSize, setPageSize] = React.useState(10);
  const [pageIndex, setPageIndex] = React.useState(0);

  const table = useReactTable({
    data,
    columns,
    getRowId,
    state: { pagination: { pageIndex, pageSize } },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(next.pageIndex);
      setPageSize(next.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const canPrev = table.getCanPreviousPage();
  const canNext = table.getCanNextPage();

  return (
    <div className="space-y-3">
      <div className="hidden md:block rounded-lg border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-background/50">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-left px-3 py-2 font-medium opacity-80"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {!table.getRowModel().rows.length ? (
              <tr>
                <td colSpan={columns.length} className="px-3 py-6 opacity-70">
                  Sem dados
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-2">
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <div key={row.id} className="rounded-lg border bg-card p-3 space-y-2">
              {row.getVisibleCells().map((cell) => (
                <div key={cell.id} className="flex items-start justify-between gap-3">
                  <div className="text-xs font-medium opacity-70 min-w-0">
                    {String(cell.column.columnDef.header ?? "")}
                  </div>
                  <div className="text-sm text-right min-w-0">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="rounded-lg border bg-card px-3 py-6 text-sm opacity-70">Sem dados</div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            className="rounded-md border px-3 py-1 disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!canPrev}
          >
            Anterior
          </button>
          <button
            className="rounded-md border px-3 py-1 disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!canNext}
          >
            Próxima
          </button>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="opacity-70">
            Página <b>{pageIndex + 1}</b>
          </span>
          <select
            className="border rounded-md px-2 py-1"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[10, 20, 50].map((s) => (
              <option key={s} value={s}>
                {s} linhas
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

