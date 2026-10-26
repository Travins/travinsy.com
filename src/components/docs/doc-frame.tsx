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
  "flex min-h-9 flex-wrap items-center justify-between gap-x-2 gap-y-1 px-1.5 has-[>[data-slot=tabs-list]]:pl-0"
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

/**
 * 工具栏里的标签：容器透明，选中项与下方内容面板同为 background 底 + 1px edge 边框，
 * 读起来像面板的「页签」。不用阴影和小数高度，避免边缘发虚；
 * 工具栏以标签开头时左内边距归零，让选中项的左边框与面板左边框对齐。
 */
export function DocTabsList({
  className,
  ...props
}: ComponentProps<typeof TabsList>) {
  return (
    <TabsList
      className={cn(
        "h-7 gap-1 rounded-none bg-transparent p-0 group-data-horizontal/tabs:h-7",
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
        "h-7 flex-none rounded-md px-3 text-[13px] text-muted-foreground transition-colors hover:bg-background/60 hover:text-foreground",
        "data-active:border-edge data-active:bg-background data-active:text-foreground data-active:shadow-none group-data-[variant=default]/tabs-list:data-active:shadow-none",
        "dark:data-active:border-edge dark:data-active:bg-background",
        className,
      )}
      {...props}
    />
  )
}
