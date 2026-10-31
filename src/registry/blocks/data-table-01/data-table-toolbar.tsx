"use client"
import type { Table } from "@tanstack/react-table"
import { Search, Settings2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { SegmentedControl } from "@/registry/ui/segmented-control/segmented-control"
import type { DataTableLabels, DataTableProps } from "./types"

function DataTableToolbar<T>({
  table,
  labels,
  density,
  onDensityChange,
  statusFilter,
  children,
}: {
  table: Table<T>
  labels: DataTableLabels
  density: string
  onDensityChange: (value: string) => void
  statusFilter?: DataTableProps<T>["statusFilter"]
  children?: React.ReactNode
}) {
  "use no memo"
  // Table v8 的对象引用稳定，子组件同样需要读取当前状态。
  return (
    <div
      data-slot="data-table-toolbar"
      className="flex flex-col gap-2.5 p-3 @2xl:flex-row @2xl:flex-wrap @2xl:items-center @2xl:p-4"
    >
      <label className="relative block w-full shrink-0 @2xl:w-52">
        <span className="sr-only">{labels.search}</span>
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          placeholder={labels.search}
          value={table.getState().globalFilter ?? ""}
          onChange={(event) => {
            table.setGlobalFilter(event.target.value)
            table.setPageIndex(0)
          }}
          className="w-full pl-9 pointer-coarse:text-base"
        />
      </label>
      {statusFilter && (
        <SegmentedControl
          size="default"
          className="w-fit max-w-full"
          label={String(
            table.getColumn(statusFilter.columnId)?.columnDef.header ?? "",
          )}
          options={statusFilter.options}
          value={String(
            table.getColumn(statusFilter.columnId)?.getFilterValue() ?? "",
          )}
          onValueChange={(value) => {
            table
              .getColumn(statusFilter.columnId)
              ?.setFilterValue(value || undefined)
            table.setPageIndex(0)
          }}
        />
      )}
      <div className="flex flex-wrap items-center gap-2.5">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="outline" size="default" />}
          >
            <Settings2 aria-hidden="true" />
            {labels.columns}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-44">
            {table.getAllLeafColumns().map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(value)}
                closeOnClick={false}
              >
                {String(column.columnDef.header ?? column.id)}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => table.resetColumnVisibility()}>
              {labels.reset}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <SegmentedControl
          size="default"
          className="w-auto"
          label={labels.density}
          value={density}
          onValueChange={onDensityChange}
          options={[
            { value: "32", label: labels.compact },
            { value: "40", label: labels.standard },
            { value: "48", label: labels.comfortable },
          ]}
        />
      </div>
      {children}
    </div>
  )
}
export { DataTableToolbar }
