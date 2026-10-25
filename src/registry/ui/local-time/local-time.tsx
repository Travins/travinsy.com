"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

/** 以指定 IANA 时区显示时间，并比较访客当前的时区偏移。 */
function LocalTime({
  timeZone,
  className,
  locale = "zh-CN",
  placeholder = "--:--:--",
  placeholderLabel = "当地时间",
  sameTimeLabel = "与你同一时间",
  aheadLabel = "早",
  behindLabel = "晚",
  hourUnit = "小时",
}: {
  /** IANA 时区名，例如 `Asia/Shanghai`，不支持 `+08:00` 这类固定偏移 */
  timeZone: string
  className?: string
  /** BCP 47 区域标识，决定时间与数字的格式，默认 `zh-CN` */
  locale?: string
  /** 挂载前的占位时间，默认 `--:--:--` */
  placeholder?: string
  /** 占位时间后的说明，默认 `当地时间` */
  placeholderLabel?: string
  /** 与访客时区相同时的说明，默认 `与你同一时间` */
  sameTimeLabel?: string
  /** 目标时区更早时的前缀，默认 `早` */
  aheadLabel?: string
  /** 目标时区更晚时的前缀，默认 `晚` */
  behindLabel?: string
  /** 时差的单位，默认 `小时` */
  hourUnit?: string
}) {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    const update = () => setNow(new Date())
    const first = window.setTimeout(update, 0)
    const timer = window.setInterval(update, 1000)
    return () => {
      window.clearTimeout(first)
      window.clearInterval(timer)
    }
  }, [])

  if (!now)
    return (
      <span
        data-slot="local-time"
        data-state="pending"
        className={cn("tabular-nums", className)}
      >
        {placeholder}{" "}
        <span
          data-slot="local-time-note"
          className="text-muted-foreground"
        >{`// ${placeholderLabel}`}</span>
      </span>
    )
  const formatter = new Intl.DateTimeFormat(locale, {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  })
  const zone =
    new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "longOffset" })
      .formatToParts(now)
      .find((part) => part.type === "timeZoneName")?.value ?? "GMT"
  const offset = zone.match(/GMT([+-])(\d{2}):(\d{2})/)
  const targetMinutes = offset
    ? (Number(offset[2]) * 60 + Number(offset[3])) *
      (offset[1] === "+" ? 1 : -1)
    : 0
  const difference = (targetMinutes + now.getTimezoneOffset()) / 60
  const comparison =
    difference === 0
      ? sameTimeLabel
      : `${difference > 0 ? aheadLabel : behindLabel} ${new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(Math.abs(difference))} ${hourUnit}`
  return (
    <span
      data-slot="local-time"
      data-state="ready"
      className={cn("tabular-nums", className)}
    >
      <time data-slot="local-time-time" dateTime={now.toISOString()}>
        {formatter.format(now)}
      </time>{" "}
      <span
        data-slot="local-time-note"
        className="text-muted-foreground"
      >{`// ${comparison}`}</span>
    </span>
  )
}

export { LocalTime }
