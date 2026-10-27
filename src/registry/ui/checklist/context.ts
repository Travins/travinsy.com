import * as React from "react"

import type { FlowTone } from "@/registry/ui/flow-diagram/tone"

type ChecklistSize = "default" | "sm"

type ChecklistContextValue = {
  size: ChecklistSize
  tone: FlowTone
  autoplay: boolean
  /** 自动播放时已划掉的条数；还没开始走时为 null，用 `initialStep` 兜底 */
  step: number | null
  /** 列表里的条目数，由 `ChecklistList` 回报 */
  total: number
  /** 手动模式下已勾选的条数 */
  checked: number
  setTotal: (total: number) => void
  report: (index: number, checked: boolean) => void
}

const ChecklistContext = React.createContext<ChecklistContextValue | null>(null)
/** 条目在列表里的位置，由 `ChecklistList` 逐个提供，自动播放按它排序。 */
const ChecklistRowContext = React.createContext<{
  index: number
  count: number
} | null>(null)

/** 自动播放开始前（服务端输出、减少动态效果）显示的静态快照：划掉约六成。 */
function initialStep(count: number) {
  return Math.ceil(count * 0.6)
}

export { ChecklistContext, ChecklistRowContext, initialStep }
export type { ChecklistContextValue, ChecklistSize }
