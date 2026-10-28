"use client"

import * as React from "react"

import { XyPad } from "@/registry/ui/xy-pad/xy-pad"

/** 初始光源：偏左上，投影落向右下 */
const DEFAULT_LIGHT = { x: 30, y: 74 }

const percent = (value: number) => `${value}%`

/**
 * 默认示例：拖动光点给一张卡片打光。十字线位置同时决定投影方向与高光落点——
 * 光源在左上时高光在左上、投影落向右下；阴影与光晕都用 `color-mix` 配主题变量。
 */
export default function XyPadDemo() {
  const [light, setLight] = React.useState(DEFAULT_LIGHT)
  // 光源相对中心的方向：投影永远落在光源的反面
  const dx = (light.x - 50) / 50
  const dy = (light.y - 50) / 50
  const shadowX = Math.round(-dx * 18)
  const shadowY = Math.round(dy * 18)
  const lightPosition = `${light.x}% ${100 - light.y}%`

  return (
    // 用容器查询而不是视口断点：列表缩略图里这块只有 300 多像素宽，不能跟着视口分栏
    <div className="@container w-full max-w-lg">
      <div className="grid overflow-hidden rounded-xl border border-edge bg-background shadow-xs @min-[26rem]:grid-cols-[minmax(0,1fr)_15rem]">
        <div className="relative flex min-h-44 items-center justify-center overflow-hidden border-b border-edge bg-muted/20 p-6 @min-[26rem]:border-e @min-[26rem]:border-b-0">
          {/* 环境光：从光源位置往外晕开的一层暖色 */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at ${lightPosition}, color-mix(in oklab, var(--flow-amber) 28%, transparent), transparent 72%)`,
            }}
          />
          <div
            className="relative w-40 rounded-lg border border-edge bg-background p-3 transition-shadow duration-150 ease-out motion-reduce:transition-none"
            style={{
              boxShadow: `${shadowX}px ${shadowY}px 24px -6px color-mix(in oklab, var(--foreground) 42%, transparent), ${shadowX / 2}px ${shadowY / 2}px 8px -3px color-mix(in oklab, var(--foreground) 26%, transparent), ${-shadowX * 0.6}px ${-shadowY * 0.6}px 26px color-mix(in oklab, var(--flow-amber) 28%, transparent)`,
            }}
          >
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="size-7 shrink-0 rounded-md bg-(--flow-amber)/20 ring-1 ring-(--flow-amber)/45 ring-inset"
              />
              <div className="min-w-0 flex-1">
                <span
                  aria-hidden="true"
                  className="block h-1.5 w-11 rounded-full bg-foreground/25"
                />
                <span
                  aria-hidden="true"
                  className="mt-1.5 block h-1.5 w-16 rounded-full bg-foreground/12"
                />
              </div>
            </div>
            <span
              aria-hidden="true"
              className="mt-3 block h-1.5 w-full rounded-full bg-foreground/10"
            />
            <span
              aria-hidden="true"
              className="mt-1.5 block h-1.5 w-2/3 rounded-full bg-foreground/10"
            />
            {/* 打在卡片表面的高光，跟着光源一起走 */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-lg"
              style={{
                backgroundImage: `radial-gradient(circle at ${lightPosition}, color-mix(in oklab, var(--flow-amber) 24%, transparent), transparent 64%)`,
              }}
            />
          </div>
        </div>
        <div className="flex items-center justify-center p-3">
          <XyPad
            label="光源"
            tone="amber"
            value={light}
            onValueChange={setLight}
            x={{ min: 0, max: 100, step: 1, label: "水平", format: percent }}
            y={{ min: 0, max: 100, step: 1, label: "高度", format: percent }}
            className="mx-auto w-full max-w-56 @min-[26rem]:max-w-none"
          />
        </div>
      </div>
    </div>
  )
}
