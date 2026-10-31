"use client"

import type { ReactNode } from "react"

import { formatStat, type DataTone } from "@/registry/lib/data-display"
import {
  ChartCard,
  ChartCardContent,
  ChartCardDescription,
  ChartCardHeader,
  ChartCardTitle,
  ChartMetric,
  ChartMetrics,
  ChartSeries,
} from "@/registry/ui/chart-card/chart-card"
import { MiniRing } from "@/registry/ui/mini-chart/mini-chart"
import {
  StatBadge,
  StatCard,
  StatHeader,
  StatLabel,
  StatMeta,
} from "@/registry/ui/stat-card/stat-card"

import { formatLabel, useAppShellLabels } from "./config"
import { DistributionCard } from "./distribution-card"
import {
  eventVolume,
  failureReasons,
  latencyBuckets,
  nodeGroups,
  probeVolume,
  resolution,
  sloTargets,
} from "./sample-data"

const percent = (value: number, digits = 0) =>
  formatStat(value, { style: "percent", digits })

/** 图表卡片的标题区：标题 + 说明，右侧可放指标行。 */
function SummaryHeader({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children?: ReactNode
}) {
  return (
    <ChartCardHeader>
      <div className="flex flex-col gap-1">
        <ChartCardTitle>{title}</ChartCardTitle>
        <ChartCardDescription>{description}</ChartCardDescription>
      </div>
      {children}
    </ChartCardHeader>
  )
}

/** 拨测记录：按拨测类型堆叠的拨测量 + 异常原因占比。 */
function RecordsSummary() {
  const text = useAppShellLabels()
  const total = probeVolume.reduce(
    (sum, row) => sum + row.http + row.tcp + row.dns + row.ping,
    0,
  )
  const failed = failureReasons.reduce((sum, item) => sum + item.value, 0)

  return (
    <section
      data-slot="app-shell-records-summary"
      aria-label={text.pageSummary}
      className="grid gap-4 @3xl:grid-cols-3"
    >
      <ChartCard className="@3xl:col-span-2">
        <SummaryHeader
          title={text.probeVolume}
          description={text.probeVolumeDescription}
        >
          <ChartMetrics>
            <ChartMetric label={text.metricTotal} value={formatStat(total)} />
            <ChartMetric
              label={text.metricSuccessRate}
              value={percent(((total - failed) / total) * 100, 1)}
            />
            <ChartMetric label={text.metricFailed} value={failed} />
          </ChartMetrics>
        </SummaryHeader>
        <ChartCardContent className="flex-1">
          <ChartSeries
            type="bar"
            stacked
            className="h-full min-h-52"
            data={probeVolume}
            xKey="hour"
            series={[
              { key: "http", label: text.probeHttp, tone: "blue" },
              { key: "tcp", label: text.probeTcp, tone: "violet" },
              { key: "dns", label: text.probeDns, tone: "cyan" },
              { key: "ping", label: text.probePing, tone: "amber" },
            ]}
            label={text.probeVolumeLabel}
          />
        </ChartCardContent>
      </ChartCard>
      <DistributionCard
        title={text.failureReasons}
        description={text.failureReasonsDescription}
        segments={failureReasons}
        totalLabel={text.failureReasonsTotal}
        ariaLabel={formatLabel(text.failureReasonsLabel, { total: failed })}
      />
    </section>
  )
}

/** 达标率越低颜色越重：不低于 95% 用绿色，否则琥珀。 */
function sloTone(value: number): DataTone {
  return value >= 95 ? "green" : "amber"
}

/** 接口探测：耗时分布直方图 + 三档分位的 SLO 达标环。 */
function InterfacesSummary() {
  const text = useAppShellLabels()

  return (
    <section
      data-slot="app-shell-interfaces-summary"
      aria-label={text.pageSummary}
      className="grid gap-4 @3xl:grid-cols-3"
    >
      <ChartCard className="@3xl:col-span-2">
        <SummaryHeader
          title={text.latencyDistribution}
          description={text.latencyDistributionDescription}
        />
        <ChartCardContent className="flex-1">
          <ChartSeries
            type="bar"
            className="h-full min-h-52"
            data={latencyBuckets}
            xKey="bucket"
            series={[
              {
                key: "count",
                label: text.latencyDistributionSeries,
                tone: "blue",
              },
            ]}
            label={text.latencyDistributionLabel}
          />
        </ChartCardContent>
      </ChartCard>
      <ChartCard>
        <SummaryHeader
          title={text.sloAttainment}
          description={text.sloAttainmentDescription}
        />
        <ChartCardContent className="flex flex-1 items-center justify-between gap-2">
          {sloTargets.map((slo) => (
            <div
              key={slo.id}
              className="flex flex-col items-center gap-3 text-center"
            >
              <MiniRing
                value={slo.value}
                size={64}
                thickness={11}
                tone={sloTone(slo.value)}
                label={formatLabel(text.sloRingLabel, {
                  name: slo.label,
                  percent: percent(slo.value),
                })}
              />
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{slo.label}</span>
                <span className="text-xs whitespace-nowrap text-muted-foreground">
                  {slo.target}
                </span>
              </div>
            </div>
          ))}
        </ChartCardContent>
      </ChartCard>
    </section>
  )
}

/** 资源使用率越高颜色越重：85% 以上玫红、70% 以上琥珀，其余用传入的基础色。 */
function usageTone(value: number, base: DataTone): DataTone {
  return value >= 85 ? "rose" : value >= 70 ? "amber" : base
}

/** 节点监控：每个区域一张卡片，两个进度环分别是 CPU 与内存使用率。 */
function NodesSummary() {
  const text = useAppShellLabels()

  return (
    <section
      data-slot="app-shell-nodes-summary"
      aria-label={text.nodeResources}
      className="grid gap-4 @min-[480px]:grid-cols-2 @min-[960px]:grid-cols-4"
    >
      {nodeGroups.map((node) => {
        const healthy =
          node.online === node.total && Math.max(node.cpu, node.memory) < 70
        const rings = [
          { id: "cpu", name: text.nodeCpu, value: node.cpu, base: "blue" },
          {
            id: "memory",
            name: text.nodeMemory,
            value: node.memory,
            base: "violet",
          },
        ] as const
        return (
          <StatCard key={node.id}>
            <StatHeader>
              <StatLabel>{node.name}</StatLabel>
              <StatBadge status={healthy ? "ok" : "watch"}>
                {healthy ? text.stateHealthy : text.stateWarning}
              </StatBadge>
            </StatHeader>
            <div className="flex items-start justify-around gap-3 py-2">
              {rings.map((ring) => (
                <div
                  key={ring.id}
                  className="flex flex-col items-center gap-2 text-xs text-muted-foreground"
                >
                  <MiniRing
                    value={ring.value}
                    size={68}
                    thickness={11}
                    tone={usageTone(ring.value, ring.base)}
                    label={formatLabel(text.nodeRingLabel, {
                      name: node.name,
                      metric: ring.name,
                      percent: percent(ring.value),
                    })}
                  >
                    <span className="text-xs font-semibold text-foreground">
                      {percent(ring.value)}
                    </span>
                  </MiniRing>
                  {ring.name}
                </div>
              ))}
            </div>
            <StatMeta>
              <span>
                {formatLabel(text.nodeOnline, {
                  online: node.online,
                  total: node.total,
                })}
              </span>
            </StatMeta>
          </StatCard>
        )
      })}
    </section>
  )
}

/** 事件与异常：按级别堆叠的事件趋势 + 异常事件的处理进度。 */
function EventsSummary() {
  const text = useAppShellLabels()
  const errors = eventVolume.reduce((sum, row) => sum + row.error, 0)
  const warnings = eventVolume.reduce((sum, row) => sum + row.warning, 0)
  const recoveredRatio = (resolution.recovered / errors) * 100

  return (
    <section
      data-slot="app-shell-events-summary"
      aria-label={text.pageSummary}
      className="grid gap-4 @3xl:grid-cols-3"
    >
      <ChartCard className="@3xl:col-span-2">
        <SummaryHeader
          title={text.eventsTrend}
          description={text.eventsTrendDescription}
        >
          <ChartMetrics>
            <ChartMetric label={text.eventsTotal} value={errors + warnings} />
            <ChartMetric label={text.eventError} value={errors} tone="rose" />
            <ChartMetric
              label={text.eventWarning}
              value={warnings}
              tone="amber"
            />
          </ChartMetrics>
        </SummaryHeader>
        <ChartCardContent className="flex-1">
          <ChartSeries
            type="bar"
            stacked
            className="h-full min-h-52"
            data={eventVolume}
            xKey="hour"
            series={[
              { key: "error", label: text.eventError, tone: "rose" },
              { key: "warning", label: text.eventWarning, tone: "amber" },
            ]}
            label={text.eventsTrendLabel}
          />
        </ChartCardContent>
      </ChartCard>
      <ChartCard>
        <SummaryHeader
          title={text.resolution}
          description={text.resolutionDescription}
        />
        <ChartCardContent className="flex flex-1 flex-col items-center justify-center gap-6">
          <MiniRing
            value={recoveredRatio}
            size={128}
            thickness={9}
            tone="green"
            label={formatLabel(text.resolutionLabel, {
              percent: percent(recoveredRatio),
            })}
          >
            <span className="text-2xl font-semibold">
              {percent(recoveredRatio)}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {text.resolutionRecovered}
            </span>
          </MiniRing>
          <ChartMetrics>
            <ChartMetric
              label={text.resolutionRecovered}
              value={resolution.recovered}
              tone="green"
            />
            <ChartMetric
              label={text.resolutionInProgress}
              value={resolution.inProgress}
              tone="amber"
            />
            <ChartMetric
              label={text.resolutionPending}
              value={resolution.pending}
              tone="rose"
            />
          </ChartMetrics>
        </ChartCardContent>
      </ChartCard>
    </section>
  )
}

/** 按导航项 id 取对应页面的数据摘要；没有定制摘要的页面返回 null。 */
function PageSummary({ id }: { id: string }) {
  switch (id) {
    case "records":
      return <RecordsSummary />
    case "interfaces":
      return <InterfacesSummary />
    case "nodes":
      return <NodesSummary />
    case "events":
      return <EventsSummary />
    default:
      return null
  }
}

export {
  EventsSummary,
  InterfacesSummary,
  NodesSummary,
  PageSummary,
  RecordsSummary,
}
