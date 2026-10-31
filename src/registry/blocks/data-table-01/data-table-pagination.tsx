"use client"
import type { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { numberFormat } from "./config"
import type { DataTableLabels } from "./types"

function DataTablePagination<T>({
  table,
  labels,
  virtual,
  count,
}: {
  table: Table<T>
  labels: DataTableLabels
  virtual: boolean
  count: number
}) {
  "use no memo"
  // Table v8 的对象引用稳定，子组件同样需要读取当前状态。
  const { pageIndex, pageSize } = table.getState().pagination
  const pages = Math.max(1, table.getPageCount())
  return (
    <div
      data-slot="data-table-pagination"
      className="flex flex-wrap items-center justify-between gap-3 border-t border-edge p-4 text-sm tabular-nums"
    >
      <span>
        {labels.total} {numberFormat.format(count)} {virtual ? "行" : "条"}
      </span>
      {!virtual && (
        <>
          <label className="hidden items-center gap-2 @3xl:flex">
            {labels.perPage}
            <select
              className="h-8 rounded-md border border-edge bg-background px-2 pointer-coarse:h-10"
              value={pageSize}
              onChange={(event) =>
                table.setPageSize(Number(event.target.value))
              }
            >
              {[10, 20, 50, 100].map((size) => (
                <option key={size}>{size}</option>
              ))}
            </select>
          </label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              {labels.previous}
            </Button>
            <span className="@3xl:hidden">
              {pageIndex + 1} / {pages}
            </span>
            <div className="hidden items-center gap-1 @3xl:flex">
              {Array.from(
                new Set(
                  [
                    0,
                    pageIndex - 1,
                    pageIndex,
                    pageIndex + 1,
                    pages - 1,
                  ].filter((n) => n >= 0 && n < pages),
                ),
              )
                .sort((a, b) => a - b)
                .map((n, i, all) => (
                  <span key={n} className="contents">
                    {i > 0 && n - all[i - 1] > 1 && <span>…</span>}
                    <Button
                      aria-label={String(n + 1)}
                      aria-current={pageIndex === n ? "page" : undefined}
                      variant={pageIndex === n ? "secondary" : "ghost"}
                      onClick={() => table.setPageIndex(n)}
                    >
                      {n + 1}
                    </Button>
                  </span>
                ))}
            </div>
            <Button
              variant="outline"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            >
              {labels.next}
            </Button>
            <label className="hidden items-center gap-2 @3xl:flex">
              {labels.jump}
              <Input
                aria-label={labels.jump}
                type="number"
                min={1}
                max={pages}
                className="w-14"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    const n = Number(event.currentTarget.value)
                    if (Number.isInteger(n) && n >= 1 && n <= pages)
                      table.setPageIndex(n - 1)
                  }
                }}
              />
              {labels.page}
            </label>
          </div>
        </>
      )}
    </div>
  )
}
export { DataTablePagination }
