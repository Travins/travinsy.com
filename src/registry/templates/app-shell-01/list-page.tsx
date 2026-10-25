"use client"

import { PlusIcon } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { StatusBadge } from "./dashboard-overview"
import { PageFrame } from "./page-header"
import { PageToolbar } from "./page-toolbar"
import { events } from "./sample-data"

const PAGE_SIZE = 6

/** 通用列表页示例：标题栏 + 工具栏（搜索、翻页）+ 表格。其余导航项在演示里都显示它。 */
function ListPage({
  title,
  description,
  section,
}: {
  title: string
  description?: string
  section?: string
}) {
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const keyword = search.trim().toLowerCase()
  const filtered = events.filter(
    (row) =>
      !keyword ||
      row.app.toLowerCase().includes(keyword) ||
      row.target.toLowerCase().includes(keyword),
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, totalPages)
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  return (
    <PageFrame
      data-slot="app-shell-list-page"
      section={section}
      title={title}
      description={description}
      actions={
        <Button>
          <PlusIcon data-icon="inline-start" />
          新建
        </Button>
      }
      toolbar={
        <PageToolbar
          total={filtered.length}
          page={current}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          search={search}
          onSearchChange={(value) => {
            setSearch(value)
            setPage(1)
          }}
          searchLabel="搜索应用或目标"
        />
      }
    >
      <Card>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <caption className="sr-only">{title}列表</caption>
            <thead className="text-xs text-muted-foreground">
              <tr className="border-b border-border">
                <th scope="col" className="py-2 pr-4 font-medium">应用</th>
                <th scope="col" className="py-2 pr-4 font-medium">目标</th>
                <th scope="col" className="py-2 pr-4 font-medium">状态</th>
                <th scope="col" className="py-2 text-right font-medium">时间</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-border last:border-0">
                  <td className="py-2.5 pr-4 font-medium">{row.app}</td>
                  <td className="py-2.5 pr-4 font-mono text-xs text-muted-foreground">
                    {row.target}
                  </td>
                  <td className="py-2.5 pr-4"><StatusBadge status={row.status} /></td>
                  <td className="py-2.5 text-right text-muted-foreground tabular-nums">
                    {row.time}
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-muted-foreground">
                    没有匹配的记录
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </PageFrame>
  )
}

export { ListPage }
