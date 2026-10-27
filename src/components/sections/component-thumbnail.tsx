"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { registryExamples } from "@/registry/__index__"

/**
 * 缩略图一律展示组件详情页的第一个示例，保证列表里看到的效果在详情页都能找到。
 * 默认取 `${name}-demo`；详情页首个示例不叫这个名字的组件在这里登记（与 MDX 第一个 ComponentPreview 保持一致）。
 */
const firstExamples: Record<string, string> = {
  "chart-card": "chart-card-target-demo",
  "flow-diagram": "flow-diagram-showcase-demo",
  greeting: "greeting-card-demo",
  "local-time": "local-time-world-clock-demo",
}

/**
 * 示例按原尺寸居中展示；画框宽屏为 16:10，窄屏固定 20rem 高（aspect-ratio 与 min-height 同时设置会把宽度撑开，所以分开写）。
 * 少数示例原尺寸放不进画框，在这里单独缩小（transform 只影响视觉，不改变示例自身排版）。
 */
const fitClasses: Record<string, string> = {
  "grid-layout": "max-lg:scale-[0.6]",
  "local-time": "max-lg:scale-[0.78]",
  "stat-card": "scale-[0.85] max-lg:scale-[0.8]",
  "mini-chart": "max-lg:scale-[0.65]",
  "chart-card": "max-lg:scale-[0.55]",
  timeline: "max-lg:scale-[0.85]",
  "card-stack": "max-lg:scale-90",
  "text-animate": "max-lg:scale-75",
  "isometric-mark": "scale-90 max-lg:scale-[0.8]",
  orbit: "max-lg:scale-[0.85]",
  globe: "max-lg:scale-75",
}

export function ComponentThumbnail({
  name,
  label,
}: {
  name: string
  label: string
}) {
  const Preview = registryExamples[firstExamples[name] ?? `${name}-demo`]

  return (
    // 缩略图是可交互的实时演示（悬停、点击都生效），跳转只交给下方的标题区
    <div
      role="group"
      aria-label={label}
      className="relative flex h-80 min-w-0 lg:h-auto lg:aspect-[16/10] items-center justify-center overflow-hidden bg-muted/20 px-6"
    >
      <div
        className={cn(
          "flex w-full shrink-0 items-center justify-center",
          fitClasses[name],
        )}
      >
        <React.Suspense
          fallback={<div className="h-48 w-96 rounded-md bg-muted" />}
        >
          {Preview ? <Preview /> : null}
        </React.Suspense>
      </div>
    </div>
  )
}
