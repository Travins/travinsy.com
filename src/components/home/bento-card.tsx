"use client"

import Link from "next/link"
import {
  createContext,
  useContext,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react"
import { ArrowUpRight } from "lucide-react"

import FlowDiagramShowcaseDemo from "@/registry/examples/flow-diagram-showcase-demo"

/** 悬停时流程图的播放倍率：加快一点，提示这张图是活的。 */
const HOVER_SPEED = 2

/** 卡片当前是否被悬停或键盘聚焦，供卡片里的预览做出反应。 */
const BentoActiveContext = createContext(false)

/**
 * Bento 里的一张卡：整张是一个链接，上面是组件的实时预览，底部是标题行。
 * 悬停或键盘聚焦时顶边亮起一条主色细线、箭头抬起，预览通过上下文得知并加速。
 * 预览对读屏隐藏，链接的名称只取标题。
 */
function BentoCard({
  href,
  preview,
  previewClassName,
  className,
  children,
  ...props
}: Omit<ComponentProps<typeof Link>, "href" | "children"> & {
  href: string
  /** 组件的实时预览 */
  preview: ReactNode
  /** 预览区在窄屏下的高度等样式；宽屏由网格行高决定 */
  previewClassName?: string
  /** 标题，由服务端渲染后传入 */
  children: ReactNode
}) {
  const [active, setActive] = useState(false)

  return (
    <Link
      href={href}
      data-slot="bento-card"
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      className={`group relative flex h-full min-w-0 flex-col focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ring ${className ?? ""}`}
      {...props}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-10 h-px origin-left scale-x-0 bg-primary transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
      />
      <div
        aria-hidden="true"
        className={`relative min-h-0 flex-auto overflow-hidden lg:flex-1 ${previewClassName ?? ""}`}
      >
        <BentoActiveContext value={active}>{preview}</BentoActiveContext>
      </div>
      <div className="flex items-start justify-between gap-3 border-t border-edge px-4 py-3 transition-colors group-hover:bg-muted/30 group-focus-visible:bg-muted/30 sm:px-5">
        <h3 className="text-sm font-medium tracking-tight group-hover:text-primary group-focus-visible:text-primary">
          {children}
        </h3>
        <ArrowUpRight
          aria-hidden="true"
          className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
        />
      </div>
    </Link>
  )
}

/** 首位大卡里的流程图：悬停或聚焦所在卡片时加速播放。 */
function BentoFlowPreview() {
  const active = useContext(BentoActiveContext)
  return (
    <div className="size-full bg-muted/20 p-4 sm:p-6 lg:p-8">
      <FlowDiagramShowcaseDemo
        speed={active ? HOVER_SPEED : 1}
        className="size-full max-w-none"
      />
    </div>
  )
}

export { BentoCard, BentoFlowPreview }
