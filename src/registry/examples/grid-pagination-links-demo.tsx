"use client"

import { GridPagination } from "@/registry/ui/grid-pagination/grid-pagination"

/** 链接模式：每一格都是真实链接，可以新标签页打开；不传 total 时信息格显示页数 */
export default function GridPaginationLinksDemo() {
  return (
    <div className="w-full max-w-3xl">
      <GridPagination pageCount={7} getHref={(n) => `#page-${n}`} />
    </div>
  )
}
