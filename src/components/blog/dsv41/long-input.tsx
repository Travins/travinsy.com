"use client"

import {
  ChartCard,
  ChartCardContent,
  ChartCardDescription,
  ChartCardHeader,
  ChartCardTitle,
  ChartSeries,
} from "@/registry/ui/chart-card/chart-card"

// 数据：并发 1，输出 16 token，每档 10 个请求；1017 版对 0909 版。预填充吞吐换算成千 tok/s，避免纵轴出现「1万」这类取整后重复的刻度
const TTFT = [
  { input: "64K", v1017: 5.5, v0909: 14.3 },
  { input: "128K", v1017: 12.2, v0909: 31.0 },
  { input: "240K", v1017: 25.1, v0909: 64.6 },
]

const PREFILL = [
  { input: "64K", v1017: 12.0, v0909: 4.6 },
  { input: "128K", v1017: 10.7, v0909: 4.2 },
  { input: "240K", v1017: 9.8, v0909: 3.8 },
]

const SERIES = [
  { key: "v1017", label: "1017 版", tone: "blue" },
  { key: "v0909", label: "0909 版", tone: "amber" },
] as const

/** 长输入的首 token 延迟与预填充吞吐，随输入长度变化。 */
export function LongInput() {
  return (
    <div className="not-prose my-6">
      <ChartCard>
        <ChartCardHeader>
          <div className="flex flex-col gap-1">
            <ChartCardTitle>长输入的首 token 与预填充</ChartCardTitle>
            <ChartCardDescription>
              并发 1，输出 16 token，每档 10 个请求，输入长度与目标精确一致
            </ChartCardDescription>
          </div>
        </ChartCardHeader>
        <ChartCardContent className="grid gap-6 sm:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-2">
            <p className="text-xs text-muted-foreground">
              TTFT P50（秒），越低越好
            </p>
            <ChartSeries
              data={TTFT}
              xKey="input"
              series={[...SERIES]}
              format={{ compact: false, digits: 1 }}
              className="h-56"
              label="首 token 延迟随输入长度变化的折线图：64K 输入 1017 版 5.5 秒、0909 版 14.3 秒；128K 为 12.2 与 31.0 秒；240K 为 25.1 与 64.6 秒"
            />
          </div>
          <div className="flex min-w-0 flex-col gap-2">
            <p className="text-xs text-muted-foreground">
              预填充吞吐（千 tok/s），越高越好
            </p>
            <ChartSeries
              data={PREFILL}
              xKey="input"
              series={[...SERIES]}
              format={{ compact: false, digits: 1 }}
              className="h-56"
              label="预填充吞吐随输入长度变化的折线图：64K 输入 1017 版 12.0 千 tok/s、0909 版 4.6 千 tok/s；128K 为 10.7 与 4.2；240K 为 9.8 与 3.8"
            />
          </div>
        </ChartCardContent>
      </ChartCard>
    </div>
  )
}
