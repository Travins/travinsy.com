import type * as React from "react"
import type { OTPField } from "@base-ui/react/otp-field"

import type { OtpInputLabels } from "./config"

type OtpInputSize = "sm" | "default" | "lg"

type OtpInputProps = Omit<
  OTPField.Root.Props,
  "length" | "children" | "render" | "className"
> & {
  /**
   * 位数
   * @default 6
   */
  length?: number
  /**
   * 每几位之间加一道短横线，如 `3` 把 6 位分成 3-3；不传不分组
   */
  groupSize?: number
  /**
   * 格子大小：`sm` 32 × 36px、`default` 40 × 44px、`lg` 44 × 52px；触屏设备上各放大一档
   * @default "default"
   */
  size?: OtpInputSize
  /**
   * 格子与错误提示的对齐：表单里跟着标签左对齐用 `start`；单独一屏输验证码（登录页、弹窗）用 `center`
   * @default "start"
   */
  align?: "start" | "center"
  /** 错误提示：显示在格子下方，所有格子变红 */
  error?: React.ReactNode
  /** 格子组的可访问名称（第一格的读屏名称），没有可见标签时传 */
  "aria-label"?: string
  className?: string
  labels?: Partial<OtpInputLabels>
}

export type { OtpInputProps, OtpInputSize }
