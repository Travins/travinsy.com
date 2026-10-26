"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { Moon, Sun, Sunrise, Sunset, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { useNow } from "@/registry/hooks/use-now"

import { DEFAULT_LABELS, type GreetingLabels } from "./config"
import {
  PERIODS,
  normalizeBoundaries,
  periodRange,
  type GreetingBoundaries,
  type GreetingPeriod,
} from "./period"
import { useGreetingPeriod } from "./use-greeting-period"

const PERIOD_ICONS: Record<GreetingPeriod, LucideIcon> = {
  morning: Sunrise,
  noon: Sun,
  afternoon: Sunset,
  evening: Moon,
}

// 每个时段一种强调色：日出琥珀、正午天蓝、日落玫红、夜晚紫。
// 取自 flow-diagram 的多彩色变量；没有安装它们时回落到主题强调色。
const PERIOD_TONES: Record<GreetingPeriod, string> = {
  morning: "var(--flow-amber, var(--primary))",
  noon: "var(--flow-blue, var(--primary))",
  afternoon: "var(--flow-rose, var(--primary))",
  evening: "var(--flow-violet, var(--primary))",
}

function toneStyle(period: GreetingPeriod | null) {
  return {
    "--greeting-tone": period ? PERIOD_TONES[period] : "var(--primary)",
  } as React.CSSProperties
}

type GreetingTextProps = {
  /**
   * 首屏与挂载前显示的静态文案，需保持中性以避免水合差异
   * @default "你好"
   */
  fallback?: string
  /**
   * 05:00–10:59 的问候语
   * @default "早上好"
   */
  morning?: string
  /**
   * 11:00–13:59 的问候语
   * @default "中午好"
   */
  noon?: string
  /**
   * 14:00–17:59 的问候语
   * @default "下午好"
   */
  afternoon?: string
  /**
   * 18:00–次日 04:59 的问候语
   * @default "晚上好"
   */
  evening?: string
  /** 称呼，拼在问候语之后，例如 `Travins` */
  name?: string
  /**
   * 问候语与称呼之间的分隔
   * @default "，"
   */
  nameSeparator?: string
  /**
   * 各时段的起始小时，必须严格递增；传错时回落到默认划分
   * @default { morning: 5, noon: 11, afternoon: 14, evening: 18 }
   */
  boundaries?: Partial<GreetingBoundaries>
  /**
   * 指定当前小时（可带小数）。传入后结果是确定的，不再等待客户端挂载，适合演示和测试
   */
  hour?: number
}

type GreetingProps = Omit<React.ComponentProps<"span">, "children"> &
  GreetingTextProps & {
    /**
     * 问候语之后拼接的文本
     * @default "，很高兴在这里遇见你。"
     */
    suffix?: string
    /**
     * 在问候语前显示当前时段的图标（日出 / 太阳 / 日落 / 月亮）
     * @default false
     */
    showIcon?: boolean
  }

/** 按时段选出问候语；时段未知（挂载前）时返回 `fallback`。 */
function pickGreeting(
  period: GreetingPeriod | null,
  texts: Pick<
    GreetingTextProps,
    "fallback" | "morning" | "noon" | "afternoon" | "evening"
  >,
) {
  const {
    fallback = "你好",
    morning = "早上好",
    noon = "中午好",
    afternoon = "下午好",
    evening = "晚上好",
  } = texts
  if (period === null) return fallback
  return { morning, noon, afternoon, evening }[period]
}

/** 根据访客当地时间问候，首屏使用一致的静态文案以避免水合差异。 */
function Greeting({
  fallback,
  suffix = "，很高兴在这里遇见你。",
  morning,
  noon,
  afternoon,
  evening,
  name,
  nameSeparator = "，",
  boundaries,
  hour,
  showIcon = false,
  className,
  ...props
}: GreetingProps) {
  const { period } = useGreetingPeriod(boundaries, hour)
  const Icon = period ? PERIOD_ICONS[period] : null
  return (
    <span
      data-slot="greeting"
      data-state={period === null ? "pending" : "ready"}
      data-period={period ?? undefined}
      className={className}
      {...props}
    >
      {showIcon ? (
        <span
          data-slot="greeting-icon"
          style={toneStyle(period)}
          className="mr-[0.4em] inline-block size-[1em] align-[-0.125em] text-(--greeting-tone)"
        >
          {Icon ? <Icon aria-hidden="true" className="size-full" /> : null}
        </span>
      ) : null}
      {pickGreeting(period, { fallback, morning, noon, afternoon, evening })}
      {name ? `${nameSeparator}${name}` : null}
      {suffix}
    </span>
  )
}

type GreetingPeriodsProps = Omit<React.ComponentProps<"ol">, "children"> &
  Pick<GreetingTextProps, "boundaries" | "hour"> & {
    /**
     * 在当前时段格里显示时段进度条
     * @default true
     */
    showProgress?: boolean
    /** 覆盖部分可见文案（用到 `periods`、`names`） */
    labels?: Partial<GreetingLabels>
  }

/** 四个时段的指示条：当前时段亮起，格内细线表示这个时段已经过去多少。 */
function GreetingPeriods({
  boundaries,
  hour,
  showProgress = true,
  labels,
  className,
  ...props
}: GreetingPeriodsProps) {
  const text = { ...DEFAULT_LABELS, ...labels }
  const normalized = normalizeBoundaries(boundaries)
  const { period: active, progress } = useGreetingPeriod(boundaries, hour)
  return (
    <ol
      data-slot="greeting-periods"
      aria-label={text.periods}
      className={cn("grid grid-cols-4 gap-1.5", className)}
      {...props}
    >
      {PERIODS.map((period) => {
        const Icon = PERIOD_ICONS[period]
        const current = period === active
        return (
          <li
            key={period}
            data-slot="greeting-period"
            data-period={period}
            data-active={current ? "" : undefined}
            aria-current={current ? "true" : undefined}
            style={toneStyle(period)}
            className={cn(
              "relative flex flex-col items-center gap-1 overflow-hidden rounded-md border border-edge bg-background px-1 py-2 text-muted-foreground transition-colors",
              "data-[active]:border-(--greeting-tone)/60 data-[active]:bg-(--greeting-tone)/10 data-[active]:text-foreground",
            )}
          >
            <Icon
              aria-hidden="true"
              strokeWidth={1.5}
              className="size-4 in-data-[active]:text-(--greeting-tone)"
            />
            <span className="text-xs">{text.names[period]}</span>
            <span className="font-mono text-[10px] opacity-70">
              {periodRange(period, normalized)}
            </span>
            {showProgress && current ? (
              <span
                aria-hidden="true"
                data-slot="greeting-progress"
                className="absolute inset-x-0 bottom-0 h-0.5 bg-(--greeting-tone)/20"
              >
                <span
                  className="block h-full origin-left bg-(--greeting-tone)"
                  style={{ transform: `scaleX(${progress})` }}
                />
              </span>
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}

type GreetingCardProps = Omit<React.ComponentProps<"div">, "children"> &
  Omit<GreetingTextProps, "nameSeparator"> & {
    /**
     * 显示四时段指示条
     * @default true
     */
    showPeriods?: boolean
    /**
     * 副标题每 6 秒轮换一次；系统开启“减少动态效果”时固定显示第一条
     * @default true
     */
    rotate?: boolean
    /** 覆盖部分可见文案 */
    labels?: Partial<GreetingLabels>
  }

/** 问候卡片：时段图标与色调、大字问候、轮换的副标题，以及四时段指示。 */
function GreetingCard({
  fallback,
  morning,
  noon,
  afternoon,
  evening,
  name,
  boundaries,
  hour,
  showPeriods = true,
  rotate = true,
  labels,
  className,
  ...props
}: GreetingCardProps) {
  const text = { ...DEFAULT_LABELS, ...labels }
  const { period } = useGreetingPeriod(boundaries, hour)
  const reduced = useReducedMotion()
  const tick = useNow(6000)
  const messages = period ? text.messages[period] : []
  const index =
    rotate && !reduced && tick !== null && messages.length
      ? Math.floor(tick / 6000) % messages.length
      : 0
  const message = messages[index] ?? text.fallbackMessage
  const Icon = period ? PERIOD_ICONS[period] : null

  return (
    <div
      data-slot="greeting-card"
      data-state={period === null ? "pending" : "ready"}
      data-period={period ?? undefined}
      style={toneStyle(period)}
      className={cn(
        "relative flex flex-col gap-5 overflow-hidden rounded-lg border border-edge bg-background p-5",
        className,
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-12 size-48 rounded-full bg-(--greeting-tone)/10 blur-3xl"
      />
      {Icon ? (
        <Icon
          aria-hidden="true"
          strokeWidth={1}
          className="pointer-events-none absolute top-3 right-3 size-16 text-(--greeting-tone)/50"
        />
      ) : null}
      <div className="relative">
        <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.08em] text-muted-foreground">
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-(--greeting-tone)"
          />
          {text.eyebrow} / {period ? text.tags[period] : text.pending}
        </p>
        <p className="mt-3 text-4xl font-semibold tracking-tight">
          <Greeting
            fallback={fallback}
            morning={morning}
            noon={noon}
            afternoon={afternoon}
            evening={evening}
            name={name}
            boundaries={boundaries}
            hour={hour}
            suffix=""
          />
          <span className="text-(--greeting-tone)">.</span>
        </p>
        <div className="mt-2 min-h-5 text-sm text-muted-foreground">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={message}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              {message}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
      {showPeriods ? (
        <GreetingPeriods
          boundaries={boundaries}
          hour={hour}
          labels={labels}
          className="relative"
        />
      ) : null}
    </div>
  )
}

export { Greeting, GreetingCard, GreetingPeriods, useGreetingPeriod }
export type {
  GreetingBoundaries,
  GreetingCardProps,
  GreetingLabels,
  GreetingPeriod,
  GreetingPeriodsProps,
  GreetingProps,
}
