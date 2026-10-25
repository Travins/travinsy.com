"use client"

import {
  AlertTriangleIcon,
  CheckIcon,
  DownloadIcon,
  GlobeIcon,
  LayoutGridIcon,
  RefreshCwIcon,
  XIcon,
} from "lucide-react"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { PageContent, PageHeader, PageTabs } from "./page-header"
import {
  events,
  latencySeries,
  stats,
  statusLabels,
  type EventStatus,
} from "./sample-data"

const statusIcons = {
  ok: CheckIcon,
  warning: AlertTriangleIcon,
  error: XIcon,
} satisfies Record<EventStatus, typeof CheckIcon>

const statusVariants = {
  ok: "secondary",
  warning: "outline",
  error: "destructive",
} satisfies Record<EventStatus, "secondary" | "outline" | "destructive">

/** 状态徽标：图标 + 文字，不只依赖颜色。 */
function StatusBadge({ status }: { status: EventStatus }) {
  const Icon = statusIcons[status]
  return (
    <Badge
      data-slot="app-shell-status-badge"
      data-status={status}
      variant={statusVariants[status]}
    >
      <Icon data-icon="inline-start" />
      {statusLabels[status]}
    </Badge>
  )
}

const scopes = [
  { value: "all", label: "全局总览", icon: GlobeIcon },
  { value: "orders", label: "订单中心", icon: LayoutGridIcon },
  { value: "payments", label: "支付网关", icon: LayoutGridIcon },
]

/** 概览仪表盘：统计卡片 + 响应耗时柱图 + 最近事件表。纯 Tailwind 与已安装组件实现。 */
function DashboardOverview() {
  const [scope, setScope] = React.useState("all")
  const rows =
    scope === "all"
      ? events
      : events.filter((event) =>
          scope === "orders" ? event.app === "订单中心" : event.app === "支付网关",
        )
  const max = Math.max(...latencySeries)

  return (
    <div
      data-slot="app-shell-dashboard-overview"
      className="flex min-w-0 flex-col"
    >
      <PageHeader
        section="工作台"
        title="概览"
        description="近 24 小时的拨测质量与告警情况"
        actions={
          <>
            <Button variant="outline">
              <DownloadIcon data-icon="inline-start" />
              导出
            </Button>
            <Button>
              <RefreshCwIcon data-icon="inline-start" />
              刷新
            </Button>
          </>
        }
      />
      <PageTabs
        tabs={scopes}
        value={scope}
        onValueChange={setScope}
        trailing="2025-06-01 ~ 2025-06-02"
      />
      <PageContent>
        <section
          aria-label="关键指标"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {stats.map((stat) => (
            <Card key={stat.label} size="sm">
              <CardHeader>
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="text-2xl tracking-tight tabular-nums group-data-[size=sm]/card:text-2xl">
                  {stat.value}
                </CardTitle>
                <CardAction>
                  <Badge variant="outline">{stat.delta}</Badge>
                </CardAction>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                {stat.hint}
              </CardContent>
            </Card>
          ))}
        </section>

        <Card>
          <CardHeader>
            <CardTitle>响应耗时趋势</CardTitle>
            <CardDescription>每小时 P50，单位 ms</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              role="img"
              aria-label={`过去 24 小时响应耗时，最高 ${max} 毫秒，最低 ${Math.min(...latencySeries)} 毫秒`}
              className="flex h-32 items-end gap-1"
            >
              {latencySeries.map((value, index) => (
                <div
                  key={index}
                  className="min-w-0 flex-1 rounded-t-sm bg-primary/25 transition-colors hover:bg-primary data-[peak=true]:bg-primary/70"
                  data-peak={value === max}
                  style={{ height: `${(value / max) * 100}%` }}
                  title={`${String(index).padStart(2, "0")}:00 · ${value} ms`}
                />
              ))}
            </div>
            <div
              aria-hidden="true"
              className="mt-2 flex justify-between text-[11px] text-muted-foreground tabular-nums"
            >
              <span>00:00</span>
              <span>12:00</span>
              <span>23:00</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>最近事件</CardTitle>
            <CardDescription>按时间倒序，共 {rows.length} 条</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <caption className="sr-only">最近拨测事件</caption>
              <thead className="text-xs text-muted-foreground">
                <tr className="border-b border-border">
                  <th scope="col" className="py-2 pr-4 font-medium">应用</th>
                  <th scope="col" className="py-2 pr-4 font-medium">目标</th>
                  <th scope="col" className="py-2 pr-4 font-medium">状态</th>
                  <th scope="col" className="py-2 pr-4 text-right font-medium">耗时</th>
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
                    <td className="py-2.5 pr-4 text-right tabular-nums">{row.latency}</td>
                    <td className="py-2.5 text-right text-muted-foreground tabular-nums">
                      {row.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </PageContent>
    </div>
  )
}

export { DashboardOverview, StatusBadge }
