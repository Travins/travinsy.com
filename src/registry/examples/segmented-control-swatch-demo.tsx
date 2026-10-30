"use client"

import * as React from "react"

import { flowToneStyle, type FlowTone } from "@/registry/lib/flow-tone"
import { SegmentedControl } from "@/registry/ui/segmented-control/segmented-control"

/** 两个色点拼成的小样，给每个选项说明它把界面调成什么颜色 */
function Swatch({ tones }: { tones: readonly FlowTone[] }) {
  return (
    <span aria-hidden="true" className="flex items-center gap-0.5">
      {tones.map((tone) => (
        <span
          key={tone}
          className="size-2 rounded-full bg-(--flow-tone)"
          style={flowToneStyle(tone)}
        />
      ))}
    </span>
  )
}

const PRESETS = [
  {
    value: "neutral",
    label: "中性",
    primary: "foreground" as FlowTone,
    tones: ["foreground", "muted"] as const,
  },
  {
    value: "cool",
    label: "冷色",
    primary: "blue" as FlowTone,
    tones: ["blue", "cyan"] as const,
  },
  {
    value: "warm",
    label: "暖色",
    primary: "amber" as FlowTone,
    tones: ["amber", "rose"] as const,
  },
] as const

const OPTIONS = PRESETS.map((preset) => ({
  value: preset.value,
  label: preset.label,
  icon: <Swatch tones={preset.tones} />,
}))

/**
 * 小样示例：字体前的 `icon` 可以放任何东西，这里放两个色点，
 * 选项文字仍是纯中文，色点只是让「中性 / 冷色 / 暖色」一眼可辨（`aria-hidden`，不参与读屏）。
 */
export default function SegmentedControlSwatchDemo() {
  const [preset, setPreset] = React.useState<string>("cool")
  const active = PRESETS.find((item) => item.value === preset) ?? PRESETS[1]

  return (
    <div className="w-full max-w-sm rounded-xl border border-edge bg-background p-4 shadow-xs">
      <div className="flex items-baseline justify-between gap-2 pb-3">
        <p className="text-sm font-medium">配色方案</p>
        <p className="text-[11px] text-muted-foreground">界面预览</p>
      </div>
      <SegmentedControl
        aria-label="配色方案"
        options={OPTIONS}
        value={preset}
        onValueChange={setPreset}
      />
      <div
        className="mt-3 overflow-hidden rounded-lg border border-edge bg-background"
        style={flowToneStyle(active.primary)}
      >
        <div className="flex items-center gap-1.5 border-b border-edge bg-(--flow-tone)/10 px-3 py-2">
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-(--flow-tone)"
          />
          <span className="h-1.5 w-16 rounded-full bg-(--flow-tone)/50" />
        </div>
        <div className="flex flex-col gap-1.5 p-3">
          <span className="h-2 w-3/5 rounded-full bg-(--flow-tone)/60" />
          <span className="h-2 w-4/5 rounded-full bg-foreground/12" />
          <span className="h-2 w-2/5 rounded-full bg-foreground/12" />
          <div className="mt-2 flex gap-1.5">
            <span className="h-6 w-16 rounded-md bg-(--flow-tone)/20 ring-1 ring-(--flow-tone)/40 ring-inset" />
            <span className="h-6 w-12 rounded-md bg-foreground/8" />
          </div>
        </div>
      </div>
    </div>
  )
}
