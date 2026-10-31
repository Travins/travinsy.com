"use client"

import { GridPagination } from "@/registry/ui/grid-pagination/grid-pagination"

/** 窄容器：信息格独占一行，页码收成「当前页 / 总页数」，首尾与前后翻页保留 */
export default function GridPaginationCompactDemo() {
  return (
    <div className="w-full max-w-xs">
      <GridPagination
        pageCount={13}
        defaultPage={4}
        total={128}
        pageSizes={[10, 20]}
        jumper
      />
    </div>
  )
}
