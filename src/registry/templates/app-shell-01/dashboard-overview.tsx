"use client"

import {
  AlertTriangleIcon,
  CheckIcon,
  DownloadIcon,
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

import { formatLabel, useAppShellLabels } from "./config"
import { PageContent, PageHeader, PageTabs } from "./page-header"
import {
  dateRange,
  events,
  latencySeries,
  scopes,
  stats,
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
  const text = useAppShellLabels()
  const label = {
    ok: text.eventOk,
    warning: text.eventWarning,
    error: text.eventError,
  } satisfies Record<EventStatus, string>
  const Icon = statusIcons[status]
  return (
    <Badge
      data-slot="app-shell-status-badge"
      data-status={status}
      variant={statusVariants[status]}
    >
      <Icon data-icon="inline-start" />
      {label[status]}
    </Badge>
  )
}

/** 概览仪表盘：统计卡片 + 响应耗时柱图 + 最近事件表。纯 Tailwind 与已安装组件实现。 */
function DashboardOverview() {
  const text = useAppShellLabels()
  const [scope, setScope] = React.useState("all")
  const rows =
    scope === "all"
      ? events
      : events.filter((event) =>
          scope === "orders" ? event.app === "订单中心" : event.app === "支付网关",
        )
  const max = Math.max(...latencySeries)
  const min = Math.min(...latencySeries)

  return (
    <div
      data-slot="app-shell-dashboard-overview"
      className="flex min-w-0 flex-col"
    >
      <PageHeader
        section={text.overviewSection}
        title={text.overviewTitle}
        description={text.overviewDescription}
        actions={
          <>
            <Button variant="outline">
              <DownloadIcon data-icon="inline-start" />
              {text.exportAction}
            </Button>
            <Button>
              <RefreshCwIcon data-icon="inline-start" />
              {text.refreshAction}
            </Button>
          </>
        }
      />
      <PageTabs
        tabs={scopes}
        value={scope}
        onValueChange={setScope}
        trailing={dateRange}
      />
      <PageContent>
        <section
          aria-label={text.keyMetrics}
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
            <CardTitle>{text.latencyTrend}</CardTitle>
            <CardDescription>{text.latencyTrendUnit}</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              role="img"
              aria-label={formatLabel(text.latencyChartLabel, { max, min })}
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
            <CardTitle>{text.recentEvents}</CardTitle>
            <CardDescription>
              {formatLabel(text.recentEventsCount, { count: rows.length })}
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <caption className="sr-only">{text.eventsCaption}</caption>
              <thead className="text-xs text-muted-foreground">
                <tr className="border-b border-border">
                  <th scope="col" className="py-2 pr-4 font-medium">
                    {text.columnApp}
                  </th>
                  <th scope="col" className="py-2 pr-4 font-medium">
                    {text.columnTarget}
                  </th>
                  <th scope="col" className="py-2 pr-4 font-medium">
                    {text.columnStatus}
                  </th>
                  <th scope="col" className="py-2 pr-4 text-right font-medium">
                    {text.columnLatency}
                  </th>
                  <th scope="col" className="py-2 text-right font-medium">
                    {text.columnTime}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-border last:border-0">
                    <td className="py-2.5 pr-4 font-medium">{row.app}</td>
                    <td className="py-2.5 pr-4 font-mono text-xs text-muted-foreground">
                      {row.target}
                    </td>
                    <td className="py-2.5 pr-4">
                      <StatusBadge status={row.status} />
                    </td>
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
