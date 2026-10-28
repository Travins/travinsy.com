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

// 数据：同一镜像、同一组参数，只改上下文上限与 Engram 表位置；vLLM 启动时报告的 KV 容量
const DATA = [
  { limit: "256K", host: 59.35, gpu: 24.39 },
  { limit: "1M", host: 15.75, gpu: 4.04 },
]

const SERIES = [
  { key: "host", label: "Engram 在主机内存", tone: "blue" },
  { key: "gpu", label: "Engram 在 GPU", tone: "amber" },
] as const

const COLUMNS = [
  { key: "setup", header: "配置" },
  { key: "tokens", header: "KV cache（token）", align: "end" },
  { key: "paths", header: "满长并发", align: "end" },
] as const

const ROWS = [
  {
    tone: "blue",
    setup: "256K · 主机内存",
    tokens: "15,557,833",
    paths: "59.35",
  },
  { tone: "amber", setup: "256K · GPU", tokens: "6,393,940", paths: "24.39" },
  {
    tone: "blue",
    setup: "1M · 主机内存",
    tokens: "16,510,091",
    paths: "15.75",
  },
  { tone: "amber", setup: "1M · GPU", tokens: "4,237,386", paths: "4.04" },
] as const

/** KV 容量折算成「能同时放下几个满长请求」，对比上下文上限与 Engram 表位置。 */
export function KvCapacity() {
  return (
    <div className="not-prose my-6">
      <ChartCard>
        <ChartCardHeader>
          <div className="flex flex-col gap-1">
            <ChartCardTitle>满长请求能并发几路</ChartCardTitle>
            <ChartCardDescription>
              KV 容量除以上限，vLLM 启动时的估计值，不是压测结果
            </ChartCardDescription>
          </div>
        </ChartCardHeader>
        <ChartCardContent className="flex flex-col gap-6">
          <ChartSeries
            type="bar"
            data={DATA}
            xKey="limit"
            series={[...SERIES]}
            format={{ compact: false, digits: 2 }}
            barSize={44}
            className="h-52"
            label="不同上下文上限与 Engram 表位置下，满长请求并发路数的柱状图：256K 下主机内存 59.35 路、GPU 24.39 路；1M 下主机内存 15.75 路、GPU 4.04 路"
          />
          <ChartTable columns={[...COLUMNS]} rows={[...ROWS]} />
        </ChartCardContent>
      </ChartCard>
    </div>
  )
}
