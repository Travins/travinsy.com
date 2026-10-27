"use client"

import * as React from "react"
import { useInView } from "motion/react"

import { cn } from "@/lib/utils"
import { useControllableState } from "@/registry/hooks/use-controllable-state"
import { CardStackLayer } from "./card-stack-layer"
import { CardStackControls } from "./controls"
import {
  CardStackContext,
  useCardStackReducedMotion,
  DEFAULT_LABELS,
  type CardStackMode,
  type CardStackLabels,
} from "./context"

/** 文档调整覆盖项；不提供 Provider 时沿用组件属性。 */
type CardStackReport = {
  mode: CardStackMode
  interval: number
  depth: number
  offset: number
  scale: number
  paused: boolean
}
type CardStackTuning = Partial<CardStackReport> & {
  /** 固定调整期间的画框。@default false */
  stableFrame?: boolean
  /** 回报覆盖前的示例取值。 */
  onReport?: (report: CardStackReport) => void
}
const CardStackTuningContext = React.createContext<CardStackTuning>({})

type CardStackProps = React.ComponentProps<"div"> & {
  /** 也可用直接子级 CardStackItem；两者择一。 */
  items?: React.ReactNode[]
  mode?: CardStackMode
  interval?: number
  depth?: number
  /** 每层向下偏移的像素。 */
  offset?: number
  /** 每层缩小的比例，例如 0.04。 */
  scale?: number
  index?: number
  defaultIndex?: number
  onIndexChange?: (index: number) => void
  label?: string
  labels?: Partial<CardStackLabels>
}

function CardStack({
  items,
  children,
  mode: modeProp = "auto",
  interval: intervalProp = 4000,
  depth: depthProp = 3,
  offset: offsetProp = 12,
  scale: scaleProp = 0.04,
  index: indexProp,
  defaultIndex = 0,
  onIndexChange,
  label = "卡片堆叠",
  labels,
  className,
  style,
  onKeyDown,
  onMouseEnter,
  onMouseLeave,
  onFocusCapture,
  onBlurCapture,
  ...props
}: CardStackProps) {
  const tuning = React.useContext(CardStackTuningContext)
  const { onReport } = tuning
  const mode = tuning.mode ?? modeProp
  const interval = tuning.interval ?? intervalProp
  const depth = tuning.depth ?? depthProp
  const offset = tuning.offset ?? offsetProp
  const scale = tuning.scale ?? scaleProp

  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.2 })
  const reduced = useCardStackReducedMotion()
  const [hovered, setHovered] = React.useState(false)
  const [focused, setFocused] = React.useState(false)
  const [pausedState, setPaused] = React.useState(false)
  const paused = tuning.paused ?? pausedState
  React.useEffect(() => {
    onReport?.({
      mode: modeProp,
      interval: intervalProp,
      depth: depthProp,
      offset: offsetProp,
      scale: scaleProp,
      paused: pausedState,
    })
  }, [
    onReport,
    modeProp,
    intervalProp,
    depthProp,
    offsetProp,
    scaleProp,
    pausedState,
  ])

  const [hidden, setHidden] = React.useState(false)
  const [rawIndex, setIndex] = useControllableState({
    prop: indexProp,
    defaultProp: defaultIndex,
    onChange: onIndexChange,
  })
  const parts = React.Children.toArray(children)
  const controls = parts.filter(
    (child) => React.isValidElement(child) && child.type === CardStackControls,
  )
  const cards =
    items ??
    parts.filter(
      (child) => React.isValidElement(child) && child.type === CardStackItem,
    )
  const count = cards.length
  const index = count ? ((Math.trunc(rawIndex) % count) + count) % count : 0
  // 调整层数与偏移只移动图形，底部预留空间仍取示例自己的值。
  const framePadding =
    (Math.max(1, Math.min(count || 1, Math.floor(depthProp))) - 1) *
    Math.max(0, offsetProp)
  const safeDepth = Math.max(1, Math.min(count || 1, Math.floor(depth)))
  const safeOffset = Math.max(0, offset)
  const safeScale = Math.max(0, Math.min(scale, 0.2 / safeDepth))
  const text = { ...DEFAULT_LABELS, ...labels }
  const go = React.useCallback(
    (next: number) => {
      if (count > 1) setIndex(((next % count) + count) % count)
    },
    [count, setIndex],
  )

  React.useEffect(() => {
    function visibility() {
      setHidden(document.hidden)
    }
    visibility()
    document.addEventListener("visibilitychange", visibility)
    return () => document.removeEventListener("visibilitychange", visibility)
  }, [])

  React.useEffect(() => {
    if (
      mode !== "auto" ||
      count < 2 ||
      paused ||
      hovered ||
      focused ||
      hidden ||
      !inView
    )
      return
    const timer = window.setInterval(
      () => go(index + 1),
      Math.max(1000, interval),
    )
    return () => window.clearInterval(timer)
  }, [
    mode,
    count,
    paused,
    hovered,
    focused,
    hidden,
    inView,
    interval,
    index,
    go,
  ])

  return (
    <CardStackContext.Provider
      value={{ index, count, mode, paused, labels: text, setPaused, go }}
    >
      <div
        {...props}
        ref={ref}
        data-slot="card-stack"
        data-mode={mode}
        data-paused={paused}
        data-interval={interval}
        data-depth={safeDepth}
        data-offset={safeOffset}
        data-scale={safeScale}
        role="region"
        aria-roledescription={text.carousel}
        aria-label={label}
        tabIndex={0}
        className={cn(
          "w-full min-w-0 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          className,
        )}
        style={style}
        onMouseEnter={(event) => {
          onMouseEnter?.(event)
          setHovered(true)
        }}
        onMouseLeave={(event) => {
          onMouseLeave?.(event)
          setHovered(false)
        }}
        onFocusCapture={(event) => {
          onFocusCapture?.(event)
          setFocused(true)
        }}
        onBlurCapture={(event) => {
          onBlurCapture?.(event)
          if (!event.currentTarget.contains(event.relatedTarget))
            setFocused(false)
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event)
          if (
            event.defaultPrevented ||
            (event.target !== event.currentTarget &&
              !(event.target as HTMLElement).closest(
                '[data-slot="card-stack-controls"]',
              ))
          )
            return
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault()
            go(index + (event.key === "ArrowRight" ? 1 : -1))
          }
        }}
      >
        <div
          data-slot="card-stack-viewport"
          className="grid min-w-0"
          style={{
            paddingBottom: tuning.stableFrame
              ? framePadding
              : (safeDepth - 1) * safeOffset,
          }}
        >
          {cards.map((card, cardIndex) => {
            const level = (cardIndex - index + count) % count
            return (
              <CardStackLayer
                key={
                  React.isValidElement(card)
                    ? (card.key ?? cardIndex)
                    : cardIndex
                }
                level={level}
                visible={level < safeDepth}
                depth={safeDepth}
                offset={safeOffset}
                scale={safeScale}
                reduced={reduced}
                draggable={mode === "drag" && count > 1}
                roleDescription={text.slide}
                label={`${text.card} ${cardIndex + 1} / ${count}`}
                advance={() => go(index + 1)}
              >
                {card}
              </CardStackLayer>
            )
          })}
        </div>
        <span
          data-slot="card-stack-announcement"
          className="sr-only"
          aria-live={mode === "drag" || paused || focused ? "polite" : "off"}
          aria-atomic="true"
        >
          {count ? `${text.card} ${index + 1} / ${count}` : null}
        </span>
        {controls}
      </div>
    </CardStackContext.Provider>
  )
}

function CardStackItem({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-stack-item"
      className={cn(
        "h-full min-w-0 rounded-lg border border-edge bg-card p-6 break-words text-card-foreground",
        className,
      )}
      {...props}
    />
  )
}

export { CardStackTuningContext, CardStack, CardStackItem, CardStackControls }
export type {
  CardStackTuning,
  CardStackReport,
  CardStackProps,
  CardStackMode,
  CardStackLabels,
}
