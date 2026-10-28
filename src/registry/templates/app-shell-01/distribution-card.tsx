"use client"

import { formatStat, type DataTone } from "@/registry/lib/data-display"
import {
  ChartCard,
  ChartCardContent,
  ChartCardDescription,
  ChartCardHeader,
  ChartCardTitle,
  ChartLegendGrid,
} from "@/registry/ui/chart-card/chart-card"
import { MiniDonut } from "@/registry/ui/mini-chart/mini-chart"

type DistributionSegment = {
  label: string
  value: number
  tone: DataTone
}

type DistributionCardProps = {
  title: string
  description: string
  segments: readonly DistributionSegment[]
  /** 环中央合计数字下方的小字，如「总请求」 */
  totalLabel: string
  /** 读屏名称，描述这张环形图表示什么 */
  ariaLabel: string
  className?: string
}

/** 占比卡片：环形图中央是合计，下方的图例格给出各分类的占比。概览的状态码分布与拨测的异常原因共用。 */
function DistributionCard({
  title,
  description,
  segments,
  totalLabel,
  ariaLabel,
  className,
}: DistributionCardProps) {
  const total = segments.reduce((sum, item) => sum + item.value, 0)

  return (
    <ChartCard data-slot="app-shell-distribution-card" className={className}>
      <ChartCardHeader>
        <div className="flex flex-col gap-1">
          <ChartCardTitle>{title}</ChartCardTitle>
          <ChartCardDescription>{description}</ChartCardDescription>
        </div>
      </ChartCardHeader>
      <ChartCardContent className="flex flex-1 flex-col items-center justify-center gap-6">
        <MiniDonut
          size={136}
          thickness={26}
          segments={segments.map(({ label, value, tone }) => ({
            label,
            value,
            tone,
          }))}
          label={ariaLabel}
        >
          <span className="text-lg font-semibold">{formatStat(total)}</span>
          <span className="text-[11px] text-muted-foreground">{totalLabel}</span>
        </MiniDonut>
        <ChartLegendGrid
          className="w-full"
          items={segments.map(({ label, value, tone }) => ({
            label,
            tone,
            value: formatStat((value / total) * 100, {
              style: "percent",
              digits: 1,
            }),
          }))}
        />
      </ChartCardContent>
    </ChartCard>
  )
}

export { DistributionCard }
export type { DistributionCardProps, DistributionSegment }
