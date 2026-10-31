import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * 行高写进 `--grid-toolbar-height`，格子与格内控件都读它；
 * 对应按钮 `icon` / `icon-lg` 档（32 / 36px），触屏加高一档（40 / 44px）。
 */
const gridToolbarVariants = cva(
  "@container/grid-toolbar w-full overflow-hidden bg-background",
  {
    variants: {
      size: {
        sm: "[--grid-toolbar-height:2rem] pointer-coarse:[--grid-toolbar-height:2.5rem]",
        default:
          "[--grid-toolbar-height:2.25rem] pointer-coarse:[--grid-toolbar-height:2.75rem]",
      },
    },
    defaultVariants: { size: "default" },
  },
)

type GridToolbarProps = React.ComponentProps<"div"> &
  VariantProps<typeof gridToolbarVariants> & {
    /**
     * 外框：单独使用时整条带边框；放进表格等已有边线的容器时设为 false，由容器画线
     * @default true
     */
    bordered?: boolean
  }

/**
 * 网格工具栏：一行格子，格子之间用虚线分隔，窄容器里自动换行，换行后横线照样接上。
 * 方条输入（bar-field）、分段选择（segmented-control）、方条下拉（bar-select）放进来时
 * 会自动去掉自己的外框、圆角和底色，铺满整格。
 */
function GridToolbar({
  className,
  size,
  bordered = true,
  children,
  ...props
}: GridToolbarProps) {
  return (
    <div
      data-slot="grid-toolbar"
      data-bordered={bordered ? "" : undefined}
      className={cn(
        gridToolbarVariants({ size }),
        bordered && "border border-edge",
        className,
      )}
      {...props}
    >
      {/*
        每一格都画左线和上线，内层整体往左上挪 1px，由外层 overflow-hidden 裁掉最左一列和最上一行的线。
        这样无论怎样换行，格子之间都只有一条线，外圈的线交给外框（或容器）。
      */}
      <div
        data-slot="grid-toolbar-content"
        className="-ms-px -mt-px flex flex-wrap"
      >
        {children}
      </div>
    </div>
  )
}

type GridToolbarItemProps = React.ComponentProps<"div"> & {
  /**
   * 占满剩余宽度（如搜索框）
   * @default false
   */
  grow?: boolean
}

/** 工具栏里的一格：高度跟随工具栏，里面的控件铺满整格 */
function GridToolbarItem({
  className,
  grow = false,
  ...props
}: GridToolbarItemProps) {
  return (
    <div
      data-slot="grid-toolbar-item"
      className={cn(
        "flex h-(--grid-toolbar-height) min-w-0 items-stretch border-s border-t border-dashed border-edge *:min-w-0",
        grow ? "flex-1" : "shrink-0",
        className,
      )}
      {...props}
    />
  )
}

export { GridToolbar, GridToolbarItem, gridToolbarVariants }
export type { GridToolbarProps, GridToolbarItemProps }
