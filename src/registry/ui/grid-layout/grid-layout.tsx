import type * as React from "react"

import { cn } from "@/lib/utils"

/**
 * 页面主容器：固定宽度 + 左右竖线。
 * 宽度可通过 CSS 变量 --grid-width 覆盖（默认 48rem）。
 */
function GridContainer({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="grid-container"
      className={cn(
        "mx-auto w-full max-w-[var(--grid-width,48rem)] border-x border-edge",
        className,
      )}
      {...props}
    />
  )
}

/**
 * 一行内容：底部一条横跨整个屏幕的分隔线。
 * 放在 GridContainer 内使用。
 */
function GridSection({
  className,
  topLine = false,
  ...props
}: React.ComponentProps<"section"> & { topLine?: boolean }) {
  return (
    <section
      data-slot="grid-section"
      data-top-line={topLine}
      className={cn(
        "screen-line-bottom",
        topLine && "screen-line-top",
        className,
      )}
      {...props}
    />
  )
}

/**
 * 斜纹分隔带：全屏宽度的斜线纹理 + 底部横线。
 */
function GridSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      data-slot="grid-separator"
      className={cn("screen-line-bottom h-8 w-full", className)}
      {...props}
    >
      <div className="absolute inset-y-0 -left-[100vw] w-[200vw] bg-hatch" />
    </div>
  )
}

/**
 * 分栏：栏与栏之间用虚线分隔，窄屏自动堆叠。
 */
function GridColumns({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="grid-columns"
      className={cn(
        "grid grid-cols-1 divide-y divide-dashed divide-edge sm:grid-cols-2 sm:divide-x sm:divide-y-0",
        className,
      )}
      {...props}
    />
  )
}

export { GridColumns, GridContainer, GridSection, GridSeparator }
