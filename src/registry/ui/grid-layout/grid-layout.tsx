import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// 像素约定：竖线是 GridContainer 的 border-x（位于内容区外 1px），
// 上方横线是上一行的底线（同样在外 1px），本行底线由 screen-line-bottom 画在内侧最后 1px。
// 十字为 11px 方框，线在第 5 px，所以用整数偏移让中心正好压在线条像素上，不用 translate(-50%)。
const gridCrosshairVariants = cva(
  "pointer-events-none absolute z-10 size-[11px] before:absolute before:inset-y-0 before:left-[5px] before:w-px before:bg-foreground/45 after:absolute after:inset-x-0 after:top-[5px] after:h-px after:bg-foreground/45",
  {
    variants: {
      position: {
        "top-left": "-top-[6px] -left-[6px]",
        "top-right": "-top-[6px] -right-[6px]",
        "bottom-left": "-bottom-[5px] -left-[6px]",
        "bottom-right": "-right-[6px] -bottom-[5px]",
      },
      /** line：底线由 screen-line-bottom 画在元素内侧（GridSection / GridSeparator）；border：元素自身有四边 border */
      anchor: { line: "", border: "" },
    },
    compoundVariants: [
      { anchor: "border", position: "bottom-left", className: "-bottom-[6px]" },
      {
        anchor: "border",
        position: "bottom-right",
        className: "-bottom-[6px]",
      },
    ],
    defaultVariants: { position: "top-left", anchor: "line" },
  },
)

// 纹理层：高 31px（不覆盖底线），左端在左竖线外 4096px，平铺原点因此正好落在竖线上
const gridSeparatorVariants = cva(
  "absolute top-0 bottom-px -left-[4097px] -right-[4096px]",
  {
    variants: {
      pattern: {
        ruler: "pattern-ruler",
        hatch: "pattern-hatch",
        dots: "pattern-dots",
        grid: "pattern-grid",
        plus: "pattern-plus",
        wave: "pattern-wave",
        none: "",
      },
    },
    defaultVariants: { pattern: "dots" },
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
  anchor,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof gridCrosshairVariants>) {
  return (
    <span
      aria-hidden
      data-slot="grid-crosshair"
      data-position={position ?? "top-left"}
      className={cn(gridCrosshairVariants({ position, anchor }), className)}
      {...props}
    />
  )
}

/**
 * 页面主容器：固定宽度 + 左右竖线。
 * 宽度可通过 CSS 变量 --grid-width 覆盖（默认 48rem）。
 * 外宽多 1px，使左右两条竖线的间距正好等于 --grid-width（纹路周期都能整除它）。
 */
function GridContainer({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="grid-container"
      className={cn(
        "mx-auto w-full max-w-[calc(var(--grid-width,48rem)+1px)] border-x border-edge",
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
 * 默认是点阵纹路；需要时可用 crosshair 在交点绘制「+」。
 */
function GridSeparator({
  className,
  pattern,
  label,
  crosshair,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof gridSeparatorVariants> & {
    /** 纹路：dots（默认）、ruler、hatch、grid、plus、wave，none 为只留线条 */
    pattern?: GridSeparatorPattern | null
    /** 左侧的等宽小字编号（如 `02 / PROJECTS`），像标签一样贴在纹路上；可与任意纹路组合 */
    label?: React.ReactNode
    /** 是否在四个交点绘制十字，默认关闭 */
    crosshair?: boolean
  }) {
  const resolved = pattern ?? "dots"
  const showCrosshair = crosshair ?? false
  return (
    <div
      aria-hidden
      data-slot="grid-separator"
      data-pattern={resolved}
      className={cn("screen-line-bottom h-8 w-full", className)}
      {...props}
    >
      {resolved === "ruler" ? (
        // 刻度尺带一层极淡的底色，让分隔带读作一条「带子」
        <div className="absolute top-0 -right-[4096px] bottom-px -left-[4097px] bg-foreground/[0.025]" />
      ) : null}
      <div
        data-slot="grid-separator-pattern"
        className={gridSeparatorVariants({ pattern: resolved })}
      />
      {label ? (
        <div
          data-slot="grid-separator-label"
          className="absolute inset-y-0 left-4 flex items-center sm:left-6"
        >
          <span className="bg-background px-1.5 font-mono text-[11px] leading-4 tracking-[0.08em] whitespace-nowrap text-muted-foreground">
            {label}
          </span>
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
