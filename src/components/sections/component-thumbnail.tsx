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
  "stat-card": "max-lg:scale-[0.62]",
  "mini-chart": "max-lg:scale-[0.85]",
  "chart-card": "max-lg:scale-[0.55]",
  timeline: "max-lg:scale-[0.85]",
  "card-stack": "max-lg:scale-90",
  "text-animate": "max-lg:scale-75",
  "isometric-mark": "scale-90 max-lg:scale-[0.8]",
  orbit: "max-lg:scale-[0.85]",
}

/**
 * 本身就是满幅背景的示例：铺满画框、去掉自身的圆角与边框，不留内边距。
 * `*:` 作用在示例根元素上，`**:data-[slot=…]` 让示例里固定高度的画布跟着撑满。
 */
const fillClasses: Record<string, string> = {
  "glyph-field":
    "*:h-full *:rounded-none **:data-[slot=glyph-field]:h-full",
  // 窄屏画框只有 20rem 高，地球再往下沉一些，免得压到左上的指标
  globe:
    "*:h-full! *:max-w-none *:rounded-none *:border-0 max-lg:**:data-[slot=globe]:translate-y-[62%]",
}

export function ComponentThumbnail({
  name,
  label,
}: {
  name: string
  label: string
}) {
  const Preview = registryExamples[firstExamples[name] ?? `${name}-demo`]
  const fill = fillClasses[name]

  return (
    // 缩略图是可交互的实时演示（悬停、点击都生效），跳转只交给下方的标题区
    <div
      role="group"
      aria-label={label}
      className={cn(
        "relative flex h-80 min-w-0 items-center justify-center overflow-hidden bg-muted/20 lg:aspect-[16/10] lg:h-auto",
        !fill && "px-6",
      )}
    >
      <div
        className={cn(
          fill
            ? cn("absolute inset-0 flex", fill)
            : "flex w-full shrink-0 items-center justify-center",
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
