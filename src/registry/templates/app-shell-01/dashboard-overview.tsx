"use client"

import { DownloadIcon, RefreshCwIcon } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { MiniChart } from "@/registry/ui/mini-chart/mini-chart"
import {
  ChartCard,
  ChartCardContent,
  ChartCardDescription,
  ChartCardHeader,
  ChartCardTitle,
  ChartMetric,
  ChartMetrics,
  ChartSeries,
  ChartTable,
  type ChartTableColumn,
} from "@/registry/ui/chart-card/chart-card"
import {
  StatBadge,
  StatCard,
  StatHeader,
  StatIcon,
  StatLabel,
  StatTrend,
  StatValue,
  type StatStatusName,
} from "@/registry/ui/stat-card/stat-card"

import { formatLabel, useAppShellLabels } from "./config"
import {
  ErrorBudgetCard,
  SlowestEndpointsCard,
  StatusCodeCard,
} from "./overview-charts"
import { PageContent, PageHeader, PageTabs } from "./page-header"
import {
  dateRange,
  events,
  latencySeries,
  scopes,
  stats,
  type EventRow,
  type EventStatus,
} from "./sample-data"

// 事件状态对应到统计卡片的三档状态：正常 / 关注 / 风险
const statusNames = {
  ok: "ok",
  warning: "watch",
  error: "risk",
} satisfies Record<EventStatus, StatStatusName>

/** 状态徽标：色点 + 文字，不只依赖颜色。 */
function StatusBadge({ status }: { status: EventStatus }) {
  const text = useAppShellLabels()
  const label = {
    ok: text.eventOk,
    warning: text.eventWarning,
    error: text.eventError,
  } satisfies Record<EventStatus, string>
  return (
    <StatBadge
      data-slot="app-shell-status-badge"
      data-status={status}
      status={statusNames[status]}
    >
      {label[status]}
    </StatBadge>
  )
}

/** 事件明细表：仪表盘与列表页共用，仪表盘多一列耗时。 */
function EventsTable({
  rows,
  showLatency = false,
  caption,
}: {
  rows: EventRow[]
  showLatency?: boolean
  caption: string
}) {
  const text = useAppShellLabels()
  const columns: ChartTableColumn[] = [
    { key: "app", header: text.columnApp },
    { key: "target", header: text.columnTarget },
    { key: "status", header: text.columnStatus },
    ...(showLatency
      ? [{ key: "latency", header: text.columnLatency, align: "end" as const }]
      : []),
    { key: "time", header: text.columnTime, align: "end" },
  ]
  if (rows.length === 0) {
    return (
      <p
        data-slot="events-table-empty"
        className="py-10 text-center text-sm text-muted-foreground"
      >
        {text.emptyRows}
      </p>
    )
  }
  return (
    <ChartTable
      aria-label={caption}
      columns={columns}
      rows={rows.map((row) => ({
        app: <span className="font-medium">{row.app}</span>,
        target: (
          <span className="font-mono text-xs text-muted-foreground">
            {row.target}
          </span>
        ),
        status: <StatusBadge status={row.status} />,
        latency: row.latency,
        time: <span className="text-muted-foreground">{row.time}</span>,
      }))}
    />
  )
}

/**
 * 概览仪表盘：统计卡片（含迷你走势）、响应耗时与错误预算、状态码分布与最慢接口、最近事件表。
 * 全部用站内自研的数据展示组件拼成；图表区用容器查询（@container）排版，
 * 主区域被右侧 aside 挤窄时会自动改为单列，而不是只看浏览器视口宽度。
 */
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
  const average = Math.round(
    latencySeries.reduce((sum, value) => sum + value, 0) / latencySeries.length,
  )
  const latencyData = latencySeries.map((latency, index) => ({
    hour: `${String(index).padStart(2, "0")}:00`,
    latency,
  }))

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
      <PageContent className="@container">
        <section
          aria-label={text.keyMetrics}
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {stats.map((stat) => (
            <StatCard key={stat.id}>
              <StatHeader>
                <StatLabel>{stat.label}</StatLabel>
                <StatIcon tone="primary">
                  <stat.icon />
                </StatIcon>
              </StatHeader>
              <StatValue value={stat.value} unit={stat.unit} format={stat.format} />
              <MiniChart
                type="area"
                className="h-10"
                data={stat.trend.map((value, index) => ({
                  label: `${String(index * 2).padStart(2, "0")}:00`,
                  value,
                }))}
                seriesLabel={stat.label}
                format={stat.format}
                label={formatLabel(text.statTrendLabel, stat.label)}
              />
              <StatTrend
                value={stat.delta}
                format={stat.deltaFormat}
                invert={stat.invert}
              >
                {stat.hint}
              </StatTrend>
            </StatCard>
          ))}
        </section>

        <section
          aria-label={text.latencyTrend}
          className="grid gap-4 @3xl:grid-cols-3"
        >
          <ChartCard className="@3xl:col-span-2">
            <ChartCardHeader>
              <div className="flex flex-col gap-1">
                <ChartCardTitle>{text.latencyTrend}</ChartCardTitle>
                <ChartCardDescription>{text.latencyTrendUnit}</ChartCardDescription>
              </div>
              <ChartMetrics>
                <ChartMetric label={text.latencyPeak} value={`${max} ms`} />
                <ChartMetric label={text.latencyLow} value={`${min} ms`} />
                <ChartMetric label={text.latencyAverage} value={`${average} ms`} />
              </ChartMetrics>
            </ChartCardHeader>
            <ChartCardContent className="flex-1">
              <ChartSeries
                type="area"
                className="h-full min-h-44"
                data={latencyData}
                xKey="hour"
                series={[
                  { key: "latency", label: text.latencySeries, tone: "primary" },
                ]}
                label={formatLabel(text.latencyChartLabel, { max, min })}
              />
            </ChartCardContent>
          </ChartCard>
          <ErrorBudgetCard />
        </section>

        <section
          aria-label={text.statusCodes}
          className="grid gap-4 @3xl:grid-cols-3"
        >
          <StatusCodeCard />
          <SlowestEndpointsCard className="@3xl:col-span-2" />
        </section>

        <ChartCard>
          <ChartCardHeader>
            <div className="flex flex-col gap-1">
              <ChartCardTitle>{text.recentEvents}</ChartCardTitle>
              <ChartCardDescription>
                {formatLabel(text.recentEventsCount, { count: rows.length })}
              </ChartCardDescription>
            </div>
          </ChartCardHeader>
          <ChartCardContent>
            <EventsTable
              rows={rows}
              showLatency
              caption={text.eventsCaption}
            />
          </ChartCardContent>
        </ChartCard>
      </PageContent>
    </div>
  )
}

export { DashboardOverview, EventsTable, StatusBadge }
