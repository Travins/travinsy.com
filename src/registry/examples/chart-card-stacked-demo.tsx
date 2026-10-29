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
import { formatDay } from "@/registry/lib/data-display"

const DATA = Array.from({ length: 28 }, (_, index) => ({
  day: `2026-02-${String(index + 1).padStart(2, "0")}`,
  fast: Math.round(5200 + 1400 * Math.sin(index * 0.5) + index * 40),
  slow: Math.round(520 + 380 * Math.abs(Math.sin(index * 1.3))),
}))

export default function ChartCardStackedDemo() {
  return (
    <ChartCard className="w-full max-w-3xl">
      <ChartCardHeader className="sm:items-center">
        <div className="flex flex-col gap-1">
          <ChartCardTitle>api.yiui.dev</ChartCardTitle>
          <ChartCardDescription>实例 ID：edge-hk-01</ChartCardDescription>
        </div>
        <ChartMetrics>
          <ChartMetric label="平均响应" value="42 ms" />
          <ChartMetric label="慢请求" value="1,243 次" />
          <ChartMetric label="可用率" value="99.97%" />
        </ChartMetrics>
      </ChartCardHeader>
      <ChartCardContent>
        <ChartSeries
          type="bar"
          stacked
          data={DATA}
          xKey="day"
          series={[
            { key: "fast", label: "快请求", tone: "green" },
            { key: "slow", label: "慢请求", tone: "rose" },
          ]}
          xTickFormatter={(value) => formatDay(value, "short")}
          labelFormatter={(value) => formatDay(value, "long")}
          className="h-60"
          label="2 月每天快、慢请求数量堆叠柱图"
        />
      </ChartCardContent>
    </ChartCard>
  )
}
