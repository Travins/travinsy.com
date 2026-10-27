import * as React from "react"

import { cn } from "@/lib/utils"
import { toneColor, type DataTone } from "@/registry/lib/data-display"

type ChartLegendItem = {
  label: string
  tone: DataTone
  /** 图例项右侧的数值，已格式化的文字 */
  value?: React.ReactNode
}

type ChartLegendListProps = Omit<React.ComponentProps<"ul">, "children"> & {
  items: ChartLegendItem[]
  /**
   * 色标形状：`dot` 圆点（柱、面积），`line` 短横线（折线）
   * @default "dot"
   */
  marker?: "dot" | "line"
}

/** 行内图例：色标 + 名称，放在图表上方，窄屏自动换行。 */
function ChartLegendList({
  className,
  items,
  marker = "dot",
  ...props
}: ChartLegendListProps) {
  return (
    <ul
      data-slot="chart-legend-list"
      className={cn("flex flex-wrap items-center gap-x-4 gap-y-1", className)}
      {...props}
    >
      {items.map((item) => (
        <li
          key={item.label}
          className="flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <span
            aria-hidden="true"
            className={cn(
              "shrink-0",
              marker === "dot"
                ? "size-2 rounded-full"
                : "h-0.5 w-3 rounded-full",
            )}
            style={{ backgroundColor: toneColor(item.tone) }}
          />
          {item.label}
        </li>
      ))}
    </ul>
  )
}

type ChartLegendGridProps = Omit<React.ComponentProps<"ul">, "children"> & {
  items: ChartLegendItem[]
}

/** 图例格：两列，每项是圆点、名称和下面一行大号数值（通常是百分比）。 */
function ChartLegendGrid({ className, items, ...props }: ChartLegendGridProps) {
  return (
    <ul
      data-slot="chart-legend-grid"
      className={cn("grid grid-cols-2 gap-x-6 gap-y-4", className)}
      {...props}
    >
      {items.map((item) => (
        <li key={item.label} className="flex min-w-0 items-start gap-2.5">
          <span
            aria-hidden="true"
            className="mt-1.5 size-2 shrink-0 rounded-full"
            style={{ backgroundColor: toneColor(item.tone) }}
          />
          <span className="flex min-w-0 flex-col gap-1">
            <span className="line-clamp-2 text-[13px] text-muted-foreground">
              {item.label}
            </span>
            <span className="text-lg leading-none font-semibold tabular-nums">
              {item.value}
            </span>
          </span>
        </li>
      ))}
    </ul>
  )
}

export { ChartLegendGrid, ChartLegendList }
export type { ChartLegendGridProps, ChartLegendItem, ChartLegendListProps }
