"use client"

import * as React from "react"
import { RotateCcw, SlidersHorizontal } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  IsometricMarkTuningContext,
  type IsometricMarkTuning,
  type IsometricMaterial,
} from "@/registry/ui/isometric-mark/isometric-mark"
import { IconTip } from "./icon-tip"

/**
 * 等轴测标志文档专用的调整面板：开关放在示例标题栏，打开后示例下方出现滑块，
 * 通过 IsometricMarkTuningContext 覆盖示例里所有 IsometricMark 的朝向、俯仰、高度与辅助线。
 * 打开时启用固定画框（stableFrame），调整中容器高度不变、图形缩放适应。
 */

type Values = {
  rotation?: number
  elevation?: number
  depth?: number
  guides?: "edges" | "box" | "off"
  material?: IsometricMaterial
}

const MATERIALS: { value: IsometricMaterial; label: string }[] = [
  { value: "hatch", label: "斜纹 /" },
  { value: "hatch-reverse", label: "斜纹 \\" },
  { value: "cross", label: "网纹" },
  { value: "dots", label: "点阵" },
  { value: "lines", label: "横纹" },
  { value: "plain", label: "素面" },
]

const GUIDES = [
  { value: "edges", label: "沿边" },
  { value: "box", label: "包围盒" },
  { value: "off", label: "关闭" },
] as const

export function useIsometricTuner() {
  const [open, setOpen] = React.useState(false)
  const [values, setValues] = React.useState<Values>({})
  const tuning: IsometricMarkTuning = open
    ? {
        stableFrame: true,
        rotation: values.rotation,
        elevation: values.elevation,
        depth: values.depth,
        material: values.material,
        guides:
          values.guides === undefined
            ? undefined
            : values.guides === "off"
              ? false
              : values.guides,
      }
    : {}
  // 没设置的项不覆盖，示例保留自己的值
  for (const key of Object.keys(tuning) as (keyof IsometricMarkTuning)[]) {
    if (tuning[key] === undefined) delete tuning[key]
  }
  return { open, setOpen, values, setValues, tuning }
}

export function IsometricTunerToggle({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <IconTip label={open ? "收起调整面板" : "调整角度与高度"}>
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

function Slider({
  label,
  value,
  fallback,
  unit,
  min,
  max,
  onChange,
}: {
  label: string
  value: number | undefined
  fallback: number
  unit: string
  min: number
  max: number
  onChange: (value: number) => void
}) {
  const id = React.useId()
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <div className="flex items-baseline justify-between text-xs">
        <label htmlFor={id} className="text-muted-foreground">
          {label}
        </label>
        <span className="font-mono tabular-nums">
          {value === undefined ? "示例值" : `${value}${unit}`}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={1}
        value={value ?? fallback}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-primary"
      />
    </div>
  )
}

export function IsometricTunerPanel({
  values,
  onChange,
}: {
  values: Values
  onChange: (values: Values) => void
}) {
  const set = (patch: Values) => onChange({ ...values, ...patch })
  const code = [
    values.rotation !== undefined && `rotation={${values.rotation}}`,
    values.elevation !== undefined && `elevation={${values.elevation}}`,
    values.depth !== undefined && `depth={${values.depth}}`,
    values.material !== undefined && `material="${values.material}"`,
    values.guides !== undefined &&
      (values.guides === "off"
        ? "guides={false}"
        : `guides="${values.guides}"`),
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div className="grid gap-4 border-t border-edge bg-muted/20 p-4 sm:grid-cols-[repeat(3,minmax(0,1fr))_auto] sm:items-end">
      <Slider
        label="朝向 rotation"
        value={values.rotation}
        fallback={0}
        unit="°"
        min={-180}
        max={180}
        onChange={(rotation) => set({ rotation })}
      />
      <Slider
        label="俯仰 elevation"
        value={values.elevation}
        fallback={35}
        unit="°"
        min={5}
        max={85}
        onChange={(elevation) => set({ elevation })}
      />
      <Slider
        label="挤出高度 depth"
        value={values.depth}
        fallback={40}
        unit=""
        min={0}
        max={160}
        onChange={(depth) => set({ depth })}
      />
      <div className="flex items-center gap-1">
        {GUIDES.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={values.guides === option.value}
            onClick={() => set({ guides: option.value })}
            className="h-7 rounded-md border border-edge px-2 text-xs text-muted-foreground aria-pressed:border-primary aria-pressed:bg-primary/10 aria-pressed:text-foreground"
          >
            {option.label}
          </button>
        ))}
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
      <div className="flex flex-wrap items-center gap-1 sm:col-span-4">
        <span className="mr-1 text-xs text-muted-foreground">
          材质 material
        </span>
        {MATERIALS.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={values.material === option.value}
            onClick={() => set({ material: option.value })}
            className="h-7 rounded-md border border-edge px-2 font-mono text-xs text-muted-foreground aria-pressed:border-primary aria-pressed:bg-primary/10 aria-pressed:text-foreground"
          >
            {option.label}
          </button>
        ))}
      </div>
      <code className="font-mono text-[11px] text-muted-foreground sm:col-span-4">
        {code || "拖动滑块覆盖示例里的属性，未拖动的项保留示例原值"}
      </code>
    </div>
  )
}

export function IsometricTunerProvider({
  tuning,
  children,
}: {
  tuning: IsometricMarkTuning
  children: React.ReactNode
}) {
  return (
    <IsometricMarkTuningContext.Provider value={tuning}>
      {children}
    </IsometricMarkTuningContext.Provider>
  )
}
