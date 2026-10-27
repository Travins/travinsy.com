import * as React from "react"

import { cn } from "@/lib/utils"
import {
  conventionClass,
  toneColor,
  type DataConvention,
  type DataTone,
} from "@/registry/lib/data-display"

import { ChartGauge, type ChartGaugeProps } from "./chart-gauge"
import {
  ChartLegendGrid,
  ChartLegendList,
  type ChartLegendGridProps,
  type ChartLegendItem,
  type ChartLegendListProps,
} from "./chart-legend"
import {
  ChartRanking,
  type ChartRankingItem,
  type ChartRankingProps,
} from "./chart-ranking"
import {
  ChartSeries,
  type ChartSeriesItem,
  type ChartSeriesProps,
} from "./chart-series"

type ChartCardProps = React.ComponentProps<"div"> & {
  /** 涨跌配色约定，里面的图表与指标共用；不设置时沿用外层 */
  convention?: DataConvention
}

/** 图表卡片的外壳：细边框、无阴影；用下面的 Header / Content / Footer 分区，分区之间用细线隔开。 */
function ChartCard({ className, convention, ...props }: ChartCardProps) {
  return (
    <div
      data-slot="chart-card"
      data-convention={convention}
      className={cn(
        "flex min-w-0 flex-col overflow-hidden rounded-lg border border-edge bg-card text-sm text-card-foreground",
        conventionClass(convention),
        className,
      )}
      {...props}
    />
  )
}

/** 卡片头部：左边标题与说明，右边放 `ChartCardAction`；窄屏上下堆叠。 */
function ChartCardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chart-card-header"
      className={cn(
        "flex flex-col gap-3 border-b border-edge p-4 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
      {...props}
    />
  )
}

// 用 div 而不是 h3：标题层级由所在页面决定，需要时自己加 role="heading" 与 aria-level
function ChartCardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chart-card-title"
      className={cn("text-sm leading-5 font-medium", className)}
      {...props}
    />
  )
}

function ChartCardDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="chart-card-description"
      className={cn("text-[13px] leading-5 text-muted-foreground", className)}
      {...props}
    />
  )
}

/** 头部右侧的操作区：按钮、选择器、图例等。 */
function ChartCardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chart-card-action"
      className={cn("flex shrink-0 items-center gap-2", className)}
      {...props}
    />
  )
}

function ChartCardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chart-card-content"
      className={cn("min-w-0 p-4", className)}
      {...props}
    />
  )
}

function ChartCardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chart-card-footer"
      className={cn(
        "flex items-center gap-3 border-t border-edge p-4 text-xs text-muted-foreground",
        className,
      )}
      {...props}
    />
  )
}

/** 指标行：几个并排的小指标，之间用竖线隔开，放在头部或图表上方。 */
function ChartMetrics({ className, ...props }: React.ComponentProps<"dl">) {
  return (
    <dl
      data-slot="chart-metrics"
      className={cn(
        "flex flex-wrap items-center gap-y-2 divide-x divide-edge",
        className,
      )}
      {...props}
    />
  )
}

type ChartMetricProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** 指标名 */
  label: React.ReactNode
  /** 指标值 */
  value: React.ReactNode
  /** 数值前的色标，用来对应图表里的某条序列 */
  tone?: DataTone
}

function ChartMetric({
  className,
  label,
  value,
  tone,
  ...props
}: ChartMetricProps) {
  return (
    <div
      data-slot="chart-metric"
      className={cn(
        "flex flex-col gap-1 px-4 first:pl-0 last:pr-0 max-sm:px-3",
        className,
      )}
      {...props}
    >
      <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {tone ? (
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full"
            style={{ backgroundColor: toneColor(tone) }}
          />
        ) : null}
        {label}
      </dt>
      <dd className="text-sm leading-none font-medium tabular-nums">{value}</dd>
    </div>
  )
}

type ChartTableColumn = {
  /** 对应行数据里的字段名 */
  key: string
  /** 表头 */
  header: React.ReactNode
  /**
   * 对齐方式；数字列用 `end`
   * @default "start"
   */
  align?: "start" | "center" | "end"
}

type ChartTableRow = {
  /** 行首的色标，对应图表里的序列 */
  tone?: DataTone
  /** 各列的内容，字段名与 `columns[].key` 对应 */
  [column: string]: React.ReactNode
}

type ChartTableProps = Omit<React.ComponentProps<"table">, "children"> & {
  columns: ChartTableColumn[]
  rows: ChartTableRow[]
}

const ALIGN = {
  start: "text-left",
  center: "text-center",
  end: "text-right",
} as const

/** 图表下方的明细表：第一列前带一根与序列同色的竖条，数字列右对齐、等宽。 */
function ChartTable({ className, columns, rows, ...props }: ChartTableProps) {
  return (
    <div data-slot="chart-table" className="w-full overflow-x-auto">
      <table
        data-slot="chart-table-element"
        className={cn("w-full min-w-max border-collapse text-sm", className)}
        {...props}
      >
        <thead>
          <tr className="border-b border-edge text-xs text-muted-foreground">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn(
                  "px-3 py-2 font-normal first:pl-0 last:pr-0",
                  ALIGN[column.align ?? "start"],
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-edge">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, columnIndex) => (
                <td
                  key={column.key}
                  className={cn(
                    "px-3 py-2.5 tabular-nums first:pl-0 last:pr-0",
                    ALIGN[column.align ?? "start"],
                  )}
                >
                  {columnIndex === 0 && row.tone ? (
                    <span className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="h-5 w-1 shrink-0 rounded-full"
                        style={{ backgroundColor: toneColor(row.tone) }}
                      />
                      {row[column.key]}
                    </span>
                  ) : (
                    row[column.key]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export {
  ChartCard,
  ChartCardAction,
  ChartCardContent,
  ChartCardDescription,
  ChartCardFooter,
  ChartCardHeader,
  ChartCardTitle,
  ChartGauge,
  ChartLegendGrid,
  ChartLegendList,
  ChartMetric,
  ChartMetrics,
  ChartRanking,
  ChartSeries,
  ChartTable,
}
export type {
  ChartCardProps,
  ChartGaugeProps,
  ChartLegendGridProps,
  ChartLegendItem,
  ChartLegendListProps,
  ChartMetricProps,
  ChartRankingItem,
  ChartRankingProps,
  ChartSeriesItem,
  ChartSeriesProps,
  ChartTableColumn,
  ChartTableProps,
  ChartTableRow,
}
