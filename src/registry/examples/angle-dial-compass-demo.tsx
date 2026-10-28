"use client"

import * as React from "react"

import { AngleDial } from "@/registry/ui/angle-dial/angle-dial"

/** 八个方位：0° 是北，顺时针每 45° 一个 */
const DIRECTIONS = ["北", "东北", "东", "东南", "南", "西南", "西", "西北"]

const directionOf = (value: number) =>
  DIRECTIONS[Math.round(value / 45) % DIRECTIONS.length]

/** 罗盘刻度：每 15° 一根，四个正方向画长一格 */
const TICKS = Array.from({ length: 24 }, (_, index) => index * 15)

/** 四个方位名，沿半径 38 摆在圆周内侧 */
const CARDINALS = [
  { label: "北", x: 60, y: 22 },
  { label: "东", x: 98, y: 60 },
  { label: "南", x: 60, y: 98 },
  { label: "西", x: 22, y: 60 },
]

/**
 * 示例：风向罗盘。范围 0–360 正好一圈，刻度尺自动首尾相接——往一端拖过头会从另一端接着走，
 * 罗盘指针与刻度尺右侧的小表盘一起转，读数旁标出八方位名。
 */
export default function AngleDialCompassDemo() {
  const [wind, setWind] = React.useState(300)

  return (
    <div className="w-full max-w-xs rounded-xl border border-edge bg-background p-4 shadow-xs">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-sm font-medium">风向</p>
        <p className="shrink-0 text-xs text-muted-foreground">
          {directionOf(wind)}风 · {wind}°
        </p>
      </div>
      <div className="mx-auto mt-3 size-40">
        <svg viewBox="0 0 120 120" aria-hidden="true" className="size-full">
          <circle
            cx="60"
            cy="60"
            r="56"
            fill="none"
            stroke="var(--edge)"
            strokeWidth="1"
          />
          {TICKS.map((degree) => (
            <line
              key={degree}
              x1="60"
              y1="4"
              x2="60"
              y2={degree % 90 === 0 ? 13 : 9}
              stroke="var(--foreground)"
              strokeOpacity={degree % 90 === 0 ? 0.55 : 0.22}
              strokeWidth="1"
              transform={`rotate(${degree} 60 60)`}
            />
          ))}
          {CARDINALS.map(({ label, x, y }) => (
            <text
              key={label}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="9"
              fill="var(--muted-foreground)"
            >
              {label}
            </text>
          ))}
          {/* 指针：0° 朝上，与罗盘上的「北」对齐 */}
          <g transform={`rotate(${wind} 60 60)`}>
            <path d="M60 34 L66 62 L60 58 L54 62 Z" fill="var(--flow-cyan)" />
            <path
              d="M60 86 L64 58 L60 62 L56 58 Z"
              fill="var(--foreground)"
              opacity="0.28"
            />
          </g>
          <circle
            cx="60"
            cy="60"
            r="2.6"
            fill="var(--background)"
            stroke="var(--edge)"
            strokeWidth="1"
          />
        </svg>
      </div>
      <AngleDial
        className="mt-3"
        label="风向"
        min={0}
        max={360}
        largeStep={45}
        tone="cyan"
        value={wind}
        onValueChange={setWind}
      />
      <p className="mt-2 text-[11px] text-muted-foreground">
        拖过 360° 会从 0° 接着走
      </p>
    </div>
  )
}
