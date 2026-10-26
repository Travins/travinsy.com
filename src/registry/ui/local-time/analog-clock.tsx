"use client"

import * as React from "react"
import { useAnimationFrame, useInView, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"
import { useNow } from "@/registry/hooks/use-now"

import { DEFAULT_LABELS } from "./config"
import { isDaytime, offsetMinutes, zoneHour } from "./zone"

type AnalogClockProps = Omit<React.ComponentProps<"svg">, "children"> & {
  /** IANA 时区名，例如 `Asia/Shanghai` */
  timeZone: string
  /**
   * BCP 47 区域标识，决定读屏标签里的时间格式
   * @default "zh-CN"
   */
  locale?: string
  /**
   * 显示秒针
   * @default true
   */
  showSeconds?: boolean
  /**
   * 指针每帧平滑转动；关闭后按秒跳格。系统开启“减少动态效果”时自动按秒跳格
   * @default true
   */
  smooth?: boolean
  /**
   * 读屏名称，后面会拼上当前时间
   * @default "当地时间"
   */
  label?: string
}

/** 时间折算成三根指针的角度（度）；`seconds` 带毫秒，用于平滑转动。 */
function handAngles(zonedSeconds: number) {
  const day = ((zonedSeconds % 86_400) + 86_400) % 86_400
  return {
    hour: (day % 43_200) / 120,
    minute: (day % 3600) / 10,
    second: (day % 60) * 6,
  }
}

/**
 * SVG 模拟表盘。表盘随昼夜轻微变色，秒针用主题强调色。
 * 平滑模式下指针由 `requestAnimationFrame` 直接写入 transform，不经过 React 渲染；
 * 离开视口时暂停。
 */
function AnalogClock({
  timeZone,
  locale = "zh-CN",
  showSeconds = true,
  smooth = true,
  label = DEFAULT_LABELS.clock,
  className,
  ...props
}: AnalogClockProps) {
  const reduced = useReducedMotion()
  const continuous = smooth && !reduced
  const now = useNow(continuous ? 60_000 : 1000)
  const ref = React.useRef<SVGSVGElement>(null)
  const inView = useInView(ref)
  const hands = React.useRef<
    Record<"hour" | "minute" | "second", SVGGElement | null>
  >({ hour: null, minute: null, second: null })
  const date = now === null ? null : new Date(now)
  const offset = date ? offsetMinutes(timeZone, date) : null
  // 动画帧里不能再算时区：偏移随渲染（至少每分钟）更新到 ref，帧回调只做加法
  const offsetRef = React.useRef<number | null>(null)
  React.useEffect(() => {
    offsetRef.current = offset
  }, [offset])

  useAnimationFrame(() => {
    if (!continuous || !inView || offsetRef.current === null) return
    const angles = handAngles(Date.now() / 1000 + offsetRef.current * 60)
    hands.current.hour?.setAttribute(
      "transform",
      `rotate(${angles.hour} 50 50)`,
    )
    hands.current.minute?.setAttribute(
      "transform",
      `rotate(${angles.minute} 50 50)`,
    )
    hands.current.second?.setAttribute(
      "transform",
      `rotate(${angles.second} 50 50)`,
    )
  })

  // 非平滑模式由 React 按秒写入角度；平滑模式只写初始值 0，之后交给动画帧
  const stepped =
    !continuous && date && offset !== null
      ? handAngles(Math.floor(date.getTime() / 1000) + offset * 60)
      : { hour: 0, minute: 0, second: 0 }
  const daylight = date ? isDaytime(zoneHour(timeZone, date)) : true
  const description = date
    ? `${label} ${new Intl.DateTimeFormat(locale, {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      }).format(date)}`
    : label

  return (
    <svg
      ref={ref}
      data-slot="analog-clock"
      data-state={date ? "ready" : "pending"}
      data-daylight={daylight ? "day" : "night"}
      viewBox="0 0 100 100"
      role="img"
      aria-label={description}
      className={cn("size-28 text-foreground", className)}
      {...props}
    >
      <circle
        cx="50"
        cy="50"
        r="48.5"
        className={cn(
          "stroke-edge",
          daylight ? "fill-background" : "fill-foreground/5",
        )}
        strokeWidth="1"
      />
      {Array.from({ length: 12 }, (_, index) => (
        <line
          key={index}
          x1="50"
          x2="50"
          y1={index % 3 === 0 ? 6 : 8}
          y2={index % 3 === 0 ? 13 : 11.5}
          transform={`rotate(${index * 30} 50 50)`}
          className={
            index % 3 === 0 ? "stroke-foreground/70" : "stroke-foreground/30"
          }
          strokeWidth={index % 3 === 0 ? 1.6 : 1}
          strokeLinecap="round"
        />
      ))}
      <g
        ref={(node) => void (hands.current.hour = node)}
        transform={`rotate(${stepped.hour} 50 50)`}
      >
        <line
          x1="50"
          y1="54"
          x2="50"
          y2="29"
          className="stroke-foreground"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
      <g
        ref={(node) => void (hands.current.minute = node)}
        transform={`rotate(${stepped.minute} 50 50)`}
      >
        <line
          x1="50"
          y1="56"
          x2="50"
          y2="17"
          className="stroke-foreground"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
      {showSeconds ? (
        <g
          ref={(node) => void (hands.current.second = node)}
          transform={`rotate(${stepped.second} 50 50)`}
        >
          <line
            x1="50"
            y1="60"
            x2="50"
            y2="13"
            className="stroke-primary"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </g>
      ) : null}
      <circle cx="50" cy="50" r="2.4" className="fill-primary" />
      <circle cx="50" cy="50" r="0.9" className="fill-background" />
    </svg>
  )
}

export { AnalogClock }
export type { AnalogClockProps }
