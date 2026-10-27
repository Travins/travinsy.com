"use client"

import * as React from "react"
import {
  IsometricMark,
  type IsometricShape,
} from "@/registry/ui/isometric-mark/isometric-mark"

// 本站标志「易」：坐标与站点 SVG 标志相同
const MARK_SHAPES: readonly IsometricShape[] = [
  {
    outer: [
      [156, 130],
      [416, 0],
      [416, 36],
      [156, 166],
    ],
  },
  {
    outer: [
      [156, 192],
      [416, 62],
      [416, 98],
      [156, 228],
    ],
  },
  {
    outer: [
      [156, 254],
      [416, 124],
      [416, 160],
      [156, 290],
    ],
  },
  {
    outer: [
      [0, 394],
      [416, 186],
      [416, 258],
      [0, 466],
    ],
  },
  {
    outer: [
      [78, 453],
      [416, 284],
      [416, 356],
      [78, 525],
    ],
  },
  {
    outer: [
      [156, 512],
      [416, 382],
      [416, 454],
      [156, 584],
    ],
  },
]

const GUIDES = [
  { value: "edges", label: "沿边" },
  { value: "box", label: "包围盒" },
  { value: "off", label: "关闭" },
] as const

type Guides = (typeof GUIDES)[number]["value"]

/** 一行滑块：标签、数值与范围输入框 */
function Control({
  label,
  value,
  unit,
  min,
  max,
  step,
  onChange,
}: {
  label: string
  value: number
  unit: string
  min: number
  max: number
  step: number
  onChange: (value: number) => void
}) {
  const id = React.useId()
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between text-xs">
        <label htmlFor={id} className="text-muted-foreground">
          {label}
        </label>
        <span className="font-mono tabular-nums">
          {value}
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

// 调试面板：拖动滑块实时调整朝向、挤出高度与辅助线
export default function IsometricMarkPlaygroundDemo() {
  const [rotation, setRotation] = React.useState(0)
  const [depth, setDepth] = React.useState(70)
  const [guides, setGuides] = React.useState<Guides>("edges")

  return (
    <div className="grid w-full max-w-3xl gap-6 sm:grid-cols-[minmax(0,1fr)_13rem]">
      <div className="flex min-h-80 items-center justify-center">
        <div className="w-full max-w-sm">
          <IsometricMark
            shapes={MARK_SHAPES}
            rotation={rotation}
            depth={depth}
            guides={guides === "off" ? false : guides}
            label="易"
          />
        </div>
      </div>
      <div className="flex flex-col gap-5 self-center rounded-lg border border-edge bg-card p-4">
        <Control
          label="朝向 rotation"
          value={rotation}
          unit="°"
          min={-180}
          max={180}
          step={1}
          onChange={setRotation}
        />
        <Control
          label="挤出高度 depth"
          value={depth}
          unit=""
          min={0}
          max={160}
          step={1}
          onChange={setDepth}
        />
        <fieldset className="flex flex-col gap-1.5">
          <legend className="mb-1.5 text-xs text-muted-foreground">
            辅助线 guides
          </legend>
          <div className="flex gap-1">
            {GUIDES.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={guides === option.value}
                onClick={() => setGuides(option.value)}
                className="h-7 flex-1 rounded-md border border-edge text-xs text-muted-foreground aria-pressed:border-primary aria-pressed:bg-primary/10 aria-pressed:text-foreground"
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>
        <code className="block rounded-md bg-muted px-2 py-1.5 font-mono text-[11px] leading-5 break-all text-muted-foreground">
          {`rotation={${rotation}} depth={${depth}}${guides === "off" ? "" : ` guides="${guides}"`}`}
        </code>
      </div>
    </div>
  )
}
