"use client"

import type { ReactNode } from "react"
import { RotateCcw, SlidersHorizontal } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { IconTip } from "../icon-tip"
import { Segmented, Slider, Toggle } from "./controls"
import type { AnyTunerConfig, TunerValue, TunerValues } from "./types"

const SPAN_CLASS = {
  1: "",
  2: "sm:col-span-2",
  3: "sm:col-span-3",
} as const

/** 示例标题栏里的开关按钮 */
export function TunerToggle({
  config,
  open,
  onOpenChange,
}: {
  config: AnyTunerConfig
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <IconTip label={open ? "收起调整面板" : config.hint}>
      <button
        type="button"
        aria-pressed={open}
        aria-label="调整面板"
        onClick={() => onOpenChange(!open)}
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "text-muted-foreground hover:text-foreground aria-pressed:bg-muted aria-pressed:text-foreground",
        )}
      >
        <SlidersHorizontal className="size-4" />
      </button>
    </IconTip>
  )
}

/** 把覆盖项交给组件导出的 Context；该组件不支持调整时原样渲染 */
export function TunerProvider({
  config,
  tuning,
  children,
}: {
  config?: AnyTunerConfig
  tuning: Record<string, unknown>
  children: ReactNode
}) {
  if (!config) return children
  return (
    <config.context.Provider value={tuning}>{children}</config.context.Provider>
  )
}

/**
 * 按控件描述渲染面板：滑块与分段按钮按声明顺序排进三列网格，开关统一排在最后一行，右侧是恢复按钮。
 * 没改动的项显示示例回报的实际值（灰色），改动后高亮。
 */
export function TunerPanel({
  config,
  values,
  base,
  onChange,
}: {
  config: AnyTunerConfig
  values: TunerValues
  base: TunerValues | null
  onChange: (values: TunerValues) => void
}) {
  const current = (key: string): TunerValue | undefined =>
    values[key] ?? base?.[key] ?? config.defaults[key]
  const set = (key: string, value: TunerValue) =>
    onChange({ ...values, [key]: value })
  const fields = config.controls.filter((control) => control.type !== "switch")
  const switches = config.controls.filter(
    (control) => control.type === "switch",
  )

  return (
    <div className="grid gap-x-6 gap-y-4 px-4 pt-3 pb-4 sm:grid-cols-3">
      {fields.map((control) => {
        const span = SPAN_CLASS[control.span ?? 1]
        const field =
          control.type === "slider" ? (
            <Slider
              label={control.label}
              value={Number(current(control.key) ?? control.min)}
              unit={control.unit}
              min={control.min}
              max={control.max}
              step={control.step}
              changed={values[control.key] !== undefined}
              onChange={(value) => set(control.key, value)}
            />
          ) : control.type === "segmented" ? (
            <Segmented
              label={control.label}
              options={control.options}
              value={current(control.key) as string | undefined}
              onChange={(value) => set(control.key, value)}
            />
          ) : null
        return (
          <div key={control.key} className={cn("min-w-0", span)}>
            {field}
          </div>
        )
      })}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:col-span-3">
        {switches.map((control) => (
          <Toggle
            key={control.key}
            label={control.label}
            checked={Boolean(current(control.key))}
            onChange={(checked) => set(control.key, checked)}
          />
        ))}
        <span className="flex-1" />
        <IconTip label="恢复示例原值">
          <button
            type="button"
            aria-label="恢复示例原值"
            onClick={() => onChange({})}
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon-sm" }),
              "text-muted-foreground",
            )}
          >
            <RotateCcw className="size-3.5" />
          </button>
        </IconTip>
      </div>
    </div>
  )
}
