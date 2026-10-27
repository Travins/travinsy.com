"use client"

import * as React from "react"
import { useInView } from "motion/react"

import { cn } from "@/lib/utils"
import { segmentText, textStyles, useTextMotion, useTextTuning } from "./shared"

const TEXT_CHARSETS = {
  latin: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!<>_+?/[]{}=",
  katakana: "アイウエオカキクケコサシスセソタチツテト",
  chinese: "界面组件线条网格构建系统开源设计",
}
type TextScrambleCharset = keyof typeof TEXT_CHARSETS

function TextScramble({
  children,
  trigger = "in-view",
  charset = "latin",
  characters,
  duration = 1000,
  className,
  onMouseEnter,
  onFocus,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & {
  children: string
  trigger?: "mount" | "hover" | "in-view"
  charset?: TextScrambleCharset
  /** 覆盖预设字符集；空字符串回退为拉丁字母。 */
  characters?: string
  duration?: number
}) {
  const tuning = useTextTuning({ charset, duration })
  charset = tuning.charset ?? charset
  duration = tuning.duration ?? duration
  // 面板明确选择预设时覆盖示例的自定义字符池。
  if (tuning.charset !== undefined) characters = undefined
  const ref = React.useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })
  const reduced = useTextMotion()
  const [run, setRun] = React.useState(0)
  const [frame, setFrame] = React.useState<number | null>(null)
  const parts = segmentText(children, "char")
  const pool = Array.from(characters || TEXT_CHARSETS[charset])
  const active =
    !reduced &&
    (trigger === "mount" ||
      (trigger === "in-view" && inView) ||
      (trigger === "hover" && run > 0))

  React.useEffect(() => {
    if (!active) return
    const start = performance.now()
    const length = segmentText(children, "char").length
    const totalFrames = Math.max(1, length + 8)
    const timer = window.setInterval(() => {
      const progress = (performance.now() - start) / Math.max(100, duration)
      setFrame(progress >= 1 ? null : Math.floor(progress * totalFrames))
      if (progress >= 1) window.clearInterval(timer)
    }, 40)
    return () => window.clearInterval(timer)
  }, [active, run, children, duration, charset, characters])

  return (
    <span
      {...props}
      ref={ref}
      data-slot="text-scramble"
      data-duration={duration}
      data-charset={charset}
      tabIndex={trigger === "hover" ? 0 : props.tabIndex}
      className={cn(
        "font-mono whitespace-pre-wrap outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
      onMouseEnter={(event) => {
        onMouseEnter?.(event)
        if (trigger === "hover") setRun((value) => value + 1)
      }}
      onFocus={(event) => {
        onFocus?.(event)
        if (trigger === "hover") setRun((value) => value + 1)
      }}
    >
      {textStyles()}
      <span className="sr-only">{children}</span>
      <span aria-hidden>
        {parts.map((part, index) => {
          const scrambling =
            active &&
            frame !== null &&
            index >= frame - 8 &&
            !/^\s+$/.test(part)
          return (
            <span key={index} className="relative inline-block">
              <span
                data-slot="text-scramble-final"
                className={cn(scrambling && "invisible")}
              >
                {part}
              </span>
              {scrambling ? (
                <span
                  data-slot="text-scramble-noise"
                  className="absolute inset-0 text-center"
                >
                  {pool[(index * 7 + frame * 11) % pool.length]}
                </span>
              ) : null}
            </span>
          )
        })}
      </span>
    </span>
  )
}

export { TextScramble }
export type { TextScrambleCharset }
