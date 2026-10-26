"use client"

import Link from "next/link"
import { useState, type ReactNode } from "react"

import FlowDiagramShowcaseDemo from "@/registry/examples/flow-diagram-showcase-demo"

/** 悬停时流程图的播放倍率：加快一点，提示这张图是活的。 */
const HOVER_SPEED = 2

/**
 * 精选组件里的首位大卡：左侧是文字，右侧（窄屏在上方）是组件的实时预览。
 * 整张卡是一个链接；悬停或键盘聚焦时预览加速播放，顶边亮起一条主色细线。
 */
function FeaturedFlowCard({
  href,
  children,
}: {
  href: string
  /** 文字部分，由服务端渲染后传入 */
  children: ReactNode
}) {
  const [active, setActive] = useState(false)

  return (
    <Link
      href={href}
      data-slot="featured-flow-card"
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      className="group relative grid min-w-0 grid-cols-1 transition-colors hover:bg-muted/30 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ring lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-10 h-px origin-left scale-x-0 bg-primary transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
      />
      <div
        aria-hidden="true"
        // 预览四周留出呼吸空间，流程图不贴边
        className="relative h-72 border-b border-edge bg-muted/20 p-6 sm:h-80 sm:p-8 lg:order-last lg:h-auto lg:min-h-96 lg:border-b-0 lg:border-l lg:px-12 lg:py-10"
      >
        <FlowDiagramShowcaseDemo
          speed={active ? HOVER_SPEED : 1}
          className="size-full max-w-none"
        />
      </div>
      {children}
    </Link>
  )
}

export { FeaturedFlowCard }
