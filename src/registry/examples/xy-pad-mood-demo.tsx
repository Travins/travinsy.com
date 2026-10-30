"use client"

import * as React from "react"

import { flowToneStyle } from "@/registry/lib/flow-tone"
import { XyPad } from "@/registry/ui/xy-pad/xy-pad"

type Mood = { x: number; y: number }

const DEFAULT_MOOD: Mood = { x: 38, y: 72 }

/** 四象限的中文名：横轴平静 → 激动，纵轴消极 → 积极 */
function describe({ x, y }: Mood) {
  if (x < 50)
    return y >= 50
      ? { name: "从容", note: "平静 · 积极" }
      : { name: "低落", note: "平静 · 消极" }
  return y >= 50
    ? { name: "雀跃", note: "激动 · 积极" }
    : { name: "烦躁", note: "激动 · 消极" }
}

/**
 * 示例：情绪坐标。两条轴各带自己的 `label` 与取值范围，纵轴往上变大；
 * 板子右上角的中文象限名随位置变化，色调也按积极 / 消极换成绿 / 玫红。
 */
export default function XyPadMoodDemo() {
  const [mood, setMood] = React.useState(DEFAULT_MOOD)
  const quadrant = describe(mood)
  const tone = mood.y >= 50 ? "green" : "rose"

  return (
    <div
      className="w-full max-w-sm rounded-xl border border-edge bg-background p-4 shadow-xs"
      style={flowToneStyle(tone)}
    >
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-sm font-medium">今天的情绪</p>
        <p className="shrink-0 text-xs font-medium text-(--flow-tone)">
          {quadrant.name}
        </p>
      </div>
      <div className="mt-3 grid grid-cols-[auto_minmax(0,1fr)] gap-x-2 gap-y-1.5">
        {/* 纵轴标签：上积极、下消极，与拖拽板上下对齐 */}
        <div className="flex flex-col justify-between py-1 text-[11px] text-muted-foreground">
          <span>积极</span>
          <span>消极</span>
        </div>
        <XyPad
          label="记录一下"
          tone={tone}
          value={mood}
          onValueChange={setMood}
          x={{ min: 0, max: 100, step: 1, label: "激动程度" }}
          y={{ min: 0, max: 100, step: 1, label: "积极程度" }}
        />
        {/* 横轴标签：左平静、右激动 */}
        <span aria-hidden="true" />
        <div className="flex justify-between text-[11px] text-muted-foreground">
          <span>平静</span>
          <span>激动</span>
        </div>
      </div>
      <p className="mt-3 border-t border-edge pt-3 text-[11px] text-muted-foreground">
        {quadrant.note} · 方向键也能调
      </p>
    </div>
  )
}
