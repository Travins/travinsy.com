"use client"

import { Suspense } from "react"

import { cn } from "@/lib/utils"
import { registryExamples } from "@/registry/__index__"

// 未指定时缩略图取 `${name}-demo`；基础演示太素的组件在这里换成专为封面设计的示例。
const thumbnailExamples: Record<string, string> = {
  "flow-diagram": "flow-diagram-showcase-demo",
  orbit: "orbit-icons-demo",
  ripple: "ripple-reach-demo",
  greeting: "greeting-showcase-demo",
  "grid-layout": "grid-layout-showcase-demo",
  "local-time": "local-time-showcase-demo",
  "stat-card": "stat-card-showcase-demo",
  "mini-chart": "mini-chart-showcase-demo",
  "chart-card": "chart-card-showcase-demo",
  timeline: "timeline-showcase-demo",
  "card-stack": "card-stack-showcase-demo",
  globe: "globe-showcase-demo",
  "isometric-mark": "isometric-mark-showcase-demo",
  checklist: "checklist-demo",
  "shuffle-grid": "shuffle-grid-demo",
  "glyph-field": "glyph-field-showcase-demo",
  "code-stack": "code-stack-demo",
  marquee: "marquee-demo",
  "text-animate": "text-animate-showcase-demo",
}

// 封面示例自己适应缩略图的大小：`*:` 开头的类作用在示例的根元素上，让它直接铺满整张缩略图，不再缩放。
const fillExample = "size-full *:size-full! *:max-w-none!"
// 其余示例固定演示的布局宽度，缩小后的内容始终留在卡片的裁切区域内。
const previewClasses: Record<string, string> = {
  "flow-diagram": fillExample,
  orbit: fillExample,
  ripple: fillExample,
  greeting: fillExample,
  "grid-layout": fillExample,
  "local-time": fillExample,
  "stat-card": fillExample,
  "mini-chart": fillExample,
  "chart-card": fillExample,
  timeline: fillExample,
  "card-stack": fillExample,
  globe: fillExample,
  checklist: "w-96 scale-[0.72]",
  "shuffle-grid": "w-96 scale-[0.68]",
  "glyph-field": fillExample,
  "code-stack": fillExample,
  marquee: fillExample,
  "text-animate": fillExample,
  "isometric-mark": fillExample,
}

export function ComponentThumbnail({
  name,
  label,
}: {
  name: string
  label: string
}) {
  const Preview = registryExamples[thumbnailExamples[name] ?? `${name}-demo`]

  return (
    // 缩略图是可交互的实时演示（悬停、点击都生效），跳转只交给下方的标题区
    <div
      role="group"
      aria-label={label}
      className="flex h-64 min-w-0 items-center justify-center overflow-hidden bg-muted/20 sm:h-72"
    >
      <div
        className={cn(
          "flex shrink-0 items-center justify-center",
          previewClasses[name] ?? "w-96 scale-75",
        )}
      >
        <Suspense fallback={<div className="h-24 w-48 rounded-md bg-muted" />}>
          {Preview ? <Preview /> : null}
        </Suspense>
      </div>
    </div>
  )
}
