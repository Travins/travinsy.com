"use client"

import type { ReactNode } from "react"
import { SlidersHorizontal } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { IconTip } from "../icon-tip"
import {
  ControlPanel,
  ControlPanelActions,
  ControlPanelCopy,
  ControlPanelGroup,
  ControlPanelHeader,
  ControlPanelReset,
  ControlPanelTitle,
  formatJsx,
} from "@/registry/ui/control-panel/control-panel"
import { SegmentedControl } from "@/registry/ui/segmented-control/segmented-control"
import { TonePicker } from "@/registry/ui/tone-picker/tone-picker"
import { ToggleSwitch } from "@/registry/ui/toggle-switch/toggle-switch"
import { ValueSlider } from "@/registry/ui/value-slider/value-slider"
import type {
  AnyTunerConfig,
  TunerControl,
  TunerValue,
  TunerValues,
} from "./types"

const SPAN_CLASS = {
  1: "",
  2: "sm:col-span-2",
  3: "sm:col-span-3",
} as const

/** 读数：步长小于 1 的保留两位小数，否则一位，再接上单位 */
function formatReadout(value: number, step: number, unit = "") {
  const scale = step < 1 ? 100 : 10
  return `${Math.round(value * scale) / scale}${unit}`
}

/**
 * 「复制为代码」：把面板上每一项的当前值（改动过的、示例回报的、默认的）交给 toTuning 换成组件属性，
 * 再去掉与默认值相同的项，只留下这次真正区别于组件默认的属性。
 * toTuning 用 `tone: false` 表示「不上色」，对组件来说就是不传 tone，所以也省略。
 */
function buildCode(
  config: AnyTunerConfig,
  current: (key: string) => TunerValue | undefined,
) {
  const all: TunerValues = {}
  for (const control of config.controls) all[control.key] = current(control.key)
  const props = config.toTuning(all) as Record<string, unknown>
  const defaults = config.toTuning(config.defaults) as Record<string, unknown>
  const kept: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || (key === "tone" && value === false)) continue
    if (JSON.stringify(value) === JSON.stringify(defaults[key])) continue
    kept[key] = value
  }
  return formatJsx(config.component ?? "Component", kept)
}

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
 * 按控件描述渲染面板，控件全部来自 registry 里的方条控件系列（数值滑块、分段选择、色调选择、开关），
 * 面板本身就是这套控件的现场示例。没改动的项显示示例回报的实际值，改动过的项标成 modified。
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
  // 开关排在滑块与选项之后，读起来先是「调多少」，再是「开不开」
  const controls = [
    ...config.controls.filter((control) => control.type !== "switch"),
    ...config.controls.filter((control) => control.type === "switch"),
  ]

  const renderControl = (control: TunerControl) => {
    const modified = values[control.key] !== undefined
    switch (control.type) {
      case "slider": {
        const step = control.step ?? 1
        return (
          <ValueSlider
            variant="compact"
            label={control.label}
            value={Number(current(control.key) ?? control.min)}
            min={control.min}
            max={control.max}
            step={step}
            elasticity={6}
            editable
            modified={modified}
            formatValue={(value) => formatReadout(value, step, control.unit)}
            onValueChange={(value) => set(control.key, value)}
          />
        )
      }
      case "segmented":
        return (
          <SegmentedControl
            variant="compact"
            label={control.label}
            options={control.options.map((option) => ({
              value: option.value,
              label: option.label,
              icon: option.swatch,
            }))}
            value={(current(control.key) as string | undefined) ?? ""}
            modified={modified}
            onValueChange={(value) => set(control.key, value)}
          />
        )
      case "tone":
        return (
          <TonePicker
            variant="compact"
            label={control.label}
            options={control.options}
            value={(current(control.key) as string | undefined) ?? ""}
            modified={modified}
            onValueChange={(value) => set(control.key, value)}
          />
        )
      case "switch":
        return (
          <ToggleSwitch
            variant="compact"
            label={control.label}
            checked={Boolean(current(control.key))}
            modified={modified}
            onCheckedChange={(checked) => set(control.key, checked)}
          />
        )
    }
  }

  return (
    <ControlPanel className="rounded-none border-0 border-t bg-transparent">
      <ControlPanelHeader className="h-9 border-b-0 pb-0">
        <ControlPanelTitle>调整参数</ControlPanelTitle>
        <ControlPanelActions>
          {config.component ? (
            <ControlPanelCopy
              label="复制当前参数为代码"
              code={() => buildCode(config, current)}
            />
          ) : null}
          <ControlPanelReset
            label="恢复示例原值"
            onClick={() => onChange({})}
          />
        </ControlPanelActions>
      </ControlPanelHeader>
      <ControlPanelGroup columns={3} className="pt-1">
        {controls.map((control) => (
          <div
            key={control.key}
            className={cn("min-w-0", SPAN_CLASS[control.span ?? 1])}
          >
            {renderControl(control)}
          </div>
        ))}
      </ControlPanelGroup>
    </ControlPanel>
  )
}
