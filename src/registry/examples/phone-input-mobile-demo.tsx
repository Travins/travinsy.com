"use client"

import * as React from "react"
import { BatteryFull, ChevronLeft, Signal, Wifi } from "lucide-react"

import { Button } from "@/components/ui/button"
import { OtpInput } from "@/registry/ui/otp-input/otp-input"
import {
  PhoneInput,
  PhoneInputSendButton,
  maskPhone,
} from "@/registry/ui/phone-input/phone-input"

const CORRECT = "246810"

/**
 * 手机上的体验：一台 6.3 英寸的「手机」（402 × 874pt）里的验证码登录页。
 * 填好号码 → 获取验证码 → 输入 6 位（正确答案 246810）→ 登录；真机上打开时外框收起、铺满屏幕。
 */
export default function PhoneInputMobileDemo() {
  const [phone, setPhone] = React.useState("")
  const [sent, setSent] = React.useState(false)
  const [code, setCode] = React.useState("")
  const [state, setState] = React.useState<"idle" | "error" | "done">("idle")

  return (
    <div className="max-w-full rounded-[3.875rem] border border-edge bg-muted p-2 shadow-lg max-sm:contents">
      <div className="relative flex aspect-[402/874] w-[402px] max-w-full flex-col overflow-clip rounded-[3.375rem] bg-background max-sm:aspect-auto max-sm:h-[calc(100dvh-3rem)] max-sm:w-full max-sm:rounded-none">
        {/* 状态栏 54pt，灵动岛 126 × 37pt；宽度按屏幕比例取，页面比手机窄时一起收窄 */}
        <div className="relative flex h-[54px] shrink-0 items-center justify-between px-[8%] pt-1 text-[15px] font-semibold tabular-nums max-sm:hidden">
          <span>9:41</span>
          <span
            aria-hidden="true"
            className="absolute top-[11px] left-1/2 h-[37px] w-[31%] -translate-x-1/2 rounded-full bg-foreground dark:bg-background dark:ring-1 dark:ring-border"
          />
          <span aria-hidden="true" className="flex items-center gap-1.5">
            <Signal className="size-4" strokeWidth={2.5} />
            <Wifi className="size-4" strokeWidth={2.5} />
            <BatteryFull className="size-5" />
          </span>
        </div>
        <div className="flex h-11 shrink-0 items-center px-3">
          <ChevronLeft
            aria-hidden="true"
            className="size-6 text-muted-foreground"
          />
        </div>

        <div className="flex flex-1 flex-col gap-3 px-6 pt-4">
          <p className="text-2xl font-semibold">验证码登录</p>
          <p className="-mt-2 mb-3 text-sm text-muted-foreground">
            未注册的手机号验证后自动创建账号
          </p>
          <PhoneInput
            label="手机号"
            size="lg"
            value={phone}
            onValueChange={setPhone}
            action={
              <PhoneInputSendButton
                onSend={async () => {
                  await new Promise((resolve) => setTimeout(resolve, 600))
                  setSent(true)
                  setCode("")
                  setState("idle")
                }}
              />
            }
          />
          {sent && (
            <div className="mt-3 flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">
                验证码已发送至 {maskPhone(phone)}
              </p>
              <OtpInput
                size="lg"
                aria-label="短信验证码"
                value={code}
                onValueChange={(next) => {
                  setCode(next)
                  if (state === "error") setState("idle")
                }}
                onValueComplete={(next) => {
                  if (next === CORRECT) setState("done")
                  else {
                    setState("error")
                    setCode("")
                  }
                }}
                error={state === "error" ? "验证码错误，请重新输入" : undefined}
              />
              <p className="text-xs text-muted-foreground">
                {state === "done"
                  ? "验证通过，可以登录了"
                  : "演示用验证码：246810"}
              </p>
            </div>
          )}
        </div>

        {/* 底部留出 34pt 的主屏指示条安全区 */}
        <div className="shrink-0 px-6 pt-3 pb-[34px] max-sm:pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button
            type="button"
            size="lg"
            className="w-full"
            disabled={state !== "done"}
          >
            登录
          </Button>
        </div>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-2 left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-foreground max-sm:hidden"
        />
      </div>
    </div>
  )
}
