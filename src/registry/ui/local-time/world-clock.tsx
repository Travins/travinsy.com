"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { useNow } from "@/registry/hooks/use-now"

import { AnalogClock } from "./analog-clock"
import { DEFAULT_LABELS, type LocalTimeLabels } from "./config"
import { DayNightMark, TimeDigits } from "./time-parts"
import {
  clockParts,
  dayOffset,
  describeDifference,
  hourDifference,
  isDaytime,
  offsetMinutes,
  utcLabel,
  zoneHour,
} from "./zone"

/** `list` 一行一个城市；`cards` 每个城市是一张带模拟表盘的卡片，两列排布。 */
type WorldClockVariant = "list" | "cards"

type WorldClockZone = {
  /** IANA 时区名 */
  timeZone: string
  /** 城市名 */
  label: React.ReactNode
  /** 高亮这一项（例如“我所在的城市”） */
  highlighted?: boolean
}

type WorldClockSettings = {
  locale: string
  hour12: boolean
  showSeconds: boolean
  showZone: boolean
  animated: boolean
  variant: WorldClockVariant
  labels: LocalTimeLabels
}

const WorldClockContext = React.createContext<WorldClockSettings>({
  locale: "zh-CN",
  hour12: false,
  showSeconds: true,
  showZone: true,
  animated: true,
  variant: "list",
  labels: DEFAULT_LABELS,
})

type WorldClockProps = Omit<React.ComponentProps<"div">, "title"> & {
  /** 用数据描述城市；与 `children` 二选一，同时传入时两者都会渲染 */
  zones?: readonly WorldClockZone[]
  /**
   * 排布方式
   * @default "list"
   */
  variant?: WorldClockVariant
  /**
   * 标题栏内容；传 `null` 隐藏整条标题栏
   * @default "WORLD CLOCK"
   */
  title?: React.ReactNode
  /**
   * BCP 47 区域标识，决定时间与数字的格式
   * @default "zh-CN"
   */
  locale?: string
  /**
   * 12 小时制（带上午/下午），默认 24 小时制
   * @default false
   */
  hour12?: boolean
  /**
   * 显示秒
   * @default true
   */
  showSeconds?: boolean
  /**
   * 在城市名下显示 UTC 偏移
   * @default true
   */
  showZone?: boolean
  /**
   * 数字变化时播放轻微的下落淡入；系统开启“减少动态效果”时自动关闭
   * @default true
   */
  animated?: boolean
  /** 覆盖部分可见文案 */
  labels?: Partial<LocalTimeLabels>
}

/** 世界时钟：多个时区同时显示，右侧标出与访客的时差、昼夜和日期差。 */
function WorldClock({
  zones,
  variant = "list",
  title,
  locale = "zh-CN",
  hour12 = false,
  showSeconds = true,
  showZone = true,
  animated = true,
  labels,
  className,
  children,
  ...props
}: WorldClockProps) {
  const text = React.useMemo(() => ({ ...DEFAULT_LABELS, ...labels }), [labels])
  const settings = React.useMemo(
    () => ({
      locale,
      hour12,
      showSeconds,
      showZone,
      animated,
      variant,
      labels: text,
    }),
    [locale, hour12, showSeconds, showZone, animated, variant, text],
  )
  const heading = title === undefined ? text.worldClock : title
  return (
    <WorldClockContext.Provider value={settings}>
      <div
        data-slot="world-clock"
        data-variant={variant}
        role="group"
        aria-label={typeof heading === "string" ? heading : text.worldClock}
        className={cn(
          "overflow-hidden rounded-lg border border-edge bg-background",
          className,
        )}
        {...props}
      >
        {heading === null ? null : (
          <div
            data-slot="world-clock-header"
            className="flex items-center justify-between gap-3 border-b border-edge px-3 py-2 font-mono text-[10px] tracking-[0.08em] text-muted-foreground"
          >
            <span className="min-w-0 truncate">{heading}</span>
            <span className="flex shrink-0 items-center gap-1.5">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-primary motion-safe:animate-pulse"
              />
              {text.live}
            </span>
          </div>
        )}
        <ul
          data-slot="world-clock-list"
          className={cn(
            variant === "list"
              ? "divide-y divide-edge"
              : // 单元格自带右、下边线，用负外边距把最外一圈挤出外框的裁剪区，避免与外框叠成双线
                "-mr-px -mb-px grid grid-cols-2 *:border-r *:border-b *:border-edge [&>li:last-child:nth-child(odd)]:col-span-2",
          )}
        >
          {zones?.map((zone) => (
            <WorldClockItem
              key={zone.timeZone}
              timeZone={zone.timeZone}
              label={zone.label}
              highlighted={zone.highlighted}
            />
          ))}
          {children}
        </ul>
      </div>
    </WorldClockContext.Provider>
  )
}

type WorldClockItemProps = Omit<React.ComponentProps<"li">, "children"> & {
  /** IANA 时区名 */
  timeZone: string
  /** 城市名 */
  label: React.ReactNode
  /**
   * 高亮这一项
   * @default false
   */
  highlighted?: boolean
}

/** 世界时钟中的一个城市；必须放在 `WorldClock` 里。 */
function WorldClockItem({
  timeZone,
  label,
  highlighted = false,
  className,
  ...props
}: WorldClockItemProps) {
  const { locale, hour12, showSeconds, showZone, animated, variant, labels } =
    React.useContext(WorldClockContext)
  const now = useNow(showSeconds ? 1000 : 60_000)
  const date = now === null ? null : new Date(now)
  const daylight = date ? isDaytime(zoneHour(timeZone, date)) : true
  const days = date ? dayOffset(timeZone, date) : 0
  const meta = date
    ? [
        days === 0 ? null : days > 0 ? labels.tomorrow : labels.yesterday,
        describeDifference(hourDifference(timeZone, date), locale, labels),
      ]
        .filter(Boolean)
        .join(" · ")
    : ""
  const zone = [
    timeZone.replaceAll("_", " "),
    date && showZone ? utcLabel(offsetMinutes(timeZone, date)) : null,
  ]
    .filter(Boolean)
    .join(" · ")
  const time = date ? (
    <time data-slot="world-clock-time" dateTime={date.toISOString()}>
      <TimeDigits
        parts={clockParts(date, { locale, timeZone, hour12, showSeconds })}
        animated={animated}
      />
    </time>
  ) : (
    <span data-slot="world-clock-time">
      {showSeconds ? "--:--:--" : "--:--"}
    </span>
  )
  const mark = date ? (
    <DayNightMark
      daylight={daylight}
      label={daylight ? labels.day : labels.night}
      className="size-3.5"
    />
  ) : null

  return (
    <li
      data-slot="world-clock-item"
      data-state={date ? "ready" : "pending"}
      data-highlighted={highlighted ? "" : undefined}
      data-daylight={date ? (daylight ? "day" : "night") : undefined}
      className={cn(
        "relative min-w-0 data-[highlighted]:bg-primary/5 data-[highlighted]:before:absolute data-[highlighted]:before:inset-y-0 data-[highlighted]:before:left-0 data-[highlighted]:before:w-0.5 data-[highlighted]:before:bg-primary",
        variant === "list"
          ? "flex items-center justify-between gap-3 px-3 py-2"
          : "flex flex-col items-center gap-2 px-3 py-4 text-center",
        className,
      )}
      {...props}
    >
      {variant === "cards" ? (
        <AnalogClock
          timeZone={timeZone}
          locale={locale}
          label={typeof label === "string" ? label : labels.clock}
          showSeconds={showSeconds}
          className="size-20"
        />
      ) : null}
      <div
        className={cn("min-w-0", variant === "list" ? "flex-1" : "max-w-full")}
      >
        <p className="truncate text-sm leading-5 font-medium">{label}</p>
        <p className="truncate font-mono text-[10px] leading-4 text-muted-foreground">
          {zone}
        </p>
      </div>
      <div
        className={cn(
          "shrink-0 font-mono",
          variant === "list" ? "text-right" : "text-center",
        )}
      >
        <p
          className={cn(
            "flex items-center gap-1.5 text-sm leading-5 tabular-nums",
            variant === "list" ? "justify-end" : "justify-center",
          )}
        >
          {mark}
          {time}
        </p>
        <p className="min-h-4 text-[10px] leading-4 whitespace-nowrap text-muted-foreground">
          {meta}
        </p>
      </div>
    </li>
  )
}

export { WorldClock, WorldClockItem }
export type {
  WorldClockItemProps,
  WorldClockProps,
  WorldClockVariant,
  WorldClockZone,
}
