import * as React from "react"
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  TREND_TEXT,
  conventionClass,
  formatStat,
  toneColor,
  trendOf,
  type DataConvention,
  type DataTone,
  type StatFormatOptions,
  type Trend,
} from "@/registry/lib/data-display"

import {
  DEFAULT_LABELS,
  healthStatus,
  usageStatus,
  type StatLabels,
  type StatStatusName,
} from "./config"
import {
  StatBadge,
  StatStatus,
  type StatBadgeProps,
  type StatStatusProps,
} from "./stat-status"
import {
  StatDistribution,
  StatMeter,
  StatProgress,
  StatSegments,
  type StatDistributionProps,
  type StatMeterProps,
  type StatProgressProps,
  type StatSegment,
  type StatSegmentsProps,
} from "./stat-bars"
import { StatZones, type StatZone, type StatZonesProps } from "./stat-zones"

type StatCardProps = React.ComponentProps<"div"> & {
  /**
   * 涨跌配色约定：`intl` 绿涨红跌，`cn` 红涨绿跌。
   * 变量沿 DOM 继承，给外层容器设置一次，里面所有卡片与图表都会跟着变；不设置时沿用外层，最外层默认 `intl`
   */
  convention?: DataConvention
}

/** 统计卡片的外壳：细边框、无阴影，内容用下面的原语自由组合。 */
function StatCard({ className, convention, ...props }: StatCardProps) {
  return (
    <div
      data-slot="stat-card"
      data-convention={convention}
      className={cn(
        "flex min-w-0 flex-col gap-3 rounded-lg border border-edge bg-card p-4 text-sm text-card-foreground",
        conventionClass(convention),
        className,
      )}
      {...props}
    />
  )
}

type StatGroupProps = React.ComponentProps<"div"> & {
  /** 这一组里所有卡片、涨跌幅与图表共用的涨跌配色约定 */
  convention?: DataConvention
}

/** 一组卡片的容器：只负责统一设置 `convention`，布局由 `className` 决定。 */
function StatGroup({ className, convention, ...props }: StatGroupProps) {
  return (
    <div
      data-slot="stat-group"
      data-convention={convention}
      className={cn(conventionClass(convention), className)}
      {...props}
    />
  )
}

/** 标题行：左边放 `StatLabel`，右边放图标或状态徽标。 */
function StatHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stat-header"
      className={cn("flex items-start justify-between gap-3", className)}
      {...props}
    />
  )
}

/** 指标名称，12–13px 的次要文字。 */
function StatLabel({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="stat-label"
      className={cn("min-w-0 truncate text-[13px] leading-5 text-muted-foreground", className)}
      {...props}
    />
  )
}

type StatIconProps = React.ComponentProps<"span"> & {
  /** 图标色调；不设置时为次要文字色 */
  tone?: DataTone
}

/** 图标方块：`size-8` 的细边框小方块，里面放一个 lucide 图标。 */
function StatIcon({ className, tone, style, ...props }: StatIconProps) {
  return (
    <span
      data-slot="stat-icon"
      aria-hidden="true"
      data-tone={tone}
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-md border border-edge bg-muted/50 text-muted-foreground data-[tone]:text-[color:var(--stat-tone)] [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      style={
        tone
          ? ({
              "--stat-tone": toneColor(tone),
              ...style,
            } as React.CSSProperties)
          : style
      }
      {...props}
    />
  )
}

type StatValueProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** 数值；数字会按 `format` 格式化，字符串原样显示 */
  value?: number | string
  /** 数字格式，默认 `zh-CN` 压缩（1.2万、3.4亿） */
  format?: StatFormatOptions
  /** 单位，跟在数字后，字号更小、颜色更淡 */
  unit?: React.ReactNode
  /**
   * 字号：`sm` 20px、`default` 24px、`lg` 30px
   * @default "default"
   */
  size?: "sm" | "default" | "lg"
  /** 自定义内容，传入后替代 `value` */
  children?: React.ReactNode
}

const VALUE_SIZES = {
  sm: "text-xl",
  default: "text-2xl",
  lg: "text-3xl",
} as const

/** 大号数字加单位；数字一律等宽对齐（`tabular-nums`）。 */
function StatValue({
  className,
  value,
  format,
  unit,
  size = "default",
  children,
  ...props
}: StatValueProps) {
  const text = typeof value === "number" ? formatStat(value, format) : value
  return (
    <div
      data-slot="stat-value"
      data-size={size}
      className={cn(
        "flex items-baseline gap-1.5 leading-none font-semibold tracking-tight tabular-nums",
        VALUE_SIZES[size],
        className,
      )}
      {...props}
    >
      <span data-slot="stat-value-number">{children ?? text}</span>
      {unit ? (
        <span
          data-slot="stat-unit"
          className="text-sm font-normal tracking-normal text-muted-foreground"
        >
          {unit}
        </span>
      ) : null}
    </div>
  )
}

type StatTrendProps = Omit<React.ComponentProps<"span">, "children"> & {
  /** 涨跌幅，单位是百分点：`12.4` 表示 +12.4% */
  value: number
  /** 数字格式，默认带正负号的百分比 */
  format?: StatFormatOptions
  /**
   * 越低越好的指标（延迟、错误率）：下降显示为「好」的颜色，箭头方向不变
   * @default false
   */
  invert?: boolean
  /**
   * 显示方向箭头
   * @default true
   */
  showIcon?: boolean
  /** 单独指定涨跌配色约定，不设置时沿用外层 */
  convention?: DataConvention
  /** 覆盖读屏文字（上升 / 下降 / 持平） */
  labels?: Partial<Pick<StatLabels, "up" | "down" | "flat">>
  /** 数字后的说明，如「较上周」 */
  children?: React.ReactNode
}

const TREND_ICONS = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  flat: Minus,
} as const

const OPPOSITE: Record<Trend, Trend> = { up: "down", down: "up", flat: "flat" }

/** 涨跌幅：箭头 + 带符号的百分比；颜色来自 `convention`，同时有箭头和读屏文字，不只靠颜色。 */
function StatTrend({
  className,
  value,
  format,
  invert = false,
  showIcon = true,
  convention,
  labels,
  children,
  ...props
}: StatTrendProps) {
  const trend = trendOf(value)
  const Icon = TREND_ICONS[trend]
  const text = { ...DEFAULT_LABELS, ...labels }
  return (
    <span
      data-slot="stat-trend"
      data-trend={trend}
      className={cn(
        "inline-flex flex-wrap items-center gap-0.5 whitespace-nowrap text-xs font-medium tabular-nums",
        TREND_TEXT[invert ? OPPOSITE[trend] : trend],
        conventionClass(convention),
        className,
      )}
      {...props}
    >
      {showIcon ? <Icon aria-hidden="true" className="size-3.5 shrink-0" /> : null}
      <span className="sr-only">{text[trend]}</span>
      {formatStat(value, { style: "percent", sign: true, ...format })}
      {children ? (
        <span className="ml-1 font-normal text-muted-foreground">
          {children}
        </span>
      ) : null}
    </span>
  )
}

/** 两端对齐的说明行，放在进度条 / 计量条下面：左边「剩余 62%」，右边「已用 3.8 / 10 GB」。 */
function StatMeta({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stat-meta"
      className={cn(
        "flex items-center justify-between gap-3 text-xs text-muted-foreground tabular-nums",
        className,
      )}
      {...props}
    />
  )
}

export {
  StatBadge,
  StatCard,
  StatDistribution,
  StatGroup,
  StatHeader,
  StatIcon,
  StatLabel,
  StatMeta,
  StatMeter,
  StatProgress,
  StatSegments,
  StatStatus,
  StatTrend,
  StatValue,
  StatZones,
  healthStatus,
  usageStatus,
}
export type {
  StatBadgeProps,
  StatCardProps,
  StatDistributionProps,
  StatGroupProps,
  StatIconProps,
  StatLabels,
  StatMeterProps,
  StatProgressProps,
  StatSegment,
  StatSegmentsProps,
  StatStatusName,
  StatStatusProps,
  StatTrendProps,
  StatValueProps,
  StatZone,
  StatZonesProps,
}
