"use client"

import { BarPagination } from "@/registry/ui/bar-pagination/bar-pagination"

export default function Demo() {
  return (
    <div className="w-full max-w-3xl space-y-4 rounded-xl border border-edge bg-background p-4 shadow-xs">
      <div className="w-full max-w-xs">
        <BarPagination
          pageCount={7}
          defaultPage={4}
          total={64}
          pageSizes={[10, 20]}
          jumper
        />
      </div>
    </div>
  )
}
