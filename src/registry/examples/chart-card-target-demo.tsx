import {
  ChartCard,
  ChartCardContent,
  ChartCardDescription,
  ChartCardHeader,
  ChartCardTitle,
  ChartGauge,
  ChartSeries,
} from "@/registry/ui/chart-card/chart-card"

// 正值是今年，负值是去年同期，用 diverging 堆叠让它们分别向上、向下
const DATA = [
  { month: "1月", year2026: 21, year2025: -13 },
  { month: "2月", year2026: 10, year2025: -16 },
  { month: "3月", year2026: 13, year2025: -14 },
  { month: "4月", year2026: 12, year2025: -10 },
  { month: "5月", year2026: 20, year2025: -17 },
  { month: "6月", year2026: 12, year2025: -13 },
  { month: "7月", year2026: 15, year2025: -12 },
]

export default function ChartCardTargetDemo() {
  return (
    <ChartCard className="w-full max-w-3xl lg:grid lg:grid-cols-5">
      <div className="flex flex-col border-b border-edge lg:col-span-3 lg:border-r lg:border-b-0">
        <ChartCardHeader className="border-b-0 pb-0">
          <div className="flex flex-col gap-1">
            <ChartCardTitle>每月新增订阅</ChartCardTitle>
            <ChartCardDescription>
              今年与去年同期对比（人）
            </ChartCardDescription>
          </div>
        </ChartCardHeader>
        <ChartCardContent className="flex-1">
          <ChartSeries
            type="bar"
            stacked="diverging"
            data={DATA}
            xKey="month"
            series={[
              { key: "year2026", label: "2026 年", tone: "primary" },
              { key: "year2025", label: "2025 年", tone: "chart-3" },
            ]}
            yDomain={[-20, 30]}
            yTicks={[-20, -10, 0, 10, 20, 30]}
            barSize={14}
            className="h-60"
            label="今年与去年同期每月新增订阅对比"
          />
        </ChartCardContent>
      </div>
      <div className="flex flex-col lg:col-span-2">
        <ChartCardHeader className="border-b-0 pb-0">
          <div className="flex flex-col gap-1">
            <ChartCardTitle>年度目标</ChartCardTitle>
            <ChartCardDescription>目标 2,000 人</ChartCardDescription>
          </div>
        </ChartCardHeader>
        <ChartCardContent className="flex flex-1 flex-col items-center justify-center gap-4">
          <ChartGauge
            value={78}
            caption="已完成"
            label="年度订阅目标完成 78%"
          />
          <p className="text-xs text-muted-foreground">
            较去年同期多{" "}
            <span className="font-medium text-foreground tabular-nums">
              62%
            </span>
          </p>
        </ChartCardContent>
      </div>
    </ChartCard>
  )
}
