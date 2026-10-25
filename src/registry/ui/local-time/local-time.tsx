"use client"

import { useEffect, useState } from "react"

/** 以指定 IANA 时区显示时间，并比较访客当前的时区偏移。 */
export function LocalTime({ timeZone }: { timeZone: string }) {
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
      <span className="tabular-nums">
        --:--:-- <span className="text-muted-foreground">{"// 当地时间"}</span>
      </span>
    )
  const formatter = new Intl.DateTimeFormat("zh-CN", {
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
      ? "与你同一时间"
      : `${difference > 0 ? "早" : "晚"} ${new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 2 }).format(Math.abs(difference))} 小时`
  return (
    <span className="tabular-nums">
      <time dateTime={now.toISOString()}>{formatter.format(now)}</time>{" "}
      <span className="text-muted-foreground">
        {"// "}
        {comparison}
      </span>
    </span>
  )
}
