"use client"

import { Suspense } from "react"

import { cn } from "@/lib/utils"
import { registryExamples } from "@/registry/__index__"

// 未指定时缩略图取 `${name}-demo`；基础演示太素的组件在这里换成专为封面设计的示例。
const thumbnailExamples: Record<string, string> = {
  "flow-diagram": "flow-diagram-showcase-demo",
}

// 固定演示的布局宽度，缩小后的内容始终留在卡片的裁切区域内。
// `*:` 开头的类作用在示例的根元素上：让能自适应的示例直接铺满整张缩略图，不再缩放。
const previewClasses: Record<string, string> = {
  "contribution-graph": "w-[48rem] scale-[0.38] sm:scale-[0.42]",
  "flow-diagram": "size-full *:size-full! *:max-w-none!",
  "grid-layout": "w-[32rem] scale-[0.56] sm:scale-[0.6]",
  "isometric-mark": "w-80 scale-75",
}

export function ComponentThumbnail({ name }: { name: string }) {
  const Preview = registryExamples[thumbnailExamples[name] ?? `${name}-demo`]

  return (
    <div
      aria-hidden="true"
      inert
      className="pointer-events-none flex h-64 min-w-0 items-center justify-center overflow-hidden bg-muted/20 sm:h-72"
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
