import {
  ChartCard,
  ChartCardContent,
  ChartCardDescription,
  ChartCardHeader,
  ChartCardTitle,
  ChartGauge,
  ChartMetric,
  ChartMetrics,
  ChartSeries,
} from "@/registry/ui/chart-card/chart-card"
import { StatBadge } from "@/registry/ui/stat-card/stat-card"
import { formatDay } from "@/registry/lib/data-display"

// 固定公式生成的演示数据：每次构建结果一致
const DATA = Array.from({ length: 21 }, (_, index) => ({
  day: `2026-10-${String(index + 1).padStart(2, "0")}`,
  installs: Math.round(420 + index * 24 + 90 * Math.sin(index * 0.7)),
  reads: Math.round(300 + index * 14 + 120 * Math.cos(index * 0.5 + 1)),
}))

export default function ChartCardTargetDemo() {
  return (
    <ChartCard className="w-full max-w-3xl">
      <ChartCardHeader className="items-center">
        <div className="flex flex-col gap-1">
          <ChartCardTitle>十月增长</ChartCardTitle>
          <ChartCardDescription className="max-sm:hidden">
            组件安装与博客阅读 · 距年度目标还差 440 人
          </ChartCardDescription>
        </div>
        <ChartMetrics>
          <ChartMetric label="组件安装" value="1.2万" tone="blue" />
          <ChartMetric label="博客阅读" value="3.9万" tone="amber" />
        </ChartMetrics>
      </ChartCardHeader>
      <div className="grid lg:grid-cols-5">
        <div className="flex flex-col items-center justify-center gap-3 border-b border-edge p-4 max-sm:flex-row max-sm:justify-between lg:col-span-2 lg:border-r lg:border-b-0">
          <ChartGauge
            value={78}
            tone="green"
            ticks={64}
            caption="年度目标"
            className="size-28 sm:size-44"
            label="年度订阅目标完成 78%"
          />
          <div className="flex items-center gap-2 text-xs text-muted-foreground max-sm:flex-col max-sm:items-start">
            <StatBadge status="ok">进度达标</StatBadge>
            <span className="whitespace-nowrap tabular-nums">
              1,560 / 2,000 人
            </span>
          </div>
        </div>
        <ChartCardContent className="lg:col-span-3">
          <ChartSeries
            type="area"
            data={DATA}
            xKey="day"
            series={[
              { key: "installs", label: "组件安装", tone: "blue" },
              { key: "reads", label: "博客阅读", tone: "amber" },
            ]}
            xTickFormatter={(value) => formatDay(value, "long")}
            labelFormatter={(value) => formatDay(value, "long")}
            className="h-44 sm:h-56"
            label="十月每日组件安装与博客阅读面积图"
          />
        </ChartCardContent>
      </div>
    </ChartCard>
  )
}
