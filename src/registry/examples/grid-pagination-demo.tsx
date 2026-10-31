"use client"

import * as React from "react"
import { GridPagination } from "@/registry/ui/grid-pagination/grid-pagination"

const TOTAL = 128

export default function GridPaginationDemo() {
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)
  return (
    <div className="w-full max-w-3xl">
      <GridPagination
        page={page}
        onPageChange={setPage}
        pageCount={Math.ceil(TOTAL / pageSize)}
        total={TOTAL}
        pageSize={pageSize}
        pageSizes={[10, 20, 50]}
        onPageSizeChange={(n) => {
          setPageSize(n)
          setPage(1)
        }}
        jumper
      />
    </div>
  )
}
