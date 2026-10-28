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
const signedDegrees = (value: number) => (value > 0 ? `+${value}°` : `${value}°`)

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
          <svg viewBox="0 0 400 250" aria-hidden="true" className="size-full">
            <defs>
              <linearGradient id="angle-dial-demo-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--flow-blue)" stopOpacity="0.7" />
                <stop offset="58%" stopColor="var(--flow-cyan)" stopOpacity="0.46" />
                <stop offset="100%" stopColor="var(--flow-amber)" stopOpacity="0.6" />
              </linearGradient>
              <linearGradient id="angle-dial-demo-water" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--flow-cyan)" stopOpacity="0.58" />
                <stop offset="100%" stopColor="var(--flow-blue)" stopOpacity="0.4" />
              </linearGradient>
              <radialGradient id="angle-dial-demo-sun">
                <stop offset="28%" stopColor="var(--flow-amber)" stopOpacity="0.55" />
                <stop offset="100%" stopColor="var(--flow-amber)" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="400" height="250" fill="var(--muted)" />
            <rect width="400" height="250" fill="url(#angle-dial-demo-sky)" />
            {/* 太阳与它周围的光晕 */}
            <circle cx="296" cy="74" r="46" fill="url(#angle-dial-demo-sun)" />
            <circle cx="296" cy="74" r="15" fill="var(--flow-amber)" opacity="0.9" />
            {/* 两道远山 */}
            <path
              d="M0 125 L52 82 L96 112 L148 72 L204 125 Z"
              fill="var(--flow-violet)"
              opacity="0.5"
            />
            <path
              d="M132 125 L188 86 L232 114 L286 90 L400 126 Z"
              fill="var(--flow-blue)"
              opacity="0.58"
            />
            {/* 地平线：拉直时对照它看是否水平 */}
            <rect
              y="124"
              width="400"
              height="1.5"
              fill="var(--foreground)"
              opacity="0.45"
            />
            <rect y="125" width="400" height="125" fill="url(#angle-dial-demo-water)" />
            <rect y="166" width="400" height="1" fill="var(--background)" opacity="0.45" />
            <rect y="196" width="400" height="1" fill="var(--background)" opacity="0.3" />
            <rect y="228" width="400" height="1" fill="var(--background)" opacity="0.2" />
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
