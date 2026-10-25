import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const gridCrosshairVariants = cva(
  // 11px 的十字：中心落在竖线（border-x）与横线的交点上，各偏移 0.5px 对齐 1px 线条的中心
  "pointer-events-none absolute z-10 size-[11px] before:absolute before:inset-y-0 before:left-[5px] before:w-px before:bg-foreground/45 after:absolute after:inset-x-0 after:top-[5px] after:h-px after:bg-foreground/45",
  {
    variants: {
      position: {
        "top-left":
          "top-[-0.5px] left-[-0.5px] -translate-x-1/2 -translate-y-1/2",
        "top-right":
          "top-[-0.5px] right-[-0.5px] translate-x-1/2 -translate-y-1/2",
        "bottom-left":
          "bottom-[0.5px] left-[-0.5px] -translate-x-1/2 translate-y-1/2",
        "bottom-right":
          "right-[-0.5px] bottom-[0.5px] translate-x-1/2 translate-y-1/2",
      },
    },
    defaultVariants: { position: "top-left" },
  },
)

const gridSeparatorVariants = cva(
  // --pattern-x：让纹路从容器左侧竖线开始计数，而不是从 200vw 宽的纹理层左端
  "absolute inset-y-0 -left-[100vw] w-[200vw] [--pattern-x:100vw]",
  {
    variants: {
      pattern: {
        ruler: "bg-ruler",
        hatch: "bg-hatch",
        dots: "bg-dots",
        grid: "bg-grid-fine",
        plus: "bg-plus",
        wave: "bg-wave",
        none: "",
      },
    },
    defaultVariants: { pattern: "ruler" },
  },
)

type GridSeparatorPattern = NonNullable<
  VariantProps<typeof gridSeparatorVariants>["pattern"]
>

/**
 * 交点十字：绘制在容器竖线与横线交点处的小「+」，纯装饰。
 * 放在带 `position: relative` 的行（GridSection、GridSeparator）内，由 position 指定四个角之一。
 */
function GridCrosshair({
  className,
  position,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof gridCrosshairVariants>) {
  return (
    <span
      aria-hidden
      data-slot="grid-crosshair"
      data-position={position ?? "top-left"}
      className={cn(gridCrosshairVariants({ position }), className)}
      {...props}
    />
  )
}

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
  crosshair = false,
  children,
  ...props
}: React.ComponentProps<"section"> & {
  /** 在行的顶部补一条全屏横线（默认只画底线） */
  topLine?: boolean
  /** 在底线与左右竖线的两个交点处绘制「+」，默认关闭 */
  crosshair?: boolean
}) {
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
    >
      {children}
      {crosshair ? (
        <>
          <GridCrosshair position="bottom-left" />
          <GridCrosshair position="bottom-right" />
        </>
      ) : null}
    </section>
  )
}

/**
 * 分隔带：全屏宽度的纹理 + 底部横线，用于主题切换处。
 * 默认是刻度尺纹路，并在上下两条线与左右竖线的四个交点处绘制「+」。
 */
function GridSeparator({
  className,
  pattern,
  label,
  crosshair,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof gridSeparatorVariants> & {
    /** 纹路：ruler（默认）、hatch、dots、grid、plus、wave，none 为只留线条 */
    pattern?: GridSeparatorPattern | null
    /** 左侧的等宽小字编号（如 `02 / PROJECTS`），后接虚线；可与任意纹路组合 */
    label?: React.ReactNode
    /** 是否绘制四个交点十字，默认只有 ruler 纹路开启 */
    crosshair?: boolean
  }) {
  const resolved = pattern ?? "ruler"
  const showCrosshair = crosshair ?? resolved === "ruler"
  return (
    <div
      aria-hidden
      data-slot="grid-separator"
      data-pattern={resolved}
      className={cn("screen-line-bottom h-8 w-full", className)}
      {...props}
    >
      <div
        data-slot="grid-separator-pattern"
        className={gridSeparatorVariants({ pattern: resolved })}
      />
      {label ? (
        <div
          data-slot="grid-separator-label"
          className="absolute inset-0 flex items-center gap-3 px-4 font-mono text-[11px] tracking-[0.08em] text-muted-foreground sm:px-6"
        >
          <span className="bg-background px-1.5 whitespace-nowrap">
            {label}
          </span>
          <span className="h-px flex-1 border-t border-dashed border-edge" />
        </div>
      ) : null}
      {showCrosshair ? (
        <>
          <GridCrosshair position="top-left" />
          <GridCrosshair position="top-right" />
          <GridCrosshair position="bottom-left" />
          <GridCrosshair position="bottom-right" />
        </>
      ) : null}
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

export {
  GridColumns,
  GridContainer,
  GridCrosshair,
  GridSection,
  GridSeparator,
  gridCrosshairVariants,
  gridSeparatorVariants,
}
export type { GridSeparatorPattern }
