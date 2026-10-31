import type * as React from "react"
import type {
  ColumnDef,
  SortingState,
  PaginationState,
  ColumnFiltersState,
  RowSelectionState,
} from "@tanstack/react-table"

type DataTableMeta<T> = {
  detailCell?: (value: unknown, row: T) => React.ReactNode
  bar?: boolean
  max?: number
  align?: "left" | "center" | "right"
  editable?: "text" | "number"
  validate?: (value: unknown, row: T) => string | undefined
  hideOnMobile?: boolean
  pinned?: boolean
  width?: number
}
type DataTableColumn<T> = ColumnDef<T, unknown> & { meta?: DataTableMeta<T> }
type DataTableLabels = {
  sort: string
  ascending: string
  descending: string
  detailDescription: string
  emptyDescription: string
  noResultsDescription: string
  errorDescription: string
  items: string
  page: string
  editDescription: (value: string, column: string) => string
  search: string
  status: string
  columns: string
  reset: string
  density: string
  compact: string
  standard: string
  comfortable: string
  selected: string
  selectAllCompact: string
  selectAll: string
  clear: string
  retry: string
  empty: string
  noResults: string
  clearFilters: string
  previous: string
  next: string
  total: string
  perPage: string
  jump: string
  cancel: string
  save: string
  saveError: string
  selectPage: string
  selectRow: string
}
type DataTableProps<T> = Omit<React.ComponentProps<"div">, "onChange"> & {
  columns: DataTableColumn<T>[]
  data: T[]
  getRowId: (row: T) => string
  mode?: "client" | "manual"
  rowCount?: number
  loading?: boolean
  error?: string | null
  onRetry?: () => void
  sorting?: SortingState
  defaultSorting?: SortingState
  onSortingChange?: (value: SortingState) => void
  pagination?: PaginationState
  defaultPagination?: PaginationState
  onPaginationChange?: (value: PaginationState) => void
  globalFilter?: string
  defaultGlobalFilter?: string
  onGlobalFilterChange?: (value: string) => void
  columnFilters?: ColumnFiltersState
  defaultColumnFilters?: ColumnFiltersState
  onColumnFiltersChange?: (value: ColumnFiltersState) => void
  rowSelection?: RowSelectionState
  defaultRowSelection?: RowSelectionState
  onRowSelectionChange?: (value: RowSelectionState) => void
  onSelectAll?: () => void
  bulkActions?: (selected: T[]) => React.ReactNode
  rowActions?: (row: T) => React.ReactNode
  onCellCommit?: (change: {
    rowId: string
    columnId: string
    value: unknown
    row: T
  }) => void | Promise<void>
  virtualization?: false | { estimateRowHeight?: number; height?: number }
  header?: React.ReactNode
  counts?: Record<string, number>
  toolbar?: React.ReactNode
  statusFilter?: {
    columnId: string
    /** tone：状态色点的颜色，填 CSS 颜色或主题变量，如 "var(--flow-green)" */
    options: { value: string; label: string; tone?: string }[]
  }
  labels?: Partial<DataTableLabels>
}
export type { DataTableProps, DataTableColumn, DataTableMeta, DataTableLabels }
