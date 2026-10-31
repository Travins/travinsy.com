"use client"

import { BarPagination } from "@/registry/ui/bar-pagination/bar-pagination"

export default function Demo() {
  return (
    <div className="w-full max-w-3xl space-y-4 rounded-xl border border-edge bg-background p-4 shadow-xs">
      <BarPagination pageCount={7} getHref={(n) => `#page-${n}`} />
    </div>
  )
}
