"use client"

import { formatStat } from "@/registry/lib/data-display"
import {
  ChartCard,
  ChartCardContent,
  ChartCardDescription,
  ChartCardFooter,
  ChartCardHeader,
  ChartCardTitle,
  ChartGauge,
  ChartMetric,
  ChartMetrics,
  ChartRanking,
} from "@/registry/ui/chart-card/chart-card"

import { formatLabel, useAppShellLabels } from "./config"
import { DistributionCard } from "./distribution-card"
import { errorBudget, slowestEndpoints, statusCodes } from "./sample-data"

type CardProps = { className?: string }

/** 百分比文字：可用率这类接近 100 的数值保留两位小数 */
const percent = (value: number, digits = 0) =>
  formatStat(value, { style: "percent", digits })

/** 错误预算：刻度仪表显示 30 天窗口里还剩多少，底部写明已消耗的分钟数。 */
function ErrorBudgetCard({ className }: CardProps) {
  const text = useAppShellLabels()
  const remaining = Math.round(
    (1 - errorBudget.usedMinutes / errorBudget.totalMinutes) * 100,
  )

  return (
    <ChartCard data-slot="app-shell-error-budget" className={className}>
      <ChartCardHeader>
        <div className="flex flex-col gap-1">
          <ChartCardTitle>{text.errorBudget}</ChartCardTitle>
          <ChartCardDescription>
            {formatLabel(text.errorBudgetDescription, {
              target: percent(errorBudget.target, 2),
            })}
          </ChartCardDescription>
        </div>
      </ChartCardHeader>
      <ChartCardContent className="flex flex-1 flex-col items-center justify-center gap-5">
        <ChartGauge
          value={remaining}
          tone="green"
          caption={text.errorBudgetRemaining}
          className="size-40"
          label={formatLabel(text.errorBudgetLabel, {
            percent: percent(remaining),
          })}
        />
        <ChartMetrics>
          <ChartMetric
            label={text.errorBudgetTarget}
            value={percent(errorBudget.target, 2)}
          />
          <ChartMetric
            label={text.errorBudgetCurrent}
            value={percent(errorBudget.current, 2)}
            tone="green"
          />
        </ChartMetrics>
      </ChartCardContent>
      <ChartCardFooter>
        {formatLabel(text.errorBudgetUsed, {
          used: errorBudget.usedMinutes,
          total: errorBudget.totalMinutes,
        })}
      </ChartCardFooter>
    </ChartCard>
  )
}

/** 状态码分布：环形图中央放总请求数，旁边的图例格给出各类占比。 */
function StatusCodeCard({ className }: CardProps) {
  const text = useAppShellLabels()
  const total = formatStat(statusCodes.reduce((sum, item) => sum + item.value, 0))

  return (
    <DistributionCard
      className={className}
      title={text.statusCodes}
      description={text.statusCodesDescription}
      segments={statusCodes}
      totalLabel={text.statusCodesTotal}
      ariaLabel={formatLabel(text.statusCodesLabel, { total })}
    />
  )
}

/** 越慢颜色越重：超过 1 s 用玫红、超过 500 ms 用琥珀，其余用蓝色。 */
function slownessTone(latency: number) {
  return latency > 1000 ? "rose" : latency > 500 ? "amber" : "blue"
}

/** 最慢接口排行：横向排名条，条末是 P95 耗时。 */
function SlowestEndpointsCard({ className }: CardProps) {
  const text = useAppShellLabels()

  return (
    <ChartCard data-slot="app-shell-slowest-endpoints" className={className}>
      <ChartCardHeader>
        <div className="flex flex-col gap-1">
          <ChartCardTitle>{text.slowestEndpoints}</ChartCardTitle>
          <ChartCardDescription>
            {text.slowestEndpointsDescription}
          </ChartCardDescription>
        </div>
      </ChartCardHeader>
      <ChartCardContent className="flex flex-1 flex-col justify-center">
        <ChartRanking
          items={slowestEndpoints.map(({ label, value }) => ({
            label,
            value,
            tone: slownessTone(value),
          }))}
          // 默认视口 lg 起图例并排；卡片只占 2/3 宽，改为图例在下方，主区域够宽（@5xl）再并排
          className="lg:grid-cols-1 @5xl:grid-cols-2"
          format={{ style: "number", compact: false, digits: 0 }}
          label={text.slowestEndpointsLabel}
        />
      </ChartCardContent>
    </ChartCard>
  )
}

export { ErrorBudgetCard, SlowestEndpointsCard, StatusCodeCard }
