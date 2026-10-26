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

/**
 * 工具栏里的标签：下划线式。标签撑满工具栏高度，选中项的 2px 下划线向下压住内容面板的上边框，
 * 看起来像从面板边框上「长」出来；z-10 保证它画在面板边框之上。
 */
export function DocTabsList({
  className,
  ...props
}: ComponentProps<typeof TabsList>) {
  return (
    <TabsList
      variant="line"
      className={cn(
        "h-auto gap-0 self-stretch p-0 group-data-horizontal/tabs:h-auto",
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
        "h-auto flex-none self-stretch rounded-none border-0 px-2.5 text-[13px] text-muted-foreground hover:text-foreground data-active:text-foreground",
        "after:z-10 group-data-horizontal/tabs:after:inset-x-2.5 group-data-horizontal/tabs:after:-bottom-px group-data-horizontal/tabs:after:h-0.5",
        className,
      )}
      {...props}
    />
  )
}
