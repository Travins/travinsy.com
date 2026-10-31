"use client"
import * as React from "react"
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Minus,
  Inbox,
  SearchX,
  AlertCircle,
} from "lucide-react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"
import { useVirtualizer } from "@tanstack/react-virtual"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Empty,
  EmptyTitle,
  EmptyMedia,
  EmptyHeader,
  EmptyDescription,
} from "@/components/ui/empty"
import { useControllableState } from "@/registry/hooks/use-controllable-state"
import { DataTableCell } from "./data-table-cell"
import { DataTableToolbar } from "./data-table-toolbar"
import { DataTablePagination } from "./data-table-pagination"
import { DATA_TABLE_LABELS, numberFormat } from "./config"
import type { DataTableProps, DataTableMeta } from "./types"

function DataTable<T>({
  columns,
  data,
  getRowId,
  mode = "client",
  rowCount,
  loading,
  error,
  onRetry,
  sorting: sortingProp,
  defaultSorting = [],
  onSortingChange,
  pagination: paginationProp,
  defaultPagination = { pageIndex: 0, pageSize: 10 },
  onPaginationChange,
  globalFilter: filterProp,
  defaultGlobalFilter = "",
  onGlobalFilterChange,
  columnFilters: filtersProp,
  defaultColumnFilters = [],
  onColumnFiltersChange,
  rowSelection: selectionProp,
  defaultRowSelection = {},
  onRowSelectionChange,
  onSelectAll,
  bulkActions,
  rowActions,
  onCellCommit,
  virtualization = false,
  toolbar,
  statusFilter,
  labels: overrides,
  className,
  ...props
}: DataTableProps<T>) {
  "use no memo"
  // Table v8 的稳定可变对象不能交由 React Compiler 缓存读取。
  const labels = { ...DATA_TABLE_LABELS, ...overrides }
  const [sorting, setSorting] = useControllableState({
    prop: sortingProp,
    defaultProp: defaultSorting,
    onChange: onSortingChange,
  })
  const [pagination, setPagination] = useControllableState({
    prop: paginationProp,
    defaultProp: defaultPagination,
    onChange: onPaginationChange,
  })
  const [globalFilter, setGlobalFilter] = useControllableState({
    prop: filterProp,
    defaultProp: defaultGlobalFilter,
    onChange: onGlobalFilterChange,
  })
  const [columnFilters, setColumnFilters] = useControllableState({
    prop: filtersProp,
    defaultProp: defaultColumnFilters,
    onChange: onColumnFiltersChange,
  })
  const [rowSelection, setRowSelection] = useControllableState({
    prop: selectionProp,
    defaultProp: defaultRowSelection,
    onChange: onRowSelectionChange,
  })
  const [visibility, setVisibility] = React.useState<VisibilityState>({})
  const [density, setDensity] = React.useState("40")
  const [scrolled, setScrolled] = React.useState(false)
  const [patches, setPatches] = React.useState<
    Record<string, Record<string, unknown>>
  >({})
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const touchedVisibility = React.useRef(false)
  React.useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      if (touchedVisibility.current) return
      setVisibility(
        Object.fromEntries(
          columns.map((column) => [
            column.id ??
              ("accessorKey" in column ? String(column.accessorKey) : ""),
            !(column.meta?.hideOnMobile && entry.contentRect.width < 640),
          ]),
        ),
      )
    })
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [columns])
  const displayData = React.useMemo(
    () => data.map((row) => ({ ...row, ...patches[getRowId(row)] })),
    [data, patches, getRowId],
  )
  const sizedColumns = React.useMemo(
    () =>
      columns.map((column) => ({
        ...column,
        size: column.meta?.width ?? column.size,
      })),
    [columns],
  )
  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table v8 返回可变实例，组件已用 "use no memo" 退出编译器优化
  const table = useReactTable({
    data: displayData,
    columns: sizedColumns,
    getRowId,
    state: {
      sorting,
      pagination,
      globalFilter,
      columnFilters,
      rowSelection,
      columnVisibility: visibility,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: (updater) => {
      touchedVisibility.current = true
      setVisibility(updater)
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: virtualization ? undefined : getPaginationRowModel(),
    manualSorting: mode === "manual",
    manualFiltering: mode === "manual",
    manualPagination: mode === "manual",
    rowCount: mode === "manual" ? rowCount : undefined,
    autoResetPageIndex: false,
    columnResizeMode: "onChange",
    defaultColumn: { size: 160, minSize: 80, maxSize: 600 },
  })
  const rows = table.getRowModel().rows
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () =>
      (virtualization && virtualization.estimateRowHeight) || Number(density),
    overscan: 8,
    enabled: !!virtualization,
  })
  const items = virtualizer.getVirtualItems()
  const shown = virtualization
    ? items.map((item) => ({ row: rows[item.index], index: item.index }))
    : rows.map((row, index) => ({ row, index }))
  const selected = Object.values(rowSelection).filter(Boolean).length
  const count =
    mode === "manual" && rowCount !== undefined
      ? rowCount
      : table.getFilteredRowModel().rows.length
  const span = table.getVisibleLeafColumns().length + 1 + Number(!!rowActions)
  const pinned = table
    .getVisibleLeafColumns()
    .find((column) => (column.columnDef.meta as DataTableMeta<T>)?.pinned)?.id
  function clearFilters() {
    setGlobalFilter("")
    setColumnFilters([])
    table.setPageIndex(0)
  }
  return (
    <div
      ref={containerRef}
      data-slot="data-table"
      className={cn(
        "@container w-full min-w-0 bg-background text-foreground",
        className,
      )}
      {...props}
    >
      <DataTableToolbar
        table={table}
        labels={labels}
        density={density}
        onDensityChange={setDensity}
        statusFilter={statusFilter}
      >
        {toolbar}
      </DataTableToolbar>
      {selected > 0 && (
        <div
          role="status"
          className="flex flex-wrap items-center gap-3 border-y border-edge bg-primary/5 p-3 text-sm"
        >
          {labels.selected} {numberFormat.format(selected)} {labels.items}
          {rowCount !== undefined && onSelectAll && selected < rowCount && (
            <Button variant="link" onClick={onSelectAll}>
              {labels.selectAll} {numberFormat.format(rowCount)} {labels.items}
            </Button>
          )}
          <Button variant="ghost" onClick={() => setRowSelection({})}>
            {labels.clear}
          </Button>
          <div className="ml-auto flex items-center gap-2">
            {bulkActions?.(
              table.getSelectedRowModel().rows.map((row) => row.original),
            )}
          </div>
        </div>
      )}
      <div
        ref={scrollRef}
        data-slot="data-table-scroll"
        data-scrolled={scrolled}
        onScroll={(event) => setScrolled(event.currentTarget.scrollLeft > 0)}
        className="relative w-full max-w-full min-w-0 overflow-auto border-y border-edge"
        style={{
          height: virtualization ? (virtualization.height ?? 480) : undefined,
          maxHeight: virtualization ? undefined : 600,
        }}
      >
        <table
          aria-label={labels.search}
          aria-rowcount={count + 1}
          className="table-fixed border-separate border-spacing-0 text-sm"
          style={
            {
              width: table.getTotalSize() + 48 + (rowActions ? 64 : 0),
              minWidth: "100%",
              "--data-table-row-height": density + "px",
            } as React.CSSProperties
          }
        >
          <colgroup>
            <col style={{ width: 48 }} />
            {table.getVisibleLeafColumns().map((column) => (
              <col key={column.id} style={{ width: column.getSize() }} />
            ))}
            {rowActions && <col style={{ width: 64 }} />}
          </colgroup>
          <thead className="sticky top-0 z-20 bg-muted">
            <tr>
              <th className="sticky left-0 z-30 w-12 bg-muted px-3">
                <span className="relative flex size-4">
                  <Checkbox
                    className={
                      table.getIsSomePageRowsSelected()
                        ? "border-primary bg-primary [&_[data-slot=checkbox-indicator]]:invisible"
                        : undefined
                    }
                    aria-label={labels.selectPage}
                    checked={table.getIsAllPageRowsSelected()}
                    indeterminate={table.getIsSomePageRowsSelected()}
                    onCheckedChange={(value) =>
                      table.toggleAllPageRowsSelected(!!value)
                    }
                  />
                  {table.getIsSomePageRowsSelected() && (
                    <Minus
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 size-4 text-primary-foreground"
                    />
                  )}
                </span>
              </th>
              {table.getHeaderGroups()[0]?.headers.map((header) => (
                <th
                  key={header.id}
                  aria-sort={
                    header.column.getIsSorted() === "asc"
                      ? "ascending"
                      : header.column.getIsSorted() === "desc"
                        ? "descending"
                        : "none"
                  }
                  className={cn(
                    "relative bg-muted px-3 text-left",
                    header.id === pinned && "sticky left-12 z-30",
                    header.id === pinned &&
                      scrolled &&
                      "shadow-[4px_0_6px_-4px_var(--border)]",
                  )}
                  style={{
                    width: header.getSize(),
                    minWidth: header.getSize(),
                  }}
                >
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start px-0",
                      (header.column.columnDef.meta as DataTableMeta<T>)
                        ?.align === "right" && "justify-end",
                    )}
                    disabled={!header.column.getCanSort()}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}{" "}
                    {header.column.getCanSort() &&
                      (header.column.getIsSorted() === "asc" ? (
                        <ArrowUp aria-hidden="true" className="size-3.5" />
                      ) : header.column.getIsSorted() === "desc" ? (
                        <ArrowDown aria-hidden="true" className="size-3.5" />
                      ) : (
                        <ArrowUpDown
                          aria-hidden="true"
                          className="size-3.5 text-muted-foreground"
                        />
                      ))}
                  </Button>
                  <div
                    role="separator"
                    aria-label={String(header.column.columnDef.header)}
                    aria-orientation="vertical"
                    aria-valuenow={header.getSize()}
                    aria-valuemin={80}
                    aria-valuemax={600}
                    tabIndex={0}
                    onMouseDown={header.getResizeHandler()}
                    onKeyDown={(event) => {
                      if (["ArrowLeft", "ArrowRight"].includes(event.key)) {
                        event.preventDefault()
                        table.setColumnSizing((old) => ({
                          ...old,
                          [header.id]: Math.max(
                            80,
                            Math.min(
                              600,
                              header.getSize() +
                                (event.key === "ArrowRight" ? 16 : -16),
                            ),
                          ),
                        }))
                      }
                    }}
                    className="absolute inset-y-0 right-0 w-2 cursor-col-resize select-none focus-visible:bg-primary focus-visible:outline-2 pointer-coarse:hidden"
                  />
                </th>
              ))}
              {rowActions && <th />}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: pagination.pageSize }, (_, i) => (
                <tr key={i}>
                  {Array.from({ length: span }, (_, j) => (
                    <td key={j} className="p-3">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={span}>
                  <Empty className="sticky left-0 min-h-60 w-[100cqw] max-w-full">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <AlertCircle aria-hidden="true" />
                      </EmptyMedia>
                      <EmptyTitle>{error}</EmptyTitle>
                      <EmptyDescription>
                        {labels.errorDescription}
                      </EmptyDescription>
                    </EmptyHeader>
                    {onRetry && (
                      <Button onClick={onRetry}>{labels.retry}</Button>
                    )}
                  </Empty>
                </td>
              </tr>
            ) : !rows.length ? (
              <tr>
                <td colSpan={span}>
                  <Empty className="sticky left-0 min-h-60 w-[100cqw] max-w-full">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        {globalFilter || columnFilters.length ? (
                          <SearchX aria-hidden="true" />
                        ) : (
                          <Inbox aria-hidden="true" />
                        )}
                      </EmptyMedia>
                      <EmptyTitle>
                        {globalFilter || columnFilters.length
                          ? labels.noResults
                          : labels.empty}
                      </EmptyTitle>
                      <EmptyDescription>
                        {globalFilter || columnFilters.length
                          ? labels.noResultsDescription
                          : labels.emptyDescription}
                      </EmptyDescription>
                    </EmptyHeader>
                    {(globalFilter || columnFilters.length > 0) && (
                      <Button variant="outline" onClick={clearFilters}>
                        {labels.clearFilters}
                      </Button>
                    )}
                  </Empty>
                </td>
              </tr>
            ) : (
              <>
                {!!virtualization && items.length > 0 && (
                  <tr aria-hidden="true">
                    <td colSpan={span} style={{ height: items[0].start }} />
                  </tr>
                )}
                {shown.map(({ row, index }) => (
                  <tr
                    key={row.id}
                    aria-rowindex={
                      virtualization
                        ? index + 2
                        : pagination.pageIndex * pagination.pageSize + index + 2
                    }
                    data-state={row.getIsSelected() ? "selected" : undefined}
                  >
                    <td
                      className={cn(
                        "sticky left-0 z-10 w-12 border-b border-edge px-3",
                        row.getIsSelected() ? "bg-muted" : "bg-background",
                      )}
                    >
                      <Checkbox
                        aria-label={labels.selectRow + " " + (index + 1)}
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                      />
                    </td>
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        style={{
                          height: Number(density),
                          width: cell.column.getSize(),
                          maxWidth: cell.column.getSize(),
                          textAlign: (
                            cell.column.columnDef.meta as DataTableMeta<T>
                          )?.align,
                        }}
                        className={cn(
                          "border-b border-edge px-3 py-0",
                          (cell.column.columnDef.meta as DataTableMeta<T>)
                            ?.align === "right" && "font-mono tabular-nums",
                          row.getIsSelected() ? "bg-muted" : "bg-background",
                          cell.column.id === pinned && "sticky left-12 z-10",
                          cell.column.id === pinned &&
                            scrolled &&
                            "shadow-[4px_0_6px_-4px_var(--border)]",
                        )}
                      >
                        <DataTableCell
                          value={cell.getValue()}
                          row={row.original}
                          meta={cell.column.columnDef.meta as DataTableMeta<T>}
                          title={String(cell.column.columnDef.header)}
                          labels={labels}
                          cellKey={cell.column.id}
                          rowHeight={Number(density)}
                          onCommit={async (value) => {
                            const key =
                              "accessorKey" in cell.column.columnDef
                                ? String(cell.column.columnDef.accessorKey)
                                : cell.column.id
                            const previous =
                              patches[row.id]?.[key] ??
                              (row.original as Record<string, unknown>)[key]
                            setPatches((old) => ({
                              ...old,
                              [row.id]: { ...old[row.id], [key]: value },
                            }))
                            try {
                              await onCellCommit?.({
                                rowId: row.id,
                                columnId: cell.column.id,
                                value,
                                row: row.original,
                              })
                            } catch (reason) {
                              setPatches((old) => ({
                                ...old,
                                [row.id]: { ...old[row.id], [key]: previous },
                              }))
                              throw reason
                            }
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </DataTableCell>
                      </td>
                    ))}
                    {rowActions && <td>{rowActions(row.original)}</td>}
                  </tr>
                ))}
                {!!virtualization && items.length > 0 && (
                  <tr aria-hidden="true">
                    <td
                      colSpan={span}
                      style={{
                        height:
                          virtualizer.getTotalSize() -
                          items[items.length - 1].end,
                      }}
                    />
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
      <DataTablePagination
        table={table}
        labels={labels}
        virtual={!!virtualization}
        count={count}
      />
    </div>
  )
}
export { DataTable }
export type { DataTableProps, DataTableColumn, DataTableLabels } from "./types"
