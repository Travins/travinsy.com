"use client"

import {
  ChartCard,
  ChartCardContent,
  ChartCardDescription,
  ChartCardHeader,
  ChartCardTitle,
  ChartSeries,
  ChartTable,
} from "@/registry/ui/chart-card/chart-card"

// 数据：1017 版为正式口径 3 轮均值（17.4K 为 2 轮），原生产 0909 版为筛选阶段单轮；输出 tok/s
const DATA = [
  { scene: "短·C16", now: 753.5, before: 716.9 },
  { scene: "短·C32", now: 996.5, before: 902.6 },
  { scene: "1K·C50", now: 1402.5, before: 1199.9 },
  { scene: "1K·C100", now: 1692.1, before: 1340.0 },
  { scene: "17K·C10", now: 389.8, before: 216.6 },
]

const SERIES = [
  { key: "now", label: "1017 版", tone: "blue" },
  { key: "before", label: "原生产 0909 版", tone: "amber" },
] as const

const COLUMNS = [
  { key: "scene", header: "场景" },
  { key: "gain", header: "提升", align: "end" },
  { key: "ttft", header: "TTFT P50 / P95", align: "end" },
  { key: "tpot", header: "TPOT P50", align: "end" },
] as const

const ROWS = [
  {
    scene: "256/128 · C16",
    gain: "+5%",
    ttft: "0.17 / 1.14 s",
    tpot: "19.3 ms",
  },
  {
    scene: "256/128 · C32",
    gain: "+10%",
    ttft: "0.26 / 0.68 s",
    tpot: "29.6 ms",
  },
  {
    scene: "1K/1K · C50",
    gain: "+17%",
    ttft: "0.37 / 3.05 s",
    tpot: "30.1 ms",
  },
  {
    scene: "1K/1K · C100",
    gain: "+26%",
    ttft: "0.63 / 8.02 s",
    tpot: "47.4 ms",
  },
  {
    scene: "17.4K/1K · C10",
    gain: "+80%",
    ttft: "1.95 / 7.22 s",
    tpot: "21.1 ms",
  },
] as const

/** 正式口径下 1017 版与原生产的输出吞吐，附同一轮的延迟。 */
export function ReleaseGain() {
  return (
    <div className="not-prose my-6">
      <ChartCard>
        <ChartCardHeader>
          <div className="flex flex-col gap-1">
            <ChartCardTitle>1017 版对原生产的输出吞吐</ChartCardTitle>
            <ChartCardDescription>
              tok/s。1017 版每轮 300 请求、3 轮均值；原生产是单轮
            </ChartCardDescription>
          </div>
        </ChartCardHeader>
        <ChartCardContent className="flex flex-col gap-6">
          {/* 5 组柱在窄屏放不下全部刻度，给最小宽度，在卡片内横向滚动 */}
          <div className="overflow-x-auto">
            <div className="min-w-[460px]">
              <ChartSeries
                type="bar"
                data={DATA}
                xKey="scene"
                series={[...SERIES]}
                format={{ compact: false, digits: 0 }}
                className="h-64"
                label="1017 版与原生产输出吞吐对比柱状图：短请求并发 16 为 754 对 717，并发 32 为 997 对 903；1K 并发 50 为 1403 对 1200，并发 100 为 1692 对 1340；17.4K 输入并发 10 为 390 对 217"
              />
            </div>
          </div>
          <ChartTable columns={[...COLUMNS]} rows={[...ROWS]} />
        </ChartCardContent>
      </ChartCard>
    </div>
  )
}
