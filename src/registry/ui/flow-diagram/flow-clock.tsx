"use client"

import { createContext, useContext } from "react"
import type { MotionValue } from "motion/react"

type FlowClock = {
  /** 当前循环内的时间（秒） */
  time: MotionValue<number>
  /** 一轮循环的总时长（秒） */
  duration: number
  /** 从这一刻起动态内容淡出，循环末尾回到起点 */
  exit: number
}

const FlowClockContext = createContext<FlowClock | null>(null)

/** 读取 `FlowDiagram` 提供的时间轴，用来写自定义的动画元素。 */
function useFlowClock() {
  const clock = useContext(FlowClockContext)
  if (!clock) throw new Error("useFlowClock 只能在 FlowDiagram 内使用")
  return clock
}

export { FlowClockContext, useFlowClock }
export type { FlowClock }
