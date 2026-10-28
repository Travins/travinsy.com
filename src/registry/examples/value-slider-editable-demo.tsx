"use client"

import * as React from "react"
import { Info } from "lucide-react"

import { ValueSlider } from "@/registry/ui/value-slider/value-slider"

const DEFAULTS = { width: 1920, height: 1080, quality: 85 }

const formatPx = (value: number) => `${value}px`
const formatPercent = (value: number) => `${value}%`

/** 估算体积：像素数 × 质量系数，固定一位小数，服务端与客户端算出来一样 */
function estimateSize(width: number, height: number, quality: number) {
  return ((width * height * (quality / 100)) / 1_000_000).toFixed(1)
}

/**
 * 直接输入示例：导出尺寸卡片。三条滑块都开了 `editable`，点读数（或在手柄上按回车）
 * 就能敲数字；改过的项用 `modified` 把标签挑到前景色，一眼看出哪几项此时不是默认值。
 */
export default function ValueSliderEditableDemo() {
  const [width, setWidth] = React.useState(DEFAULTS.width)
  const [height, setHeight] = React.useState(DEFAULTS.height)
  const [quality, setQuality] = React.useState(DEFAULTS.quality)

  return (
    <div className="w-full max-w-sm rounded-xl border border-edge bg-background p-4 shadow-xs">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-sm font-medium">导出图片</p>
        <p className="font-mono text-[11px] text-muted-foreground">PNG</p>
      </div>
      <div className="mt-3 rounded-lg border border-edge bg-muted/20 p-3 text-center">
        <p className="font-mono text-base tabular-nums">
          {width} × {height}
        </p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          约 {estimateSize(width, height, quality)} MB · 质量 {quality}%
        </p>
      </div>
      <div className="mt-3 flex flex-col gap-2">
        <ValueSlider
          label="宽度"
          min={480}
          max={3840}
          step={40}
          largeStep={400}
          editable
          modified={width !== DEFAULTS.width}
          value={width}
          onValueChange={setWidth}
          formatValue={formatPx}
        />
        <ValueSlider
          label="高度"
          min={480}
          max={2160}
          step={40}
          largeStep={400}
          editable
          modified={height !== DEFAULTS.height}
          value={height}
          onValueChange={setHeight}
          formatValue={formatPx}
        />
        <ValueSlider
          label="质量"
          min={40}
          max={100}
          step={1}
          editable
          modified={quality !== DEFAULTS.quality}
          value={quality}
          onValueChange={setQuality}
          formatValue={formatPercent}
        />
      </div>
      <p className="mt-3 flex items-start gap-1.5 text-[11px] text-muted-foreground">
        <Info className="mt-px size-3 shrink-0" aria-hidden="true" />
        点右侧读数可以直接敲数字，回车确认、Esc
        放弃；数字会夹在范围内并对齐到步长。
      </p>
    </div>
  )
}
