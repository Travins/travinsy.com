"use client"

import * as React from "react"
import { ShieldCheck } from "lucide-react"

import {
  PhoneInput,
  PhoneInputSendButton,
  maskPhone,
} from "@/registry/ui/phone-input/phone-input"

/** 默认示例：登录卡片。号码不完整时「获取验证码」置灰，发送后倒计时；右上角是打码后的号码。 */
export default function PhoneInputDemo() {
  const [phone, setPhone] = React.useState("13800138000")

  return (
    <div className="w-full max-w-sm rounded-xl border border-edge bg-background p-4 shadow-xs">
      <div className="flex items-baseline justify-between gap-2 pb-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">验证码登录</p>
          <p className="truncate text-xs text-muted-foreground">
            未注册的手机号验证后自动创建账号
          </p>
        </div>
        <p className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
          {phone.length === 11 ? maskPhone(phone) : "+86"}
        </p>
      </div>
      <PhoneInput
        label="手机号"
        size="lg"
        value={phone}
        onValueChange={setPhone}
        action={
          <PhoneInputSendButton
            cooldown={60}
            onSend={() => new Promise((resolve) => setTimeout(resolve, 600))}
          />
        }
      />
      <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <ShieldCheck className="size-3" aria-hidden="true" />
        粘贴「+86 138-0013-8000」也能自动整理
      </p>
    </div>
  )
}
