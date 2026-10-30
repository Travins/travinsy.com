"use client"

import * as React from "react"
import { cva } from "class-variance-authority"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { DEFAULT_COOLDOWN, DEFAULT_LABELS } from "./config"
import type { PhoneInputSendButtonProps } from "./types"

/**
 * 手机号方条：与方条开关、金额输入同一套外观（浅灰底、细边框、标签在条内左侧）。
 * 高度只来自既有三档 28 / 32 / 36px，触屏设备上各加高一档（36 / 40 / 44px）；
 * 手机上字号保持 16px，iOS 聚焦时才不会自动放大页面
 */
const phoneInputControlVariants = cva(
  "flex w-full min-w-0 cursor-text items-center gap-3 rounded-md border bg-muted/60 px-3 transition-colors",
  {
    variants: {
      size: {
        sm: "h-7 text-base pointer-coarse:h-9 md:text-xs",
        default: "h-8 text-base pointer-coarse:h-10 md:text-sm",
        lg: "h-9 text-base pointer-coarse:h-11 md:text-sm",
      },
    },
    defaultVariants: { size: "default" },
  },
)

/** 手机号方条把「号码是否有效」告诉条内的发送按钮：号码不完整时按钮自动置灰 */
const PhoneInputContext = React.createContext<{ valid: boolean } | null>(null)

type SendState = "idle" | "sending" | "counting" | "again"

/**
 * 「获取验证码」的状态：发送中 → 倒计时 → 可以重新获取。
 * 剩余秒数按截止时间算，页面切到后台计时器变慢也不会多等。
 */
function useSendCode(onSend: () => void | Promise<void>, cooldown: number) {
  const [state, setState] = React.useState<SendState>("idle")
  const [deadline, setDeadline] = React.useState(0)
  const [now, setNow] = React.useState(0)

  React.useEffect(() => {
    if (state !== "counting") return
    const timer = window.setInterval(() => {
      const current = Date.now()
      setNow(current)
      if (current >= deadline) setState("again")
    }, 250)
    return () => window.clearInterval(timer)
  }, [state, deadline])

  const send = async () => {
    if (state === "sending" || state === "counting") return
    const previous = state
    setState("sending")
    try {
      await onSend()
    } catch {
      // 发送失败不进入倒计时，用户可以马上重试；错误提示由调用方处理
      setState(previous)
      return
    }
    const start = Date.now()
    setNow(start)
    setDeadline(start + cooldown * 1000)
    setState("counting")
  }

  const remaining = Math.max(0, Math.ceil((deadline - now) / 1000))
  return { state, remaining, send }
}

/** 获取验证码按钮：放进手机号方条的 `action`，也可以单独用在邮箱等别的输入旁边 */
function PhoneInputSendButton({
  onSend,
  cooldown = DEFAULT_COOLDOWN,
  variant = "inline",
  size = "default",
  labels: labelsProp,
  disabled,
  className,
  ...props
}: PhoneInputSendButtonProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp }
  const context = React.useContext(PhoneInputContext)
  const { state, remaining, send } = useSendCode(onSend, cooldown)
  const busy = state === "sending" || state === "counting"
  const text =
    state === "sending"
      ? labels.sending
      : state === "counting"
        ? labels.countdown.replace("{seconds}", String(remaining))
        : state === "again"
          ? labels.resend
          : labels.send
  // 四种状态的文字长短不一，宽度会跟着跳。把它们都叠在同一格里（只显示当前这一个），
  // 按钮宽度取最长的那个；倒计时用冷却秒数占位（位数最多），数字是等宽的
  const sizers = [
    labels.send,
    labels.sending,
    labels.countdown.replace("{seconds}", String(cooldown)),
    labels.resend,
  ]

  return (
    <button
      type="button"
      data-slot="phone-input-send"
      data-state={state}
      disabled={disabled || busy || context?.valid === false}
      // 倒计时每秒都在变，不用 aria-live 逐秒播报；读屏聚焦时会念出当前文字
      onClick={() => void send()}
      className={cn(
        variant === "inline"
          ? // 条内：撑满条高、左侧一道竖线隔开号码，文字用主题色，像一段可点的链接
            "-mr-3 flex h-full shrink-0 items-center border-l border-edge px-3 text-primary tabular-nums transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset disabled:cursor-not-allowed disabled:text-muted-foreground disabled:hover:bg-transparent max-md:text-sm @max-[20rem]/phone-input:px-2.5"
          : cn(buttonVariants({ variant: "outline", size }), "tabular-nums"),
        className,
      )}
      {...props}
    >
      <span className="grid justify-items-center">
        {/* 用位置当 key：调用方可能把两种状态写成同一句文案（如 send 与 resend 都是「获取验证码」） */}
        {sizers.map((sizer, index) => (
          <span
            key={index}
            aria-hidden="true"
            className="invisible col-start-1 row-start-1 whitespace-nowrap"
          >
            {sizer}
          </span>
        ))}
        <span className="col-start-1 row-start-1 whitespace-nowrap">
          {text}
        </span>
      </span>
    </button>
  )
}

export {
  PhoneInputContext,
  PhoneInputSendButton,
  phoneInputControlVariants,
  useSendCode,
}
