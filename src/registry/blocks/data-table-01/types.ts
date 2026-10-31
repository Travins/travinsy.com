import type * as React from "react"
import type {
  Table,
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
  actions: string
  rowTotal: (count: number) => string
  search: string
  /** 搜索框的读屏名称（未传 searchLabel 时使用） */
  searchField: string
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
  first: string
  previous: string
  next: string
  last: string
  total: string
  perPage: string
  jump: string
  cancel: string
  save: string
  saveError: string
  saving: string
  saved: string
  nextCell: string
  editAgain: string
  selectPage: string
  selectRow: string
}
type DataTableHandle = {
  startEditing: (rowId: string, columnId: string) => void
  openDetails: (rowId: string) => void
}
type DataTableProps<T> = Omit<React.ComponentProps<"div">, "onChange"> & {
  apiRef?: React.Ref<DataTableHandle>
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
  /** 搜索框条内标签，默认不显示；传入如「搜索」时显示在图标前 */
  searchLabel?: React.ReactNode
  onCellCommit?: (change: {
    rowId: string
    columnId: string
    value: unknown
    row: T
  }) => void | Promise<void>
  virtualization?: false | { estimateRowHeight?: number; height?: number }
  header?: React.ReactNode
  counts?: Record<string, number>
  toolbar?: React.ReactNode | ((table: Table<T>) => React.ReactNode)
  statusFilter?: {
    columnId: string
    /** tone：状态色点的颜色，填 CSS 颜色或主题变量，如 "var(--flow-green)" */
    options: { value: string; label: string; tone?: string }[]
  }
  labels?: Partial<DataTableLabels>
}
export type {
  DataTableHandle,
  DataTableProps,
  DataTableColumn,
  DataTableMeta,
  DataTableLabels,
}
