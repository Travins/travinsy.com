/** 用户可见文案。`{seconds}` 会被替换成剩余秒数。 */
const DEFAULT_LABELS = {
  /** 输入框的提示文字 */
  placeholder: "请输入手机号",
  /** 位数不够或号段不对时的提示，失焦后显示 */
  invalid: "请输入正确的手机号",
  /** 必填却没填时的提示 */
  required: "请输入手机号",
  /** 发送验证码按钮：初始 */
  send: "获取验证码",
  /** 发送中 */
  sending: "发送中…",
  /** 倒计时中 */
  countdown: "{seconds} 秒后重发",
  /** 倒计时结束 */
  resend: "重新获取",
}

type PhoneInputLabels = typeof DEFAULT_LABELS

/** 中国大陆手机号的位数 */
const PHONE_LENGTH = 11

/** 发送验证码后的默认冷却时间（秒） */
const DEFAULT_COOLDOWN = 60

export { DEFAULT_COOLDOWN, DEFAULT_LABELS, PHONE_LENGTH }
export type { PhoneInputLabels }
