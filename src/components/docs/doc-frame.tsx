import type { ComponentProps } from "react"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

/**
 * 文档里所有「展示物」共用的双层框：外层 muted 底 + 顶部工具栏，内层 background 底放内容。
 * 预览、代码、安装命令、MDX 代码块、区块查看器都使用它，保持同一种视觉语言。
 * 需要放进 Tabs 时，直接把 docFrameClass 传给 <Tabs className>，不要再包一层。
 */
export const docFrameClass =
  "not-prose my-6 flex min-w-0 flex-col gap-0 rounded-xl border border-edge bg-muted/40 p-1"
export const docFrameBarClass =
  "flex min-h-9 flex-wrap items-center justify-between gap-x-2 gap-y-1 px-1.5"
export const docFramePanelClass =
  "min-w-0 overflow-hidden rounded-lg border border-edge bg-background"

export function DocFrame({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="doc-frame"
      className={cn(docFrameClass, className)}
      {...props}
    />
  )
}

export function DocFrameBar({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="doc-frame-bar"
      className={cn(docFrameBarClass, className)}
      {...props}
    />
  )
}

export function DocFramePanel({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="doc-frame-panel"
      className={cn(docFramePanelClass, className)}
      {...props}
    />
  )
}

/** 工具栏里的下划线式标签：下划线贴在工具栏底边，与内层上边框相接。 */
export function DocTabsList({
  className,
  ...props
}: ComponentProps<typeof TabsList>) {
  return (
    <TabsList
      variant="line"
      className={cn(
        "h-9 gap-0.5 p-0 group-data-horizontal/tabs:h-9",
        className,
      )}
      {...props}
    />
  )
}

export function DocTabsTrigger({
  className,
  ...props
}: ComponentProps<typeof TabsTrigger>) {
  return (
    <TabsTrigger
      className={cn(
        "h-full flex-none px-2.5 text-[13px] group-data-horizontal/tabs:after:bottom-0",
        className,
      )}
      {...props}
    />
  )
}
