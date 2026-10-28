"use client"

import * as React from "react"
import { useReducedMotion } from "motion/react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts"

import { cn } from "@/lib/utils"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  conventionClass,
  formatStat,
  toneColor,
  trendOf,
  type DataConvention,
  type DataTone,
  type StatFormatOptions,
} from "@/registry/lib/data-display"

import {
  MiniDonut,
  type MiniDonutProps,
  type MiniDonutSegment,
} from "./mini-donut"
import { MiniRing, type MiniRingProps } from "./mini-ring"

/** 数据点：纯数字，或带标签的 `{ label, value }`（标签用于横轴与提示框）。 */
type MiniChartDatum = number | { label?: string; value: number }

type MiniChartType = "bar" | "line" | "area" | "step"

type MiniChartProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** 数据点，按顺序排列 */
  data: MiniChartDatum[]
  /**
   * 图形：`bar` 柱、`line` 折线、`area` 面积、`step` 阶梯线
   * @default "area"
   */
  type?: MiniChartType
  /**
   * 色调。`"trend"` 按首尾两点的涨跌自动取涨色或跌色（随 `convention` 变化）
   * @default "primary"
   */
  tone?: DataTone | "trend"
  /** 涨跌配色约定，仅 `tone="trend"` 时有用；不设置时沿用外层 */
  convention?: DataConvention
  /**
   * 显示横轴（11px 的极简刻度，只保留首尾与间隔均匀的标签）
   * @default false
   */
  showAxis?: boolean
  /** 横轴刻度文字的格式化，参数是数据点的 `label` */
  tickFormatter?: (label: string, index: number) => string
  /**
   * 悬停提示框
   * @default true
   */
  showTooltip?: boolean
  /** 提示框里数值的格式 */
  format?: StatFormatOptions
  /**
   * 提示框里的系列名
   * @default "数值"
   */
  seriesLabel?: string
  /** 柱图里强调的那一根：下标，`"last"` 最后一根，`"max"` 最大值；其余柱变淡 */
  highlight?: number | "last" | "max"
  /**
   * 柱图每根柱的底槽（淡色背景），像进度槽一样表示满值
   * @default false
   */
  track?: boolean
  /**
   * 线宽，仅折线、面积与阶梯线
   * @default 2
   */
  strokeWidth?: number
  /** 读屏名称，描述这张图表示什么 */
  label?: string
}

const AXIS_TICK = { fontSize: 11, fill: "var(--muted-foreground)" } as const

/** 极简迷你图：没有网格、没有纵轴，适合放进统计卡片；高度用 `className` 控制（默认 `h-16`）。 */
function MiniChart({
  className,
  data,
  type = "area",
  tone = "primary",
  convention,
  showAxis = false,
  tickFormatter,
  showTooltip = true,
  format,
  seriesLabel = "数值",
  highlight,
  track = false,
  strokeWidth = 2,
  label,
  ...props
}: MiniChartProps) {
  const ready = React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
  const reduced = useReducedMotion()
  const gradientId = React.useId().replaceAll(":", "")
  const points = data.map((datum, index) =>
    typeof datum === "number"
      ? { label: String(index + 1), value: datum }
      : { label: datum.label ?? String(index + 1), value: datum.value },
  )
  const first = points[0]?.value ?? 0
  const last = points.at(-1)?.value ?? 0
  const resolved: DataTone =
    tone === "trend"
      ? ({ up: "up", down: "down", flat: "muted" } as const)[
          trendOf(last - first)
        ]
      : tone
  const config = {
    value: { label: seriesLabel, color: toneColor(resolved) },
  } satisfies ChartConfig
  const focus =
    highlight === "last"
      ? points.length - 1
      : highlight === "max"
        ? points.findIndex(
            (point) => point.value === Math.max(...points.map((p) => p.value)),
          )
        : highlight

  const margin = { top: 4, right: 2, bottom: 0, left: 2 }
  const active = !reduced
  const axis = showAxis ? (
    <XAxis
      dataKey="label"
      tickLine={false}
      axisLine={false}
      tickMargin={6}
      minTickGap={12}
      interval="preserveStartEnd"
      tick={AXIS_TICK}
      tickFormatter={tickFormatter}
    />
  ) : (
    <XAxis dataKey="label" hide />
  )
  const tooltip = showTooltip ? (
    <ChartTooltip
      cursor={false}
      content={
        <ChartTooltipContent
          className="min-w-28 shadow-sm"
          formatter={(value) => (
            <>
              <span
                aria-hidden="true"
                className="size-2 shrink-0 rounded-[2px]"
                style={{ backgroundColor: toneColor(resolved) }}
              />
              <span className="text-muted-foreground">{seriesLabel}</span>
              <span className="ml-auto font-mono font-medium text-foreground tabular-nums">
                {formatStat(Number(value), format)}
              </span>
            </>
          )}
        />
      }
    />
  ) : null
  const color = "var(--color-value)"

  return (
    <div
      data-slot="mini-chart"
      data-ready={ready}
      data-type={type}
      role="img"
      aria-label={label}
      className={cn(
        "relative flex h-16 w-full min-w-0 text-xs",
        conventionClass(convention),
        className,
      )}
      {...props}
    >
      <ChartContainer
        data-slot="mini-chart-plot"
        data-ready={ready}
        config={config}
        initialDimension={{ width: 160, height: 64 }}
        className="aspect-auto size-full justify-start opacity-0 transition-opacity duration-200 data-[ready=true]:opacity-100 motion-reduce:transition-none"
      >
        {type === "bar" ? (
          <BarChart data={points} margin={margin} barCategoryGap="22%">
            {axis}
            <YAxis hide domain={[0, "dataMax"]} />
            {tooltip}
            <Bar
              dataKey="value"
              fill={color}
              radius={[3, 3, 0, 0]}
              maxBarSize={14}
              background={
                track ? { fill: "var(--muted)", radius: 3 } : undefined
              }
              isAnimationActive={active}
              animationDuration={600}
            >
              {points.map((point, index) => (
                <Cell
                  key={index}
                  fill={color}
                  fillOpacity={
                    focus === undefined || focus === index ? 1 : 0.28
                  }
                />
              ))}
            </Bar>
          </BarChart>
        ) : type === "area" ? (
          <AreaChart data={points} margin={margin}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.28} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            {axis}
            <YAxis hide domain={["dataMin", "dataMax"]} />
            {tooltip}
            <Area
              dataKey="value"
              type="monotone"
              stroke={color}
              strokeWidth={strokeWidth}
              fill={`url(#${gradientId})`}
              activeDot={{ r: 3, strokeWidth: 0 }}
              isAnimationActive={active}
              animationDuration={700}
            />
          </AreaChart>
        ) : (
          <LineChart data={points} margin={margin}>
            {axis}
            <YAxis hide domain={["dataMin", "dataMax"]} />
            {tooltip}
            <Line
              dataKey="value"
              type={type === "step" ? "stepAfter" : "monotone"}
              stroke={color}
              strokeWidth={strokeWidth}
              dot={false}
              activeDot={{ r: 3, strokeWidth: 0 }}
              isAnimationActive={active}
              animationDuration={700}
            />
          </LineChart>
        )}
      </ChartContainer>
      <div
        data-slot="mini-chart-placeholder"
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 z-10 min-h-0 bg-muted/30 transition-opacity duration-200 motion-reduce:transition-none",
          ready && "opacity-0",
        )}
      >
        <svg
          className="absolute inset-0 size-full text-muted-foreground/20"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <path
            d="M0 25H100 M0 50H100 M0 75H100"
            fill="none"
            stroke="currentColor"
            strokeDasharray="3 3"
          />
        </svg>
      </div>
    </div>
  )
}

const subscribe = () => () => {}

export { MiniChart, MiniDonut, MiniRing }
export type {
  MiniChartDatum,
  MiniChartProps,
  MiniChartType,
  MiniDonutProps,
  MiniDonutSegment,
  MiniRingProps,
}
