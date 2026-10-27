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
  useTextMotion,
  useTextEntrance,
  segmentText,
  textStyles,
} from "./shared"
import { TextScramble } from "./text-scramble"

const textFlipVariants = cva("relative inline-grid max-w-full align-baseline", {
  variants: {
    variant: {
      pill: "rounded-lg border border-edge bg-primary/10 px-2.5 py-0.5 text-primary",
      underline: "border-b-2 border-primary px-1 text-primary",
    },
  },
  defaultVariants: { variant: "pill" },
})

function TextFlip({
  words,
  interval = 2600,
  variant,
  paused = false,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> &
  VariantProps<typeof textFlipVariants> & {
    words: string[]
    interval?: number
    paused?: boolean
    /** 屏幕阅读器的完整替代文案。 */
    children?: string
  }) {
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
      className={cn(textFlipVariants({ variant }), className)}
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
  const { ref, active } = useTextEntrance(trigger)
  const parts = segmentText(children, by, locale)
  return (
    <span
      {...props}
      ref={ref}
      data-slot="text-reveal"
      data-active={active}
      className={cn("whitespace-pre-wrap", className)}
    >
      {textStyles()}
      <span className="sr-only">{children}</span>
      <span aria-hidden>
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
  const { ref, active } = useTextEntrance(trigger)
  return (
    <span
      {...props}
      ref={ref}
      data-slot="text-highlight"
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
  TextFlip,
  TextReveal,
  TextScramble,
  TextHighlight,
  textFlipVariants,
  textHighlightVariants,
}
