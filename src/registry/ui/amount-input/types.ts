import type * as React from "react"

import type { AmountInputLabels } from "./config"

type AmountInputSize = "sm" | "default" | "lg"

type AmountInputVariant = "bar" | "display"

type AmountInputProps = Omit<
  React.ComponentProps<"input">,
  | "value"
  | "defaultValue"
  | "onChange"
  | "type"
  | "size"
  | "prefix"
  | "min"
  | "max"
  | "children"
> & {
  /**
   * 金额，十进制字符串（`"1234.5"`，不带千分位）；空串表示没填。受控时传入。
   * 用字符串而不是 number：万亿级金额和 `0.1 + 0.2` 都不会丢精度，也能保留用户敲的 `1234.50`。
   */
  value?: string
  /**
   * 非受控时的初始金额
   * @default ""
   */
  defaultValue?: string
  /** 金额变化时回调，参数是不带千分位、不带悬空小数点的十进制字符串 */
  onValueChange?: (value: string) => void
  /** 最小值；为负数时才允许输入负号。越界不会拦截输入，失焦后提示并阻止表单提交 */
  min?: number | string
  /** 最大值；超过时立即提示并阻止表单提交 */
  max?: number | string
  /**
   * 小数位上限，超出的位直接舍去；0 表示只能输入整数
   * @default 2
   */
  decimals?: number
  /**
   * 前缀货币符号；传 `null` 隐藏
   * @default "¥"
   */
  symbol?: React.ReactNode
  /** 标签，自动与输入框关联。`bar` 写在条内左侧、金额随之靠右；`display` 写在金额上方 */
  label?: React.ReactNode
  /**
   * 外观：`bar` 方条，和其他表单控件排在一起；`display` 大字，用作付款、转账页上的主金额，标签写在上方
   * @default "bar"
   */
  variant?: AmountInputVariant
  /**
   * 档位：`bar` 是高度 28 / 32 / 36px（触屏设备上 36 / 40 / 44px），`display` 是数字字号 24 / 30 / 36px
   * @default "default"
   */
  size?: AmountInputSize
  /**
   * 显示人民币大写
   * @default true
   */
  showUppercase?: boolean
  /**
   * 金额较大时显示「约 1.2亿」式估读
   * @default true
   */
  showApproximate?: boolean
  /**
   * 绝对值达到这个数才显示估读
   * @default 10000
   */
  approximateFrom?: number
  /**
   * 读数行在输入框的上方还是下方
   * @default "below"
   */
  readoutPlacement?: "above" | "below"
  /** 外部校验的错误提示，有值即进入错误态；与越界提示同时存在时优先显示它 */
  error?: React.ReactNode
  /**
   * 失焦时把小数位补齐到 `decimals`（`1,234.5` → `1,234.50`）
   * @default true
   */
  padDecimals?: boolean
  /** 覆盖用户可见文案 */
  labels?: Partial<AmountInputLabels>
}

export type { AmountInputProps, AmountInputSize, AmountInputVariant }
