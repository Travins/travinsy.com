"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { useNow } from "@/registry/hooks/use-now"

import { AnalogClock, type AnalogClockProps } from "./analog-clock"
import { DEFAULT_LABELS, type LocalTimeLabels } from "./config"
import { DayNightMark, TimeDigits } from "./time-parts"
import {
  WorldClock,
  WorldClockItem,
  type WorldClockItemProps,
  type WorldClockProps,
  type WorldClockVariant,
  type WorldClockZone,
} from "./world-clock"
import {
  clockParts,
  describeDifference,
  hourDifference,
  isDaytime,
  offsetMinutes,
  utcLabel,
  zoneHour,
} from "./zone"

type LocalTimeProps = Omit<React.ComponentProps<"span">, "children"> & {
  /** IANA 时区名，例如 `Asia/Shanghai`，不支持 `+08:00` 这类固定偏移 */
  timeZone: string
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
   * 显示秒；关闭后每分钟才刷新一次
   * @default true
   */
  showSeconds?: boolean
  /**
   * 在 `//` 后显示与访客时区的时差
   * @default true
   */
  showDifference?: boolean
  /**
   * 在时间后显示 UTC 偏移，例如 `UTC+8`
   * @default false
   */
  showZone?: boolean
  /**
   * 在时间前显示昼夜图标（6:00–17:59 为白天）
   * @default false
   */
  showDayNight?: boolean
  /**
   * 数字变化时播放轻微的下落淡入；系统开启“减少动态效果”时自动关闭
   * @default false
   */
  animated?: boolean
  /** 覆盖部分可见文案 */
  labels?: Partial<LocalTimeLabels>
  /**
   * 挂载前的占位时间；默认随 `showSeconds` 为 `--:--:--` 或 `--:--`
   */
  placeholder?: string
  /** @deprecated 等价于 `labels.pending` */
  placeholderLabel?: string
  /** @deprecated 等价于 `labels.same` */
  sameTimeLabel?: string
  /** @deprecated 等价于 `labels.ahead` */
  aheadLabel?: string
  /** @deprecated 等价于 `labels.behind` */
  behindLabel?: string
  /** @deprecated 等价于 `labels.hourUnit` */
  hourUnit?: string
}

/** 以指定 IANA 时区显示时间，并可附带 UTC 偏移、昼夜图标与同访客的时差。 */
function LocalTime({
  timeZone,
  className,
  locale = "zh-CN",
  hour12 = false,
  showSeconds = true,
  showDifference = true,
  showZone = false,
  showDayNight = false,
  animated = false,
  labels,
  placeholder,
  placeholderLabel,
  sameTimeLabel,
  aheadLabel,
  behindLabel,
  hourUnit,
  ...props
}: LocalTimeProps) {
  // 不显示秒时按分钟对齐，减少无谓的重新渲染
  const now = useNow(showSeconds ? 1000 : 60_000)
  const text = {
    ...DEFAULT_LABELS,
    ...labels,
    ...(placeholderLabel !== undefined && { pending: placeholderLabel }),
    ...(sameTimeLabel !== undefined && { same: sameTimeLabel }),
    ...(aheadLabel !== undefined && { ahead: aheadLabel }),
    ...(behindLabel !== undefined && { behind: behindLabel }),
    ...(hourUnit !== undefined && { hourUnit }),
  }

  if (now === null)
    return (
      <span
        data-slot="local-time"
        data-state="pending"
        className={cn("tabular-nums", className)}
        {...props}
      >
        {showDayNight ? (
          <span aria-hidden="true" className="mr-1.5 inline-block size-[1em]" />
        ) : null}
        {placeholder ?? (showSeconds ? "--:--:--" : "--:--")}
        {showDifference ? (
          <>
            {" "}
            <span
              data-slot="local-time-note"
              className="text-muted-foreground"
            >{`// ${text.pending}`}</span>
          </>
        ) : null}
      </span>
    )

  const date = new Date(now)
  const daylight = isDaytime(zoneHour(timeZone, date))
  return (
    <span
      data-slot="local-time"
      data-state="ready"
      data-daylight={showDayNight ? (daylight ? "day" : "night") : undefined}
      className={cn("tabular-nums", className)}
      {...props}
    >
      {showDayNight ? (
        <DayNightMark
          daylight={daylight}
          label={daylight ? text.day : text.night}
          className="mr-1.5"
        />
      ) : null}
      <time data-slot="local-time-time" dateTime={date.toISOString()}>
        <TimeDigits
          parts={clockParts(date, { locale, timeZone, hour12, showSeconds })}
          animated={animated}
        />
      </time>
      {showZone ? (
        <>
          {" "}
          <span data-slot="local-time-zone" className="text-muted-foreground">
            {utcLabel(offsetMinutes(timeZone, date))}
          </span>
        </>
      ) : null}
      {showDifference ? (
        <>
          {" "}
          <span
            data-slot="local-time-note"
            className="text-muted-foreground"
          >{`// ${describeDifference(hourDifference(timeZone, date), locale, text)}`}</span>
        </>
      ) : null}
    </span>
  )
}

export { AnalogClock, LocalTime, WorldClock, WorldClockItem }
export type {
  AnalogClockProps,
  LocalTimeLabels,
  LocalTimeProps,
  WorldClockItemProps,
  WorldClockProps,
  WorldClockVariant,
  WorldClockZone,
}
