"use client"

import * as React from "react"
import { RotateCcw, SlidersHorizontal } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  IsometricMarkTuningContext,
  type IsometricMarkReport,
  type IsometricMarkTuning,
  type IsometricMaterial,
} from "@/registry/ui/isometric-mark/isometric-mark"
import { IconTip } from "./icon-tip"

/**
 * 等轴测标志文档专用的调整面板：开关放在示例标题栏，打开后示例下方出现滑块，
 * 通过 IsometricMarkTuningContext 覆盖示例里所有 IsometricMark 的朝向、俯仰、高度、辅助线与材质。
 * 示例通过 onReport 回报自己的实际取值，没拖动的项显示这个值。
 * 打开时启用固定画框（stableFrame）：沿用示例原来的画框，调整中容器大小与图形比例都不变。
 */

type Guides = "edges" | "box" | "off"

type Values = {
  rotation?: number
  elevation?: number
  depth?: number
  guides?: Guides
  material?: IsometricMaterial
}

const MATERIALS: { value: IsometricMaterial; label: string }[] = [
  { value: "hatch", label: "斜纹" },
  { value: "hatch-reverse", label: "反斜纹" },
  { value: "cross", label: "网纹" },
  { value: "dots", label: "点阵" },
  { value: "lines", label: "横纹" },
  { value: "plain", label: "素面" },
]

const GUIDES: { value: Guides; label: string }[] = [
  { value: "edges", label: "沿边" },
  { value: "box", label: "包围盒" },
  { value: "off", label: "关闭" },
]

export function useIsometricTuner() {
  const [open, setOpen] = React.useState(false)
  const [values, setValues] = React.useState<Values>({})
  const [base, setBase] = React.useState<IsometricMarkReport | null>(null)
  // 一个示例里可能有多个标志，只记第一个回报的值
  const onReport = React.useCallback(
    (report: IsometricMarkReport) => setBase((prev) => prev ?? report),
    [],
  )
  const setOpenAndReset = React.useCallback((next: boolean) => {
    setOpen(next)
    if (!next) setBase(null)
  }, [])

  const tuning: IsometricMarkTuning = open
    ? {
        stableFrame: true,
        onReport,
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
  return { open, setOpen: setOpenAndReset, values, setValues, base, tuning }
}

export function IsometricTunerToggle({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <IconTip label={open ? "收起调整面板" : "调整角度、高度与材质"}>
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

const round = (value: number) => Math.round(value * 10) / 10

function Slider({
  label,
  value,
  unit,
  min,
  max,
  changed,
  onChange,
}: {
  label: string
  value: number
  unit: string
  min: number
  max: number
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
          {round(value)}
          {unit}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-primary"
      />
    </div>
  )
}

/** 材质小样：16px 的方块里平铺对应纹理，与组件顶面的线型一致 */
function MaterialSwatch({ material }: { material: IsometricMaterial }) {
  const id = React.useId()
  const s = 4
  const slash = `M-1 1l2-2M0 ${s}l${s}-${s}M${s - 1} ${s + 1}l2-2`
  const back = `M-1 ${s - 1}l2 2M0 0l${s} ${s}M${s - 1}-1l2 2`
  const tile: Record<IsometricMaterial, React.ReactNode> = {
    hatch: <path d={slash} />,
    "hatch-reverse": <path d={back} />,
    cross: <path d={slash + back} />,
    dots: <circle cx={s / 2} cy={s / 2} r={0.7} fill="currentColor" />,
    lines: <path d={`M0 ${s / 2}H${s}`} />,
    plain: null,
  }
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="size-4 shrink-0 rounded-[3px] border border-edge bg-background text-muted-foreground"
    >
      <defs>
        <pattern id={id} width={s} height={s} patternUnits="userSpaceOnUse">
          <g stroke="currentColor" strokeWidth={0.6}>
            {tile[material]}
          </g>
        </pattern>
      </defs>
      <rect width="16" height="16" fill={`url(#${id})`} />
    </svg>
  )
}

/** 一组互斥的小按钮 */
function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  render,
}: {
  label: string
  options: { value: T; label: string }[]
  value: T | undefined
  onChange: (value: T) => void
  render?: (value: T) => React.ReactNode
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
            {render?.(option.value)}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function IsometricTunerPanel({
  values,
  base,
  onChange,
}: {
  values: Values
  base: IsometricMarkReport | null
  onChange: (values: Values) => void
}) {
  const set = (patch: Values) => onChange({ ...values, ...patch })
  const current = {
    rotation: values.rotation ?? base?.rotation ?? 0,
    elevation: values.elevation ?? base?.elevation ?? 35.26,
    depth: values.depth ?? base?.depth ?? 40,
    guides:
      values.guides ??
      (base ? (base.guides === false ? "off" : base.guides) : undefined),
    material: values.material ?? base?.material,
  }
  const code = [
    `rotation={${round(current.rotation)}}`,
    `elevation={${round(current.elevation)}}`,
    `depth={${round(current.depth)}}`,
    current.material && `material="${current.material}"`,
    current.guides &&
      (current.guides === "off"
        ? "guides={false}"
        : `guides="${current.guides}"`),
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div className="grid gap-x-6 gap-y-4 px-4 pt-3 pb-4 sm:grid-cols-3">
      <Slider
        label="朝向 rotation"
        value={current.rotation}
        unit="°"
        min={-180}
        max={180}
        changed={values.rotation !== undefined}
        onChange={(rotation) => set({ rotation })}
      />
      <Slider
        label="俯仰 elevation"
        value={current.elevation}
        unit="°"
        min={5}
        max={85}
        changed={values.elevation !== undefined}
        onChange={(elevation) => set({ elevation })}
      />
      <Slider
        label="挤出高度 depth"
        value={current.depth}
        unit=""
        min={0}
        max={160}
        changed={values.depth !== undefined}
        onChange={(depth) => set({ depth })}
      />
      <div className="sm:col-span-2">
        <Segmented
          label="材质 material"
          options={MATERIALS}
          value={current.material}
          onChange={(material) => set({ material })}
          render={(material) => <MaterialSwatch material={material} />}
        />
      </div>
      <Segmented
        label="辅助线 guides"
        options={GUIDES}
        value={current.guides}
        onChange={(guides) => set({ guides })}
      />
      <div className="flex items-center gap-2 sm:col-span-3">
        <code className="min-w-0 flex-1 truncate rounded-md bg-muted px-2 py-1.5 font-mono text-[11px] text-muted-foreground">
          {code}
        </code>
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
