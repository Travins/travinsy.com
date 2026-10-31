"use client"
import type { Table } from "@tanstack/react-table"
import { BarPagination } from "@/registry/ui/bar-pagination/bar-pagination"
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
  const { pageIndex, pageSize } = table.getState().pagination
  return (
    <div
      data-slot="data-table-pagination"
      className="border-t border-edge px-[var(--data-table-gutter,1rem)] py-4 [&_*]:text-xs! pointer-coarse:[&_input]:text-base!"
    >
      {virtual ? (
        <p className="text-xs text-muted-foreground">
          {labels.rowTotal(count)}
        </p>
      ) : (
        <BarPagination
          page={pageIndex + 1}
          pageCount={table.getPageCount()}
          total={count}
          pageSize={pageSize}
          pageSizes={[10, 20, 50, 100]}
          jumper
          siblings={1}
          labels={{
            previous: labels.previous,
            next: labels.next,
            perPage: labels.perPage,
            jump: labels.jump,
          }}
          onPageChange={(page) => table.setPageIndex(page - 1)}
          onPageSizeChange={(size) => {
            table.setPageSize(size)
            table.setPageIndex(0)
          }}
        />
      )}
    </div>
  )
}
export { DataTablePagination }
