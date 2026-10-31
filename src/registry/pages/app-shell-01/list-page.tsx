"use client"

import { PlusIcon } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  ChartCard,
  ChartCardContent,
} from "@/registry/ui/chart-card/chart-card"

import { formatLabel, useAppShellLabels } from "./config"
import { EventsTable } from "./dashboard-overview"
import { PageFrame } from "./page-header"
import { PageToolbar } from "./page-toolbar"
import { events } from "./sample-data"

const PAGE_SIZE = 6

/**
 * 通用列表页示例：标题栏 + 工具栏（搜索、翻页）+ 可选的数据摘要 + 表格。其余导航项在演示里都显示它。
 * summary 插槽放在表格上方，通常是该页自己的指标与图表（见 page-summaries.tsx）。
 */
function ListPage({
  title,
  description,
  section,
  summary,
}: {
  title: string
  description?: string
  section?: string
  summary?: React.ReactNode
}) {
  const text = useAppShellLabels()
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
          {text.createAction}
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
          searchLabel={text.searchEvents}
        />
      }
    >
      {/* 摘要按所在区域的宽度排版：右侧挂着 aside 时主区域变窄，图表会自动改为单列 */}
      {summary ? (
        <div data-slot="app-shell-list-summary" className="@container empty:hidden">
          {summary}
        </div>
      ) : null}
      <ChartCard>
        <ChartCardContent>
          <EventsTable
            rows={rows}
            caption={formatLabel(text.listCaption, { title })}
          />
        </ChartCardContent>
      </ChartCard>
    </PageFrame>
  )
}

export { ListPage }
