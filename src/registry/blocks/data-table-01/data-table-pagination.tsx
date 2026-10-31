"use client"
import type { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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
      className="flex flex-wrap items-center justify-between gap-3 border-t border-edge px-[var(--data-table-gutter,1rem)] py-4 text-sm tabular-nums"
    >
      <span className="font-mono text-xs text-muted-foreground">
        {String(count ? pageIndex * pageSize + 1 : 0).padStart(2, "0")}–
        {String(
          virtual ? count : Math.min(count, (pageIndex + 1) * pageSize),
        ).padStart(2, "0")}{" "}
        / {count}
      </span>
      {!virtual && (
        <>
          <label className="hidden items-center gap-2 @min-[40rem]:flex">
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
            <div className="flex items-center overflow-hidden rounded-md border border-edge [&_button]:rounded-none [&_button]:border-0 [&_button]:border-r [&_button]:border-edge">
              <Button
                aria-label={labels.previous}
                variant="outline"
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.previousPage()}
              >
                <span className="@min-[40rem]:hidden">{labels.previous}</span>
                <span aria-hidden="true" className="hidden @min-[40rem]:inline">
                  ‹
                </span>
              </Button>
              <span className="@min-[40rem]:hidden">
                {pageIndex + 1} / {pages}
              </span>
              <div className="hidden items-center @min-[40rem]:flex">
                {Array.from(
                  new Set(
                    [
                      0,
                      ...Array.from(
                        { length: Math.min(3, pages) },
                        (_, offset) =>
                          Math.max(0, Math.min(pageIndex - 1, pages - 3)) +
                          offset,
                      ),
                      pages - 1,
                    ].filter((n) => n >= 0 && n < pages),
                  ),
                )
                  .sort((a, b) => a - b)
                  .map((n, i, all) => (
                    <span key={n} className="contents">
                      {i > 0 && n - all[i - 1] > 1 && (
                        <span
                          aria-hidden="true"
                          className="flex h-8 w-8 items-center justify-center border-r border-edge pointer-coarse:h-10"
                        >
                          …
                        </span>
                      )}
                      <Button
                        size="icon"
                        className="border-r! border-edge"
                        aria-label={String(n + 1)}
                        aria-current={pageIndex === n ? "page" : undefined}
                        variant={pageIndex === n ? "default" : "ghost"}
                        onClick={() => table.setPageIndex(n)}
                      >
                        {n + 1}
                      </Button>
                    </span>
                  ))}
              </div>
              <Button
                variant="outline"
                className="border-r-0!"
                aria-label={labels.next}
                disabled={!table.getCanNextPage()}
                onClick={() => table.nextPage()}
              >
                <span className="@min-[40rem]:hidden">{labels.next}</span>
                <span aria-hidden="true" className="hidden @min-[40rem]:inline">
                  ›
                </span>
              </Button>
            </div>
            <label className="hidden items-center gap-2 @min-[40rem]:flex">
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
