"use client"
import * as React from "react"
import type { PaginationState, SortingState } from "@tanstack/react-table"
import { DataTable } from "@/registry/blocks/data-table-01/data-table"
import {
  datasets,
  columns,
  getRowId,
} from "@/registry/blocks/data-table-01/page"
export default function ServerDemo() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [retry, setRetry] = React.useState(0)
  const failed = React.useRef(false)
  const [result, setResult] = React.useState({
    data: datasets.slice(0, 10),
    total: datasets.length,
  })
  React.useEffect(() => {
    const start = setTimeout(() => {
      setLoading(true)
      setError(null)
    }, 0)
    const timer = setTimeout(() => {
      setLoading(false)
      if (pagination.pageIndex === 2 && !failed.current) {
        failed.current = true
        setError("请求失败，请重试")
        return
      }
      let data = datasets.filter((row) => row.name.includes(globalFilter))
      if (sorting[0]) {
        const { id, desc } = sorting[0]
        data = [...data].sort(
          (a, b) =>
            String(a[id as keyof typeof a]).localeCompare(
              String(b[id as keyof typeof b]),
              "zh-CN",
              { numeric: true },
            ) * (desc ? -1 : 1),
        )
      }
      setResult({
        total: data.length,
        data: data.slice(
          pagination.pageIndex * pagination.pageSize,
          (pagination.pageIndex + 1) * pagination.pageSize,
        ),
      })
    }, 650)
    return () => {
      clearTimeout(start)
      clearTimeout(timer)
    }
  }, [pagination, sorting, globalFilter, retry])
  return (
    <DataTable
      columns={columns}
      data={result.data}
      getRowId={getRowId}
      mode="manual"
      rowCount={result.total}
      pagination={pagination}
      onPaginationChange={setPagination}
      sorting={sorting}
      onSortingChange={setSorting}
      globalFilter={globalFilter}
      onGlobalFilterChange={setGlobalFilter}
      loading={loading}
      error={error}
      onRetry={() => setRetry((n) => n + 1)}
    />
  )
}
