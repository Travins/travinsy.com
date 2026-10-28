"use client"

import {
  ChartCard,
  ChartCardContent,
  ChartCardDescription,
  ChartCardHeader,
  ChartCardTitle,
  ChartSeries,
} from "@/registry/ui/chart-card/chart-card"

// 数据：1017 版权重，输出 tok/s，单轮、每档 100 请求
// vLLM v0.32.0 与 SGLang lmsysorg/sglang:nightly-dev-cu13-20261014-684fea8a
const DATA = [
  { scene: "短·C32", vllm: 1122.8, sglang: 617.4 },
  { scene: "1K·C10", vllm: 862.4, sglang: 607.7 },
  { scene: "1K·C50", vllm: 1439.5, sglang: 848.2 },
  { scene: "1K·C100", vllm: 1666.9, sglang: 846.1 },
  { scene: "17K·C10", vllm: 367.6, sglang: 174.0 },
]

const SERIES = [
  { key: "vllm", label: "vLLM v0.32.0", tone: "blue" },
  { key: "sglang", label: "SGLang nightly-dev-cu13-20261014", tone: "amber" },
] as const

/** 同一模型、同一台机器上，vLLM 与 SGLang 最好镜像的输出吞吐。 */
export function EngineCompare() {
  return (
    <div className="not-prose my-6">
      <ChartCard>
        <ChartCardHeader>
          <div className="flex flex-col gap-1">
            <ChartCardTitle>vLLM 对 SGLang 的输出吞吐</ChartCardTitle>
            <ChartCardDescription>
              tok/s，单轮、每档 100 请求。短 = 256/128，1K = 1K/1K，17K =
              17.4K/1K
            </ChartCardDescription>
          </div>
        </ChartCardHeader>
        <ChartCardContent>
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
                label="vLLM 与 SGLang 输出吞吐对比柱状图：短请求并发 32 为 1123 对 617；1K 并发 10、50、100 分别为 862 对 608、1440 对 848、1667 对 846；17.4K 输入并发 10 为 368 对 174"
              />
            </div>
          </div>
        </ChartCardContent>
      </ChartCard>
    </div>
  )
}
