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

// 取消订阅记为负数，stacked="diverging" 会把它画在零线下方
const WEEKS = [
  { week: "08/03", joined: 86, left: -12 },
  { week: "08/10", joined: 92, left: -18 },
  { week: "08/17", joined: 78, left: -9 },
  { week: "08/24", joined: 105, left: -22 },
  { week: "08/31", joined: 118, left: -15 },
  { week: "09/07", joined: 96, left: -26 },
  { week: "09/14", joined: 124, left: -14 },
  { week: "09/21", joined: 131, left: -19 },
  { week: "09/28", joined: 109, left: -31 },
  { week: "10/05", joined: 142, left: -17 },
  { week: "10/12", joined: 138, left: -21 },
  { week: "10/19", joined: 156, left: -13 },
]

export default function ChartCardDivergingDemo() {
  return (
    <ChartCard className="w-full max-w-3xl">
      <ChartCardHeader className="sm:items-center">
        <div className="flex flex-col gap-1">
          <ChartCardTitle>订阅变化</ChartCardTitle>
          <ChartCardDescription>近 12 周 · 每周新增与取消</ChartCardDescription>
        </div>
        <ChartMetrics>
          <ChartMetric label="新增" value="1,375" tone="green" />
          <ChartMetric label="取消" value="217" tone="rose" />
          <ChartMetric label="净增" value="1,158" />
        </ChartMetrics>
      </ChartCardHeader>
      <ChartCardContent>
        <ChartSeries
          type="bar"
          stacked="diverging"
          data={WEEKS}
          xKey="week"
          series={[
            { key: "joined", label: "新增订阅", tone: "green" },
            { key: "left", label: "取消订阅", tone: "rose" },
          ]}
          yDomain={[-40, 160]}
          yTicks={[-40, 0, 40, 80, 120, 160]}
          className="h-60"
          label="近 12 周每周新增与取消订阅人数对比柱图"
        />
      </ChartCardContent>
    </ChartCard>
  )
}
