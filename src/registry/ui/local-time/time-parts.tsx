"use client"

import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { Moon, Sun } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * 一位数字；变化时旧数字向下淡出、新数字从上方落入。
 * 新旧两位叠在同一个 1ch 宽的格子里（grid 同格堆叠），过渡期间宽度不变，整行不会左右晃动。
 * 首次出现不播放，避免水合后整排数字同时闪一下。
 */
function TimeDigit({ value, animated }: { value: string; animated: boolean }) {
  if (!animated) return <>{value}</>
  return (
    <span
      data-slot="time-digit"
      className="inline-grid w-[1ch] justify-items-center *:col-start-1 *:row-start-1"
    >
      <AnimatePresence initial={false}>
        <motion.span
          key={value}
          initial={{ opacity: 0, y: "-0.35em" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "0.35em" }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

/**
 * 逐位渲染 `Intl.DateTimeFormat.formatToParts` 的结果。
 * 数字用 `tabular-nums` 等宽；分隔符与上午/下午等 dayPeriod 原样输出。
 */
function TimeDigits({
  parts,
  animated = false,
}: {
  parts: readonly Intl.DateTimeFormatPart[]
  /** 数字变化时是否播放过渡；系统开启“减少动态效果”时自动关闭 */
  animated?: boolean
}) {
  const reduced = useReducedMotion()
  const animate = animated && !reduced
  return (
    <span data-slot="time-digits" className="tabular-nums">
      {parts.map((part, index) =>
        part.type === "hour" ||
        part.type === "minute" ||
        part.type === "second" ? (
          <span key={part.type} data-part={part.type}>
            {Array.from(part.value).map((char, position) => (
              <TimeDigit key={position} value={char} animated={animate} />
            ))}
          </span>
        ) : (
          <span
            key={`${part.type}-${index}`}
            data-part={part.type}
            className={
              part.type === "dayPeriod" ? "mx-[0.2em] text-[0.8em]" : undefined
            }
          >
            {part.value}
          </span>
        ),
      )}
    </span>
  )
}

/** 昼夜标记：白天是太阳（主题强调色），夜间是月亮（弱化色）；图标只是装饰，文字给读屏。 */
function DayNightMark({
  daylight,
  label,
  className,
}: {
  daylight: boolean
  /** 读屏文字，如“白天” / “夜间” */
  label: string
  className?: string
}) {
  const Icon = daylight ? Sun : Moon
  return (
    <span
      data-slot="day-night-mark"
      data-daylight={daylight ? "day" : "night"}
      className={cn(
        "inline-flex shrink-0 align-[-0.125em]",
        daylight ? "text-primary" : "text-muted-foreground",
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-[1em]" />
      <span className="sr-only">{label}</span>
    </span>
  )
}

export { DayNightMark, TimeDigits }
