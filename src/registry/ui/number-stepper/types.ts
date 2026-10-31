import type * as React from "react"
import type { NumberField } from "@base-ui/react/number-field"

type NumberStepperSize = "sm" | "default" | "lg"

type NumberStepperLabels = {
  decrement: string
  increment: string
  input: string
  pending: string
  commitError: string
}

type NumberStepperProps = Omit<
  NumberField.Root.Props,
  | "value"
  | "defaultValue"
  | "onValueChange"
  | "onValueCommitted"
  | "children"
  | "className"
  | "render"
  | "allowOutOfRange"
  | "snapOnStep"
> & {
  /** 最小数量。
   * @default 0
   */
  min?: number
  /** 最大数量；达到后加号不可用。 */
  max?: number
  /** 步长；失焦按 min 为基准对齐，any 关闭对齐。
   * @default 1
   */
  step?: number | "any"
  /** 聚焦且指针悬停时，是否允许滚轮修改数值。
   * @default false
   */
  allowWheelScrub?: boolean
  /** 受控数值；null 表示未填写。 */
  value?: number | null
  /** 非受控初始值。
   * @default null
   */
  defaultValue?: number | null
  /** 数值改变时调用；提交失败回滚时也调用。 */
  onValueChange?: (value: number | null) => void
  /** 一次操作结束、停手 400ms 后提交；Promise 期间锁定控件，失败回滚。 */
  onValueCommit?: (value: number | null) => void | Promise<void>
  /** 提交失败时接收原始错误；Error.message 同时显示在条下。 */
  onCommitError?: (error: unknown) => void
  /** 条内左侧标签；不传时控件随内容收窄。 */
  label?: React.ReactNode
  /** 数字右侧的单位；独立展示并通过描述关联输入，不参与提交。默认不显示。 */
  unit?: React.ReactNode
  /** 高度 28 / 32 / 36px；触屏 36 / 40 / 44px。
   * @default "default"
   */
  size?: NumberStepperSize
  /** 外部校验提示，优先于提交错误。 */
  error?: React.ReactNode
  /** 覆盖按钮名称、无标签输入名称和提交提示。 */
  labels?: Partial<NumberStepperLabels>
  /** 根元素样式。 */
  className?: string
}

export type { NumberStepperLabels, NumberStepperProps, NumberStepperSize }
