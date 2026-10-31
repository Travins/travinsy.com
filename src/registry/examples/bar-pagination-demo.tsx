"use client"

import * as React from "react"
import { BarPagination } from "@/registry/ui/bar-pagination/bar-pagination"

export default function Demo() {
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  return (
    <div className="w-full max-w-3xl space-y-4 rounded-xl border border-edge bg-background p-4 shadow-xs">
      <BarPagination
        page={page}
        onPageChange={setPage}
        pageCount={Math.ceil(64 / pageSize)}
        total={64}
        pageSize={pageSize}
        pageSizes={[10, 20, 50, 100]}
        onPageSizeChange={(n) => {
          setPageSize(n)
          setPage(1)
        }}
        jumper
      />
    </div>
  )
}
