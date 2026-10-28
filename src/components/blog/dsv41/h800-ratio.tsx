"use client"

import {
  ChartCard,
  ChartCardContent,
  ChartCardDescription,
  ChartCardHeader,
  ChartCardTitle,
  ChartSeries,
} from "@/registry/ui/chart-card/chart-card"

// 数据：同一模型在 H20 与 H800 上同场景压测，H20 输出吞吐占 H800 的比例，百分比；H20 一侧为 0909 版，每档 100 请求
const DATA = [
  { c: "C1", a: 84, b: 53, long: 52 },
  { c: "C10", a: 57, b: 44, long: 36 },
  { c: "C50", a: 39, b: 39, long: 29 },
  { c: "C100", a: 33, b: 31, long: 27 },
]

const SERIES = [
  { key: "a", label: "1K / 1K", tone: "blue" },
  { key: "b", label: "8K / 8K", tone: "amber" },
  { key: "long", label: "17.4K / 1K", tone: "violet" },
] as const

/** H20 占 H800 同场景输出吞吐的比例，随并发下降。 */
export function H800Ratio() {
  return (
    <div className="not-prose my-6">
      <ChartCard>
        <ChartCardHeader>
          <div className="flex flex-col gap-1">
            <ChartCardTitle>H20 占 H800 的输出吞吐比例</ChartCardTitle>
            <ChartCardDescription>
              同一模型、同一套压测场景，每档 100 请求，按并发对比
            </ChartCardDescription>
          </div>
        </ChartCardHeader>
        <ChartCardContent>
          <ChartSeries
            data={DATA}
            xKey="c"
            series={[...SERIES]}
            curve="linear"
            yDomain={[0, 100]}
            yTicks={[0, 25, 50, 75, 100]}
            format={{ style: "percent", digits: 0 }}
            className="h-60"
            label="H20 占 H800 输出吞吐比例的折线图：1K/1K 场景从并发 1 的 84% 降到并发 100 的 33%；8K/8K 从 53% 降到 31%；17.4K/1K 从 52% 降到 27%"
          />
        </ChartCardContent>
      </ChartCard>
    </div>
  )
}
