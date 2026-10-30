import type * as React from "react"

import type { IdNumberInputLabels } from "./config"

type IdNumberKind = "idcard" | "bankcard" | "uscc"
type IdNumberInputSize = "sm" | "default" | "lg"

type IdNumberInputProps = Omit<
  React.ComponentProps<"input">,
  | "value"
  | "defaultValue"
  | "onChange"
  | "type"
  | "size"
  | "children"
  | "inputMode"
  | "autoCapitalize"
> & {
  /** 号码类型，默认身份证号。 */
  kind?: IdNumberKind
  /** 不带分隔符的原始号码；小写字母自动转大写。 */
  value?: string
  /** 非受控初始值，默认空串。 */
  defaultValue?: string
  /** 变化后的原始号码。 */
  onValueChange?: (value: string) => void
  /** 方条内左侧标签。 */
  label?: React.ReactNode
  /** 高度 28 / 32 / 36px，触屏上 36 / 40 / 44px。 */
  size?: IdNumberInputSize
  /** 外部错误优先显示，并阻止表单提交。 */
  error?: React.ReactNode
  /** 接受 15 位旧身份证，只检查位数和日期，不转换。默认 false。 */
  allowLegacy15?: boolean
  /** 银行卡默认只校验 16–19 位；可选 Luhn 校验。 */
  bankcardCheck?: "length" | "luhn"
  /** 身份证校验通过后显示出生日期与性别，默认 true。 */
  showParsed?: boolean
  /** 银行卡显示位数，默认 false。 */
  showLength?: boolean
  /** 未聚焦时打码；只影响显示，默认 false。 */
  mask?: boolean
  labels?: Partial<IdNumberInputLabels>
}

export type { IdNumberInputProps, IdNumberInputSize, IdNumberKind }
