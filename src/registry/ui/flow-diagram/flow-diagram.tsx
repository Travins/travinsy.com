"use client"

import { useInView, useMotionValue, useReducedMotion } from "motion/react"
import {
  useEffect,
  useMemo,
  useRef,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from "react"

import { cn } from "@/lib/utils"

import {
  FADE_MASK,
  backgroundClasses,
  type FlowBackgroundName,
} from "./background"
import { FlowBeam } from "./beam"
import {
  FlowDiamond,
  FlowEdge,
  FlowLabel,
  FlowNode,
  FlowReveal,
  FlowSpinner,
  FlowStatusDot,
  FlowTypedText,
  type FlowIcon,
  type FlowNodeShape,
} from "./elements"
import { FlowClockContext, useFlowClock } from "./flow-clock"
import {
  FLOW_BEAM_SPEED,
  FLOW_LINE_SPEED,
  flowArrival,
  flowRoute,
  flowTextWidth,
  type FlowPoint,
  type FlowRoute,
} from "./route"
import { flowToneStyle, type FlowTone, type FlowToneName } from "./tone"

type FlowFit = "scale-down" | "contain" | "none"

const fitClasses: Record<FlowFit, string> = {
  // 只缩小不放大：容器比设计画布窄时等比缩小，宽时保持设计尺寸
  "scale-down": "h-auto max-w-full",
  // 等比缩放到刚好装进容器，容器宽时会放大
  contain: "size-full",
  // 始终保持设计尺寸，装不下的部分被外框裁掉
  none: "max-w-none shrink-0",
}

/**
 * 流程动画外框：底纹 + 固定设计尺寸的 SVG，并提供统一的时间轴。
 *
 * 所有动画都由同一个 `time` 推导，渲染期间不依赖 Date / 随机数，水合结果稳定：
 * - 初始（含服务端渲染、减少动态效果）停在 `rest`，即内容完整、没有光点的一帧；
 * - 进入视口后从 `rest` 继续走完停留 → 淡出 → 重新开始，所以不会闪一下；
 * - 离开视口暂停，不占 CPU。
 */
function FlowDiagram({
  width = 216,
  height = 192,
  duration = 8,
  exit = duration - 0.8,
  rest = exit - 0.2,
  tone = "primary",
  background = "dots",
  fade = true,
  backgroundClassName,
  fit = "scale-down",
  loop = true,
  trigger = "in-view",
  paused = false,
  speed = 1,
  label,
  className,
  style,
  children,
  ...props
}: Omit<ComponentProps<"div">, "children"> & {
  /**
   * 设计画布宽度。子元素的坐标都以它为准，实际显示时按 `fit` 缩放
   * @default 216
   */
  width?: number
  /**
   * 设计画布高度
   * @default 192
   */
  height?: number
  /**
   * 一轮循环的总时长（秒），不含 `speed` 的换算
   * @default 8
   */
  duration?: number
  /**
   * 从这一刻起内容淡出，循环末尾回到起点
   * @default duration - 0.8
   */
  exit?: number
  /**
   * 静帧停留的时刻：服务端渲染、首帧与“减少动态效果”下显示的就是这一刻的画面，
   * 应落在所有内容都已点亮、光点都已飞完之后、`exit` 之前
   * @default exit - 0.2
   */
  rest?: number
  /**
   * 默认色调：里面没有指定 `tone` 的原语都用它。可以是内置色调名，也可以是任意 CSS 颜色
   * @default "primary"
   */
  tone?: FlowTone
  /**
   * 底纹：`dots` 点阵、`grid` 方格、`lines` 横线、`hatch` 斜纹、`none` 无；
   * 也可以传一个元素自定义底纹，它会被放进铺满外框的绝对定位层里
   * @default "dots"
   */
  background?: FlowBackgroundName | ReactElement
  /**
   * 底纹是否向四周淡出
   * @default true
   */
  fade?: boolean
  /** 追加到底纹层的类名，可以调整透明度，或者配合 `background="none"` 写自己的底纹 */
  backgroundClassName?: string
  /**
   * 画布如何适应外框：`scale-down` 只缩小不放大，`contain` 等比缩放到装进外框（会放大），
   * `none` 始终保持设计尺寸
   * @default "scale-down"
   */
  fit?: FlowFit
  /**
   * 是否循环播放。设为 `false` 时从头播一遍，停在 `rest` 这一帧，不再淡出重来
   * @default true
   */
  loop?: boolean
  /**
   * 何时播放：`in-view` 进入视口才播、离开暂停，`always` 只要没暂停就一直播
   * @default "in-view"
   */
  trigger?: "in-view" | "always"
  /**
   * 暂停播放，画面停在当前这一刻（还没开始播时就是 `rest` 静帧）。可以由外部控制
   * @default false
   */
  paused?: boolean
  /**
   * 播放速度倍率，作用在整条时间轴上：2 是两倍速，0.5 是半速
   * @default 1
   */
  speed?: number
  /** 图示的文字说明。传入后读屏会朗读它；不传则整个图示按纯装饰处理 */
  label?: string
  children?: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.4 })
  const reducedMotion = useReducedMotion()
  const time = useMotionValue(rest)
  const playing = !paused && !reducedMotion && (trigger === "always" || inView)
  // 单次播放：是否已经从头开始过 / 已经播完
  const began = useRef(false)
  const finished = useRef(false)

  useEffect(() => {
    if (reducedMotion) time.set(rest)
  }, [reducedMotion, rest, time])

  // 切换循环模式后重新计一轮
  useEffect(() => {
    began.current = false
    finished.current = false
  }, [loop])

  useEffect(() => {
    if (!playing || (!loop && finished.current)) return
    // 单次播放从起点开始；首帧是 rest 静帧，所以会从完整画面跳回空白再播
    if (!loop && !began.current) {
      began.current = true
      time.set(0)
    }
    let last = performance.now()
    let frame = requestAnimationFrame(function tick(now) {
      // 切回标签页时间差会很大，截断后动画从原地继续而不是跳一大段
      const delta = Math.min((now - last) / 1000, 0.1) * speed
      last = now
      const next = time.get() + delta
      if (loop) {
        time.set(next % duration)
      } else if (next >= rest) {
        time.set(rest)
        finished.current = true
        return
      } else {
        time.set(next)
      }
      frame = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(frame)
  }, [playing, loop, speed, duration, rest, time])

  const clock = useMemo(
    () => ({ time, duration, exit }),
    [time, duration, exit],
  )

  const preset = typeof background === "string" ? background : undefined

  return (
    <div
      {...props}
      ref={ref}
      data-slot="flow-diagram"
      {...(label
        ? { role: "img", "aria-label": label }
        : { "aria-hidden": true })}
      style={{ ...flowToneStyle(tone), ...style }}
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        className,
      )}
    >
      {preset !== "none" || backgroundClassName ? (
        <div
          data-slot="flow-diagram-background"
          className={cn(
            "pointer-events-none absolute inset-0",
            preset && backgroundClasses[preset],
            fade && FADE_MASK,
            backgroundClassName,
          )}
        >
          {typeof background === "string" ? null : background}
        </div>
      ) : null}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        fill="none"
        focusable="false"
        aria-hidden="true"
        className={cn("relative", fitClasses[fit])}
      >
        {/* 整体平移半像素，1px 的线落在像素中心，边缘才清晰 */}
        <g transform="translate(0.5 0.5)">
          <FlowClockContext.Provider value={clock}>
            {children}
          </FlowClockContext.Provider>
        </g>
      </svg>
    </div>
  )
}

export {
  FLOW_BEAM_SPEED,
  FLOW_LINE_SPEED,
  FlowBeam,
  FlowDiagram,
  FlowDiamond,
  FlowEdge,
  FlowLabel,
  FlowNode,
  FlowReveal,
  FlowSpinner,
  FlowStatusDot,
  FlowTypedText,
  flowArrival,
  flowRoute,
  flowTextWidth,
  flowToneStyle,
  useFlowClock,
}
export type {
  FlowBackgroundName,
  FlowFit,
  FlowIcon,
  FlowNodeShape,
  FlowPoint,
  FlowRoute,
  FlowTone,
  FlowToneName,
}
