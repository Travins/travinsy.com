"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import type { SegmentedOption } from "./types"

/** 数值显示：步长小于 1 的保留两位，否则一位 */
function formatNumber(value: number, step: number) {
  const scale = step < 1 ? 100 : 10
  return Math.round(value * scale) / scale
}

export function Slider({
  label,
  value,
  unit = "",
  min,
  max,
  step = 1,
  changed,
  onChange,
}: {
  label: string
  value: number
  unit?: string
  min: number
  max: number
  step?: number
  changed: boolean
  onChange: (value: number) => void
}) {
  const id = React.useId()
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <div className="flex items-baseline justify-between text-xs">
        <label htmlFor={id} className="text-muted-foreground">
          {label}
        </label>
        <span
          className={cn(
            "font-mono tabular-nums",
            !changed && "text-muted-foreground",
          )}
        >
          {formatNumber(value, step)}
          {unit}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-primary"
      />
    </div>
  )
}

/** 开关：小号滑动开关 + 文字标签 */
export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="group inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
    >
      <span className="relative inline-flex h-4 w-7 shrink-0 items-center rounded-full bg-muted ring-1 ring-edge transition-colors ring-inset group-aria-checked:bg-primary">
        <span className="size-3 translate-x-0.5 rounded-full bg-background shadow-xs transition-transform group-aria-checked:translate-x-3.5" />
      </span>
      {label}
    </button>
  )
}

/** 一组互斥的小按钮 */
export function Segmented({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: SegmentedOption[]
  value: string | undefined
  onChange: (value: string) => void
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div role="group" aria-label={label} className="flex flex-wrap gap-1">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className="inline-flex h-7 items-center gap-1.5 rounded-md border border-edge px-2 text-xs text-muted-foreground transition-colors hover:text-foreground aria-pressed:border-primary aria-pressed:bg-primary/10 aria-pressed:text-foreground"
          >
            {option.swatch}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
