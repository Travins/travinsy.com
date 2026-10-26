"use client"

import { Suspense } from "react"

import { cn } from "@/lib/utils"
import { registryExamples } from "@/registry/__index__"

// 固定演示的布局宽度，缩小后的内容始终留在卡片的裁切区域内。
const previewClasses: Record<string, string> = {
  "contribution-graph": "w-[48rem] scale-[0.38] sm:scale-[0.42]",
  "grid-layout": "w-[32rem] scale-[0.56] sm:scale-[0.6]",
  "isometric-mark": "w-80 scale-75",
}

export function ComponentThumbnail({ name }: { name: string }) {
  const Preview = registryExamples[`${name}-demo`]

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
