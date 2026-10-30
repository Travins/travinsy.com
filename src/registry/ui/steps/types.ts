import type * as React from "react"

import type { StepsLabels } from "./config"

type StepStatus = "wait" | "process" | "finish" | "error"

type StepItem = {
  /** 步骤标题，长标题自动换行 */
  title: React.ReactNode
  /** 补充信息，竖排时靠右显示 */
  description?: React.ReactNode
  /** 覆盖按当前索引推导的状态 */
  status?: StepStatus
  /** 禁止回到这一步；不影响其状态显示。@default false */
  disabled?: boolean
}

type StepsProps = Omit<
  React.ComponentProps<"div">,
  "children" | "defaultValue"
> & {
  /** 按流程顺序排列的步骤 */
  items: StepItem[]
  /** 当前步骤索引，从 0 开始；受控时传入 */
  value?: number
  /** 非受控初始索引。@default 0 */
  defaultValue?: number
  /** 用户请求回到某一步；受控时由调用方校验后更新 value */
  onValueChange?: (value: number) => void
  /** auto 在容器窄于 28rem 时切换 compact。@default "horizontal" */
  orientation?: "horizontal" | "vertical" | "auto"
  /** compact 显示当前步摘要和分段进度。@default "default" */
  variant?: "default" | "compact"
  /** completed 只允许回到当前索引之前且状态为 finish 的步骤。@default "completed" */
  clickable?: "completed" | "none"
  /** 圆点与文字尺寸；竖排行最小高 36px，触屏 44px。@default "default" */
  size?: "sm" | "default"
  /** 覆盖中文摘要、状态与列表名称 */
  labels?: Partial<StepsLabels>
}

export type { StepItem, StepStatus, StepsProps }
