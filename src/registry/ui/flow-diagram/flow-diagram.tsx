"use client"

import { useInView, useMotionValue, useReducedMotion } from "motion/react"
import {
  useEffect,
  useMemo,
  useRef,
  type ComponentProps,
  type ReactNode,
} from "react"

import { cn } from "@/lib/utils"

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
} from "./elements"
import { FlowClockContext, useFlowClock } from "./flow-clock"
import {
  FLOW_BEAM_SPEED,
  FLOW_LINE_SPEED,
  flowArrival,
  flowRoute,
  type FlowPoint,
  type FlowRoute,
} from "./route"
import type { FlowTone } from "./tone"

/**
 * 流程动画外框：点阵底纹 + 固定设计尺寸的 SVG，并提供统一的时间轴。
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
  dots = true,
  label,
  className,
  children,
  ...props
}: Omit<ComponentProps<"div">, "children"> & {
  /**
   * 设计画布宽度。子元素的坐标都以它为准，实际显示时等比缩小到容器宽度
   * @default 216
   */
  width?: number
  /**
   * 设计画布高度
   * @default 192
   */
  height?: number
  /**
   * 一轮循环的总时长（秒）
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
   * 是否显示向四周淡出的点阵底纹
   * @default true
   */
  dots?: boolean
  /** 图示的文字说明。传入后读屏会朗读它；不传则整个图示按纯装饰处理 */
  label?: string
  children?: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.4 })
  const reducedMotion = useReducedMotion()
  const time = useMotionValue(rest)
  const playing = inView && !reducedMotion

  useEffect(() => {
    if (reducedMotion) time.set(rest)
  }, [reducedMotion, rest, time])

  useEffect(() => {
    if (!playing) return
    let last = performance.now()
    let frame = requestAnimationFrame(function tick(now) {
      // 切回标签页时间差会很大，截断后动画从原地继续而不是跳一大段
      const delta = Math.min((now - last) / 1000, 0.1)
      last = now
      time.set((time.get() + delta) % duration)
      frame = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(frame)
  }, [playing, duration, time])

  const clock = useMemo(
    () => ({ time, duration, exit }),
    [time, duration, exit],
  )

  return (
    <div
      {...props}
      ref={ref}
      data-slot="flow-diagram"
      {...(label
        ? { role: "img", "aria-label": label }
        : { "aria-hidden": true })}
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        className,
      )}
    >
      {dots ? (
        // 点阵底纹向四周淡出，让图示像摆在图纸上
        <div className="pointer-events-none absolute inset-0 bg-dots [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />
      ) : null}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        fill="none"
        focusable="false"
        aria-hidden="true"
        className="relative h-auto max-w-full"
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
  useFlowClock,
}
export type { FlowPoint, FlowRoute, FlowTone }
