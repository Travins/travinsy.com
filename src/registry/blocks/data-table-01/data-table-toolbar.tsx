"use client"
import * as React from "react"
import type { Table } from "@tanstack/react-table"
import {
  Search,
  Settings2,
  Rows2,
  Rows3,
  Rows4,
  ArrowUpDown,
} from "lucide-react"
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
import type { DataTableLabels, DataTableProps } from "./types"

function DataTableToolbar<T>({
  table,
  labels,
  density,
  onDensityChange,
  statusFilter,
  children,
  counts,
}: {
  table: Table<T>
  labels: DataTableLabels
  density: string
  onDensityChange: (value: string) => void
  statusFilter?: DataTableProps<T>["statusFilter"]
  counts?: Record<string, number>
  children?: React.ReactNode
}) {
  "use no memo"
  // Table v8 的对象引用稳定，子组件同样需要读取当前状态。
  const searchRef = React.useRef<HTMLInputElement>(null)
  React.useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      if (
        event.key !== "/" ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        (event.target instanceof HTMLElement &&
          (event.target.isContentEditable ||
            event.target.closest("input,textarea,select")))
      )
        return
      event.preventDefault()
      searchRef.current?.focus()
    }
    window.addEventListener("keydown", focusSearch)
    return () => window.removeEventListener("keydown", focusSearch)
  }, [])
  const statusColumn = statusFilter
    ? table.getColumn(statusFilter.columnId)
    : undefined
  const status = String(statusColumn?.getFilterValue() ?? "")
  return (
    <>
      <div
        data-slot="data-table-toolbar"
        className="flex flex-wrap items-center gap-2 px-[var(--data-table-gutter,0px)] py-3 @min-[40rem]:flex-nowrap"
      >
        <label className="relative block min-w-0 flex-1 @min-[40rem]:w-64 @min-[40rem]:flex-none">
          <span className="sr-only">{labels.search}</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            ref={searchRef}
            type="search"
            placeholder={labels.search}
            value={table.getState().globalFilter ?? ""}
            onChange={(event) => {
              table.setGlobalFilter(event.target.value)
              table.setPageIndex(0)
            }}
            className="w-full pr-8 pl-8"
          />
          <kbd className="pointer-events-none absolute top-1/2 right-2 grid h-5 min-w-5 -translate-y-1/2 place-items-center rounded-sm border border-edge bg-muted px-1 font-mono text-[11px] text-muted-foreground pointer-coarse:hidden">
            /
          </kbd>
        </label>
        {statusFilter && (
          // 状态筛选：单选按钮组，每项带数量；窄屏可横向滚动
          <div
            role="radiogroup"
            aria-label={labels.status}
            // 窄容器单独占一行放在最下面，宽容器紧跟搜索框
            className="order-last flex min-w-0 basis-full overflow-x-auto @min-[40rem]:order-none @min-[40rem]:basis-auto"
          >
            <div className="flex w-full overflow-hidden rounded-md border border-edge @min-[40rem]:w-auto @min-[40rem]:shrink-0">
              {statusFilter.options.map((option) => {
                const checked = status === option.value
                return (
                  <Button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={checked}
                    variant="ghost"
                    size="default"
                    className="min-w-0 flex-1 gap-1 rounded-none border-r border-edge px-1.5 font-normal @min-[40rem]:flex-none @min-[40rem]:gap-1.5 @min-[40rem]:px-2.5 text-muted-foreground last:border-r-0 aria-checked:bg-muted aria-checked:text-foreground"
                    onClick={() => {
                      statusColumn?.setFilterValue(option.value || undefined)
                      table.setPageIndex(0)
                    }}
                  >
                    {option.tone && (
                      <span
                        aria-hidden="true"
                        // 窄容器四项均分一行，色点让位给文字
                        className="hidden size-1.5 rounded-full @min-[40rem]:block"
                        style={{ background: option.tone }}
                      />
                    )}
                    {option.label}
                    <span className="font-mono text-xs text-muted-foreground tabular-nums">
                      {counts?.[option.value] ?? 0}
                    </span>
                  </Button>
                )
              })}
            </div>
          </div>
        )}
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  aria-label={labels.columns}
                />
              }
            >
              <Settings2 aria-hidden="true" />
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
          <div
            role="group"
            aria-label={labels.density}
            className="hidden overflow-hidden rounded-md border border-edge @min-[40rem]:flex"
          >
            {(
              [
                ["40", labels.compact, Rows4],
                ["52", labels.standard, Rows3],
                ["64", labels.comfortable, Rows2],
              ] as const
            ).map(([value, label, Icon]) => (
              <Button
                key={value}
                size="icon"
                variant="ghost"
                aria-label={label}
                aria-pressed={density === value}
                className="rounded-none border-r border-edge last:border-r-0 aria-pressed:bg-muted"
                onClick={() => onDensityChange(value)}
              >
                <Icon aria-hidden="true" />
              </Button>
            ))}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  size="icon"
                  variant="outline"
                  aria-label={labels.sort}
                  className="@min-[40rem]:hidden"
                />
              }
            >
              <ArrowUpDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllLeafColumns()
                .filter((column) => column.getCanSort())
                .map((column) => (
                  <React.Fragment key={column.id}>
                    {[false, true].map((desc) => (
                      <DropdownMenuItem
                        key={String(desc)}
                        onClick={() => column.toggleSorting(desc)}
                      >
                        {String(column.columnDef.header)} ·{" "}
                        {desc ? labels.descending : labels.ascending}
                      </DropdownMenuItem>
                    ))}
                  </React.Fragment>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {children}
      </div>
    </>
  )
}
export { DataTableToolbar }
