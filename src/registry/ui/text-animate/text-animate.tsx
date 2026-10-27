"use client"

import * as React from "react"
import { motion, useInView } from "motion/react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import {
  flowToneStyle,
  type FlowToneName,
} from "@/registry/ui/flow-diagram/tone"
import {
  useTextTuning,
  useTextMotion,
  useTextEntrance,
  segmentText,
  textStyles,
} from "./shared"
import { TextScramble } from "./text-scramble"
import { TextAnimateTuningContext } from "./shared"
export type { TextAnimateTuning, TextAnimateReport } from "./shared"

const textFlipVariants = cva("relative inline-grid max-w-full align-baseline", {
  variants: {
    variant: {
      pill: "rounded-lg border border-edge bg-(--flow-tone)/10 px-2.5 py-0.5 text-(--flow-tone)",
      underline: "border-b-2 border-(--flow-tone) px-1 text-(--flow-tone)",
    },
  },
  defaultVariants: { variant: "pill" },
})

function TextFlip({
  words,
  interval = 2600,
  variant,
  tone = "primary",
  paused = false,
  className,
  style,
  children,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> &
  VariantProps<typeof textFlipVariants> & {
    words: string[]
    interval?: number
    /** 胶囊 / 下划线的色调，默认主题强调色。 */
    tone?: FlowToneName
    paused?: boolean
    /** 屏幕阅读器的完整替代文案。 */
    children?: string
  }) {
  const tuning = useTextTuning({ interval, paused, tone })
  interval = tuning.interval ?? interval
  paused = tuning.paused ?? paused
  tone = tuning.tone ?? tone
  const ref = React.useRef<HTMLSpanElement>(null)
  const measure = React.useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { amount: 0.2 })
  const reduced = useTextMotion()
  const [index, setIndex] = React.useState(0)
  const [width, setWidth] = React.useState<number>()
  const activeIndex = index % Math.max(1, words.length)
  const word = words[activeIndex] ?? ""

  React.useEffect(() => {
    if (paused || reduced || !inView || words.length < 2) return
    const timer = window.setInterval(
      () => {
        if (!document.hidden) setIndex((value) => value + 1)
      },
      Math.max(800, interval),
    )
    return () => window.clearInterval(timer)
  }, [paused, reduced, inView, interval, words.length])

  React.useEffect(() => {
    const element = measure.current
    if (!element) return
    const observer = new ResizeObserver(() =>
      setWidth(element.getBoundingClientRect().width),
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [word])

  return (
    <span
      {...props}
      ref={ref}
      data-slot="text-flip"
      data-interval={interval}
      data-paused={paused}
      data-tone={tone}
      className={cn(textFlipVariants({ variant }), className)}
      style={{ ...flowToneStyle(tone), ...style }}
    >
      <span className="sr-only">{children ?? words.join("、")}</span>
      <motion.span
        aria-hidden
        className="relative block overflow-hidden"
        animate={{ width: width ?? "auto" }}
        transition={{ duration: reduced ? 0 : 0.25 }}
      >
        <span
          ref={measure}
          className="pointer-events-none invisible absolute top-0 left-0 whitespace-nowrap"
        >
          {word}
        </span>
        <motion.span
          key={word}
          className="block whitespace-nowrap"
          initial={reduced ? false : { opacity: 0, y: ".4em", rotateX: -60 }}
          animate={{ opacity: 1, y: "0em", rotateX: 0 }}
          transition={{ duration: reduced ? 0 : 0.3 }}
        >
          {word}
        </motion.span>
      </motion.span>
    </span>
  )
}

function TextReveal({
  children,
  by = "char",
  trigger = "in-view",
  stagger = 35,
  locale = "zh-CN",
  className,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & {
  children: string
  by?: "char" | "word"
  trigger?: "mount" | "in-view"
  /** 相邻片段的延迟，毫秒。 */
  stagger?: number
  locale?: string
}) {
  const tuning = useTextTuning({ by, stagger })
  by = tuning.by ?? by
  stagger = tuning.stagger ?? stagger
  const { ref, active } = useTextEntrance(trigger)
  const parts = segmentText(children, by, locale, true)
  return (
    <span
      {...props}
      ref={ref}
      data-slot="text-reveal"
      data-by={by}
      data-stagger={stagger}
      data-active={active}
      className={cn("whitespace-pre-wrap", className)}
    >
      {textStyles()}
      <span className="sr-only">{children}</span>
      <span aria-hidden key={by + "-" + stagger}>
        {parts.map((part, index) => (
          <span
            key={index}
            data-slot="text-reveal-part"
            className={cn(!/^\s+$/.test(part) && "inline-block")}
            style={
              {
                "--text-delay": `${index * Math.max(0, stagger)}ms`,
              } as React.CSSProperties
            }
          >
            {part}
          </span>
        ))}
      </span>
    </span>
  )
}

const textHighlightVariants = cva("rounded-sm px-0.5", {
  variants: { variant: { block: "", underline: "rounded-none pb-0.5" } },
  defaultVariants: { variant: "block" },
})

function TextHighlight({
  children,
  tone = "primary",
  variant = "block",
  trigger = "in-view",
  className,
  style,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof textHighlightVariants> & {
    tone?: FlowToneName
    trigger?: "mount" | "in-view"
  }) {
  const tuning = useTextTuning({ tone })
  tone = tuning.tone ?? tone
  const { ref, active } = useTextEntrance(trigger)
  return (
    <span
      {...props}
      ref={ref}
      data-slot="text-highlight"
      data-tone={tone}
      data-variant={variant}
      data-active={active}
      className={cn(textHighlightVariants({ variant }), className)}
      style={
        {
          ...flowToneStyle(tone),
          "--text-tone": "var(--flow-tone)",
          ...style,
        } as React.CSSProperties
      }
    >
      {textStyles()}
      {children}
    </span>
  )
}

export {
  TextAnimateTuningContext,
  TextFlip,
  TextReveal,
  TextScramble,
  TextHighlight,
  textFlipVariants,
  textHighlightVariants,
}
