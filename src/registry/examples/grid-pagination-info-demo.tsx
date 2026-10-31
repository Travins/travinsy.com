"use client"

import * as React from "react"
import { GridPagination } from "@/registry/ui/grid-pagination/grid-pagination"

/** 信息格放自定义内容：这里是一份构建日志的翻页，左侧显示筛选条件与条数 */
export default function GridPaginationInfoDemo() {
  const [page, setPage] = React.useState(3)
  return (
    <div className="w-full max-w-3xl">
      <GridPagination
        page={page}
        onPageChange={setPage}
        pageCount={12}
        size="sm"
        info={
          <span className="flex min-w-0 items-center gap-2">
            <span className="size-1.5 shrink-0 rounded-full bg-destructive" />
            <span className="truncate">仅错误 · 共 236 条</span>
          </span>
        }
      />
    </div>
  )
}
