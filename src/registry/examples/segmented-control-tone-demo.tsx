"use client"

import * as React from "react"

import { flowToneStyle } from "@/registry/ui/flow-diagram/tone"
import { SegmentedControl } from "@/registry/ui/segmented-control/segmented-control"

/** 三个时间范围各一份固定数据，柱子高度是百分比 */
const RANGES = [
  {
    value: "7d",
    label: "7 天",
    bars: [38, 52, 44, 68, 58, 82, 74],
    total: "1,284",
  },
  {
    value: "30d",
    label: "30 天",
    bars: [46, 62, 55, 71, 64, 88, 79],
    total: "5,610",
  },
  {
    value: "1y",
    label: "一年",
    bars: [24, 34, 30, 48, 44, 62, 58],
    total: "68,942",
  },
] as const

const OPTIONS = RANGES.map((range) => ({
  value: range.value,
  label: range.label,
}))

const WEEKDAYS = ["一", "二", "三", "四", "五", "六", "日"]

/**
 * 色调示例：访问量卡片上的时间范围切换。`tone="blue"` 只给选中块染上一档淡蓝，
 * 根元素上的 `--flow-tone` 也让柱子跟着变——下面这条柱状图自己读取同一个变量。
 */
export default function SegmentedControlToneDemo() {
  const [range, setRange] = React.useState<string>("30d")
  const active = RANGES.find((item) => item.value === range) ?? RANGES[0]
  // 最高的一根用实色，其余淡一档
  const peak = Math.max(...active.bars)

  return (
    <div className="w-full max-w-sm rounded-xl border border-edge bg-background p-4 shadow-xs">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-sm font-medium">访问量</p>
        <p className="font-mono text-xs tabular-nums">{active.total}</p>
      </div>
      <div className="mt-3">
        <SegmentedControl
          aria-label="时间范围"
          tone="blue"
          size="sm"
          options={OPTIONS}
          value={range}
          onValueChange={setRange}
        />
      </div>
      <div
        className="mt-3 flex h-24 items-end gap-1.5"
        style={flowToneStyle("blue")}
      >
        {active.bars.map((height, index) => (
          <span
            key={WEEKDAYS[index]}
            className={`flex-1 rounded-t-[2px] ${
              height === peak ? "bg-(--flow-tone)" : "bg-(--flow-tone)/30"
            }`}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <div className="mt-1.5 flex gap-1.5">
        {WEEKDAYS.map((day) => (
          <span
            key={day}
            className="flex-1 text-center text-[10px] text-muted-foreground"
          >
            {day}
          </span>
        ))}
      </div>
    </div>
  )
}
