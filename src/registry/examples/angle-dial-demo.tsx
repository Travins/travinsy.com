"use client"

import * as React from "react"

import { AngleDial } from "@/registry/ui/angle-dial/angle-dial"

/** 拉直范围：±45° 够修正几乎所有的歪地平线 */
const RANGE = 45

/** 画框是 16:10，照片按同一比例画，旋转后要放大到这个倍数才能盖住四角 */
const ASPECT = 0.625

function coverScale(angle: number) {
  const radians = (Math.abs(angle) * Math.PI) / 180
  const cos = Math.cos(radians)
  const sin = Math.sin(radians)
  return Math.max(cos + ASPECT * sin, (sin + ASPECT * cos) / ASPECT)
}

/** 带符号的读数：正数补 `+`，0 就是水平 */
const signedDegrees = (value: number) =>
  value > 0 ? `+${value}°` : `${value}°`

/**
 * 默认示例：把一张歪掉的风景照拉直。照片按当前角度旋转并自动放大到刚好盖住画框，
 * 裁切框与三分线不动，地平线是否水平一眼就能看出来；双击刻度尺回到 0° 与原始构图。
 */
export default function AngleDialDemo() {
  const [angle, setAngle] = React.useState(-13)

  return (
    <div className="w-full max-w-sm rounded-xl border border-edge bg-background p-4 shadow-xs">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-sm font-medium">裁剪 · 拉直</p>
        <p className="shrink-0 text-[11px] text-muted-foreground">
          {angle === 0 ? "已水平" : "地平线倾斜"}
        </p>
      </div>
      <div className="relative mt-3 aspect-[16/10] overflow-hidden rounded-lg border border-edge bg-muted">
        <div
          className="absolute inset-0 transition-transform duration-150 ease-out motion-reduce:transition-none"
          style={{
            transform: `rotate(${angle}deg) scale(${coverScale(angle).toFixed(4)})`,
          }}
        >
          {/* 线稿风景：点阵天空、描边山脊、横线水面，只有太阳与倒影用色调，和站内其他示例同一种单色 + 一个强调色 */}
          <svg viewBox="0 0 400 250" aria-hidden="true" className="size-full">
            <defs>
              <pattern
                id="angle-dial-demo-sky"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <circle
                  cx="5"
                  cy="5"
                  r="0.8"
                  fill="var(--foreground)"
                  opacity="0.16"
                />
              </pattern>
              <pattern
                id="angle-dial-demo-water"
                width="400"
                height="9"
                patternUnits="userSpaceOnUse"
              >
                <rect
                  y="4"
                  width="400"
                  height="1"
                  fill="var(--foreground)"
                  opacity="0.12"
                />
              </pattern>
            </defs>
            <rect width="400" height="250" fill="var(--muted)" />
            <rect width="400" height="125" fill="url(#angle-dial-demo-sky)" />
            {/* 太阳：实心圆 + 一圈细环 */}
            <circle
              cx="296"
              cy="70"
              r="19"
              fill="none"
              stroke="var(--flow-amber)"
              strokeOpacity="0.45"
            />
            <circle cx="296" cy="70" r="11" fill="var(--flow-amber)" />
            {/* 远山淡、近山深，都只用前景色的透明度 */}
            <path
              d="M0 125 L52 82 L96 112 L148 72 L204 125 Z"
              fill="var(--foreground)"
              fillOpacity="0.06"
              stroke="var(--foreground)"
              strokeOpacity="0.3"
              strokeLinejoin="round"
            />
            <path
              d="M132 125 L188 92 L232 114 L286 96 L340 110 L400 100 L400 125 Z"
              fill="var(--foreground)"
              fillOpacity="0.12"
              stroke="var(--foreground)"
              strokeOpacity="0.45"
              strokeLinejoin="round"
            />
            <rect
              y="125"
              width="400"
              height="125"
              fill="url(#angle-dial-demo-water)"
            />
            {/* 太阳在水里的倒影：几段越来越短的色调横线 */}
            <rect
              x="272"
              y="140"
              width="48"
              height="2"
              rx="1"
              fill="var(--flow-amber)"
              opacity="0.7"
            />
            <rect
              x="280"
              y="158"
              width="32"
              height="2"
              rx="1"
              fill="var(--flow-amber)"
              opacity="0.5"
            />
            <rect
              x="288"
              y="176"
              width="16"
              height="2"
              rx="1"
              fill="var(--flow-amber)"
              opacity="0.35"
            />
            {/* 地平线：拉直时对照它看是否水平 */}
            <rect
              y="124"
              width="400"
              height="1.5"
              fill="var(--foreground)"
              opacity="0.7"
            />
          </svg>
        </div>
        {/* 裁切框与三分线不跟着转，用来判断地平线 */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-3 overflow-hidden rounded-sm border border-foreground/40"
        >
          <span className="absolute inset-y-0 left-1/3 w-px bg-foreground/25" />
          <span className="absolute inset-y-0 left-2/3 w-px bg-foreground/25" />
          <span className="absolute inset-x-0 top-1/3 h-px bg-foreground/25" />
          <span className="absolute inset-x-0 top-2/3 h-px bg-foreground/25" />
        </div>
      </div>
      <AngleDial
        className="mt-3"
        label="拉直"
        min={-RANGE}
        max={RANGE}
        largeStep={5}
        pixelsPerDegree={2}
        tone="amber"
        value={angle}
        onValueChange={setAngle}
        formatValue={signedDegrees}
        modified={angle !== 0}
      />
      <p className="mt-2 text-[11px] text-muted-foreground">
        拖动刻度尺，或双击回到 0°
      </p>
    </div>
  )
}
