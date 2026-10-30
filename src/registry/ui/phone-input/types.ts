import type * as React from "react"

import type { PhoneInputLabels } from "./config"

type PhoneInputSize = "sm" | "default" | "lg"

type PhoneInputProps = Omit<
  React.ComponentProps<"input">,
  "value" | "defaultValue" | "onChange" | "type" | "size" | "children"
> & {
  /** 手机号，11 位纯数字字符串（不带空格、区号）；空串表示没填。受控时传入 */
  value?: string
  /**
   * 非受控时的初始值
   * @default ""
   */
  defaultValue?: string
  /** 号码变化时回调，参数是纯数字字符串 */
  onValueChange?: (value: string) => void
  /** 写在条内左侧的标签，自动与输入框关联；传入后号码靠右 */
  label?: React.ReactNode
  /**
   * 档位：高度 28 / 32 / 36px，触屏设备上 36 / 40 / 44px
   * @default "default"
   */
  size?: PhoneInputSize
  /** 条内右侧的附加内容，通常放 `PhoneInputSendButton`（获取验证码） */
  action?: React.ReactNode
  /**
   * 错误提示：显示在条下方，条变红。不传时组件自己校验，失焦后位数不够或号段不对会提示
   */
  error?: React.ReactNode
  labels?: Partial<PhoneInputLabels>
}

type PhoneInputSendButtonProps = Omit<
  React.ComponentProps<"button">,
  "onClick" | "children"
> & {
  /**
   * 点击后执行的发送动作，返回 Promise 时等它完成再开始倒计时；抛错时不进入倒计时，可以马上重试
   */
  onSend: () => void | Promise<void>
  /**
   * 冷却时间（秒）
   * @default 60
   */
  cooldown?: number
  /**
   * `inline` 放在手机号方条里（左侧一道竖线、主题色文字）；`button` 单独使用，和按钮同一外观
   * @default "inline"
   */
  variant?: "inline" | "button"
  /**
   * `button` 外观的高度档位，与按钮一致：28 / 32 / 36px
   * @default "default"
   */
  size?: "sm" | "default" | "lg"
  labels?: Partial<PhoneInputLabels>
}

export type { PhoneInputProps, PhoneInputSendButtonProps, PhoneInputSize }
