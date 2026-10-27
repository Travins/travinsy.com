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
} from "@/registry/ui/chart-card/chart-card"
import { formatDay } from "@/registry/lib/data-display"

// 固定公式生成的演示数据：每次构建结果一致
const DATA = Array.from({ length: 28 }, (_, index) => ({
  day: `2026-02-${String(index + 1).padStart(2, "0")}`,
  docs: Math.round(5200 + index * 100 + 900 * Math.sin(index * 0.8)),
  blog: Math.round(4200 + index * 50 + 700 * Math.cos(index * 0.6)),
  registry: Math.round(1800 + index * 57 + 400 * Math.sin(index * 1.1 + 1)),
}))

const SERIES = [
  { key: "docs", label: "文档", tone: "blue" },
  { key: "blog", label: "博客", tone: "amber" },
  { key: "registry", label: "组件库", tone: "green" },
] as const

const COLUMNS = [
  { key: "site", header: "栏目" },
  { key: "views", header: "访问量", align: "end" },
  { key: "duration", header: "平均停留", align: "end" },
  { key: "bounce", header: "跳出率", align: "end" },
  { key: "share", header: "占比", align: "end" },
] as const

const ROWS = [
  {
    tone: "blue",
    site: "文档",
    views: "18.4万",
    duration: "3 分 12 秒",
    bounce: "32.1%",
    share: "46.9%",
  },
  {
    tone: "amber",
    site: "博客",
    views: "13.6万",
    duration: "4 分 40 秒",
    bounce: "41.7%",
    share: "34.7%",
  },
  {
    tone: "green",
    site: "组件库",
    views: "7.2万",
    duration: "2 分 05 秒",
    bounce: "28.3%",
    share: "18.4%",
  },
] as const

export default function ChartCardDemo() {
  return (
    <ChartCard className="w-full max-w-3xl">
      <ChartCardHeader>
        <div className="flex flex-col gap-1">
          <ChartCardTitle>站点流量</ChartCardTitle>
          <ChartCardDescription>
            2026 年 2 月 · 每日页面访问量
          </ChartCardDescription>
        </div>
        <ChartMetrics>
          <ChartMetric label="总访问量" value="39.2万" />
          <ChartMetric label="日均" value="1.4万" />
        </ChartMetrics>
      </ChartCardHeader>
      <ChartCardContent className="flex flex-col gap-6">
        <ChartSeries
          data={DATA}
          xKey="day"
          series={[...SERIES]}
          xTickFormatter={(value) => formatDay(value, "long")}
          labelFormatter={(value) => formatDay(value, "long")}
          className="h-48"
          label="2 月各栏目每日访问量折线图"
        />
        <ChartTable columns={[...COLUMNS]} rows={[...ROWS]} />
      </ChartCardContent>
    </ChartCard>
  )
}
