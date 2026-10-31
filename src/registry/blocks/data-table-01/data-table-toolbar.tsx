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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  return (
    <>
      {statusFilter && (
        <Tabs
          value={String(
            table.getColumn(statusFilter.columnId)?.getFilterValue() ?? "",
          )}
          onValueChange={(value) => {
            table
              .getColumn(statusFilter.columnId)
              ?.setFilterValue(value || undefined)
            table.setPageIndex(0)
          }}
          className="overflow-x-auto border-b border-edge"
        >
          <TabsList variant="line" className="h-12! justify-start gap-5 px-0">
            {statusFilter.options.map((option) => (
              <TabsTrigger
                key={option.value}
                value={option.value}
                className="flex-none px-1 after:bottom-0!"
              >
                {option.value && (
                  <span
                    aria-hidden="true"
                    className={
                      option.value === "进行中"
                        ? "size-1.5 rounded-full bg-(--flow-green)"
                        : option.value === "待审核"
                          ? "size-1.5 rounded-full bg-(--flow-amber)"
                          : "size-1.5 rounded-full bg-muted-foreground"
                    }
                  />
                )}
                {option.label}
                <span className="ml-1 font-mono text-xs">
                  {counts?.[option.value] ?? 0}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}
      <div
        data-slot="data-table-toolbar"
        className="flex flex-wrap items-center justify-between gap-3 py-4"
      >
        <label className="relative block min-w-0 flex-1 @min-[40rem]:max-w-72">
          <span className="sr-only">{labels.search}</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
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
            className="w-full rounded-none border-edge bg-muted/40 pr-8 pl-9 pointer-coarse:text-base"
          />
          <kbd className="absolute top-1/2 right-3 -translate-y-1/2 font-mono text-xs text-muted-foreground">
            /
          </kbd>
        </label>
        <div className="flex flex-wrap items-center gap-2.5">
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
