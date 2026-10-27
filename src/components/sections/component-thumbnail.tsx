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

/** 示例按这个宽度排版，再整体等比缩放进固定比例的画框，所有分辨率下构图一致。 */
const STAGE_WIDTH = 720
/** 缩放后四周留出的空隙（占画框的比例）。 */
const INSET = 0.9

export function ComponentThumbnail({
  name,
  label,
}: {
  name: string
  label: string
}) {
  const Preview = registryExamples[firstExamples[name] ?? `${name}-demo`]
  const frameRef = React.useRef<HTMLDivElement>(null)
  const stageRef = React.useRef<HTMLDivElement>(null)
  const [scale, setScale] = React.useState<number | null>(null)

  React.useLayoutEffect(() => {
    const frame = frameRef.current
    const stage = stageRef.current
    if (!frame || !stage) return
    // 宽度与高度各算一个比例，取较小的那个，保证示例完整放进画框；不放大超过原尺寸
    const update = () => {
      const height = stage.offsetHeight
      if (!height) return
      setScale(
        Math.min(
          1,
          (frame.clientWidth * INSET) / STAGE_WIDTH,
          (frame.clientHeight * INSET) / height,
        ),
      )
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(frame)
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])

  return (
    // 缩略图是可交互的实时演示（悬停、点击都生效），跳转只交给下方的标题区
    <div
      ref={frameRef}
      role="group"
      aria-label={label}
      className="relative aspect-[16/10] min-w-0 overflow-hidden bg-muted/20"
    >
      <div
        ref={stageRef}
        className={cn(
          "absolute top-1/2 left-1/2 flex origin-center items-center justify-center transition-opacity duration-300",
          scale === null && "opacity-0",
        )}
        style={{
          width: STAGE_WIDTH,
          transform: `translate(-50%, -50%) scale(${scale ?? 0.5})`,
        }}
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
