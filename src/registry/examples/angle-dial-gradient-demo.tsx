"use client"

import * as React from "react"

import { AngleDial } from "@/registry/ui/angle-dial/angle-dial"

/** 渐变取三个内置色调，全是主题变量，亮暗与颜色主题切换时跟着变 */
const STOPS = "var(--flow-violet), var(--flow-cyan) 58%, var(--flow-amber)"

const DEFAULT_ANGLE = 135

/**
 * 示例：渐变角度。色块的 `linear-gradient` 角度直接来自滑过的刻度，
 * 下面一行是同一段 CSS；360° 一整圈，刻度尺首尾相接。
 */
export default function AngleDialGradientDemo() {
  const [angle, setAngle] = React.useState(DEFAULT_ANGLE)
  const gradient = `linear-gradient(${angle}deg, ${STOPS})`

  return (
    <div className="w-full max-w-sm rounded-xl border border-edge bg-background p-4 shadow-xs">
      <p className="text-sm font-medium">渐变角度</p>
      <div
        className="mt-3 aspect-video rounded-lg border border-edge"
        style={{ backgroundImage: gradient }}
      />
      <AngleDial
        className="mt-3"
        label="角度"
        min={0}
        max={360}
        largeStep={15}
        tone="violet"
        value={angle}
        onValueChange={setAngle}
        modified={angle !== DEFAULT_ANGLE}
      />
      <p className="mt-2 truncate font-mono text-[11px] text-muted-foreground">
        linear-gradient({angle}deg, …)
      </p>
    </div>
  )
}
