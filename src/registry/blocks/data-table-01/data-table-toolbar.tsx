"use client"
import * as React from "react"
import type { Table } from "@tanstack/react-table"
import {
  ArrowUpDown,
  Rows2,
  Rows3,
  Rows4,
  Search,
  Settings2,
} from "lucide-react"
import { BarField } from "@/registry/ui/bar-field/bar-field"
import { SegmentedControl } from "@/registry/ui/segmented-control/segmented-control"
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
  searchLabel,
  counts,
}: {
  table: Table<T>
  labels: DataTableLabels
  density: string
  onDensityChange: (value: string) => void
  statusFilter?: DataTableProps<T>["statusFilter"]
  counts?: Record<string, number>
  searchLabel?: React.ReactNode
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
        // 表格工具栏统一 12px；触屏输入框保持 16px，避免 iOS 聚焦时页面放大
        className="flex flex-wrap items-center gap-2 px-[var(--data-table-gutter,0px)] py-3 @min-[40rem]:flex-nowrap [&_*]:text-xs! pointer-coarse:[&_input]:text-base!"
      >
        <BarField
          label={searchLabel}
          aria-label={searchLabel ? undefined : labels.searchField}
          icon={<Search />}
          inputRef={searchRef}
          type="search"
          placeholder={labels.search}
          className="min-w-0 flex-1 @min-[40rem]:w-64 @min-[40rem]:flex-none [&_[data-slot=bar-field-label-above]]:hidden! [&_[data-slot=bar-field-label]]:not-sr-only!"
          value={table.getState().globalFilter ?? ""}
          onValueChange={(value) => {
            table.setGlobalFilter(value)
            table.setPageIndex(0)
          }}
          suffix={
            <kbd className="pointer-events-none grid size-5 place-items-center rounded-sm border border-edge bg-muted font-mono text-[11px] text-muted-foreground pointer-coarse:hidden">
              /
            </kbd>
          }
        />
        {statusFilter && (
          <SegmentedControl
            aria-label={labels.status}
            value={status}
            className="order-last basis-full @min-[40rem]:order-none @min-[40rem]:w-auto @min-[40rem]:basis-auto [&_[data-slot=segmented-control-item]]:flex-1 [&_[data-slot=segmented-control-item]>span:last-child]:overflow-visible"
            options={statusFilter.options.map((option) => ({
              value: option.value,
              icon: option.tone ? (
                <span
                  className="hidden size-1.5 rounded-full @min-[40rem]:block"
                  style={{ background: option.tone }}
                />
              ) : undefined,
              label: (
                <span className="whitespace-nowrap">
                  {option.label}
                  <span className="ml-1.5 hidden font-mono text-xs text-muted-foreground @min-[40rem]:inline">
                    {counts?.[option.value] ?? 0}
                  </span>
                </span>
              ),
            }))}
            onValueChange={(value) => {
              statusColumn?.setFilterValue(value || undefined)
              table.setPageIndex(0)
            }}
          />
        )}
        {children}
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
            <DropdownMenuContent align="end" className="min-w-44 *:text-xs!">
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
          {/* 密度只用图标：行数越多越紧凑；文字留给读屏和悬停提示 */}
          <SegmentedControl
            aria-label={labels.density}
            iconOnly
            value={density}
            className="hidden @min-[40rem]:flex"
            options={[
              { value: "40", label: labels.compact, icon: <Rows4 /> },
              { value: "52", label: labels.standard, icon: <Rows3 /> },
              { value: "64", label: labels.comfortable, icon: <Rows2 /> },
            ]}
            onValueChange={onDensityChange}
          />
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
            <DropdownMenuContent align="end" className="*:text-xs!">
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
      </div>
    </>
  )
}
export { DataTableToolbar }
