"use client"

import * as React from "react"

import { flowToneStyle, type FlowTone } from "@/registry/lib/flow-tone"
import { TonePicker, toneOptions } from "@/registry/ui/tone-picker/tone-picker"

const TONES = toneOptions()

const SERIES = [
  {
    id: "visits",
    label: "访问",
    tone: "blue" as FlowTone,
    values: [42, 58, 51, 74],
  },
  {
    id: "signups",
    label: "注册",
    tone: "violet" as FlowTone,
    values: [28, 36, 44, 52],
  },
  {
    id: "orders",
    label: "下单",
    tone: "amber" as FlowTone,
    values: [18, 22, 26, 31],
  },
] as const

type SeriesId = (typeof SERIES)[number]["id"]

const QUARTERS = ["Q1", "Q2", "Q3", "Q4"]

const INITIAL = Object.fromEntries(
  SERIES.map((item) => [item.id, item.tone as string]),
) as Record<SeriesId, string>

/**
 * 多行示例：图表三组数据的配色。`variant="compact"` 让三条色点选择器排成一列也不占地方，
 * 每条只管自己那一组；上面的分组柱状图读同一份 `--flow-tone`，改完立刻换色。
 */
export default function TonePickerSeriesDemo() {
  const [colors, setColors] = React.useState(INITIAL)

  return (
    <div className="w-full max-w-sm rounded-xl border border-edge bg-background p-4 shadow-xs">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-sm font-medium">季度明细</p>
        <p className="font-mono text-[11px] text-muted-foreground">2026</p>
      </div>
      <div className="mt-3 rounded-lg border border-edge bg-muted/20 p-2">
        <div className="grid h-24 grid-cols-4 gap-2">
          {QUARTERS.map((quarter, index) => (
            <div
              key={quarter}
              className="flex items-end justify-center gap-0.5"
            >
              {SERIES.map((series) => (
                <span
                  key={series.id}
                  className="w-2 rounded-t-[2px] bg-(--flow-tone)"
                  style={{
                    ...flowToneStyle(colors[series.id]),
                    height: `${series.values[index]}%`,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="mt-1.5 grid grid-cols-4 gap-2">
          {QUARTERS.map((quarter) => (
            <span
              key={quarter}
              className="text-center font-mono text-[10px] text-muted-foreground"
            >
              {quarter}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-1.5">
        {SERIES.map((series) => (
          <TonePicker
            key={series.id}
            variant="compact"
            label={series.label}
            options={TONES}
            value={colors[series.id]}
            modified={colors[series.id] !== series.tone}
            onValueChange={(tone) =>
              setColors((current) => ({ ...current, [series.id]: tone }))
            }
          />
        ))}
      </div>
    </div>
  )
}
