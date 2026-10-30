"use client"

import * as React from "react"
import { MessageSquareText } from "lucide-react"

import { OtpInput } from "@/registry/ui/otp-input/otp-input"
import { PhoneInputSendButton } from "@/registry/ui/phone-input/phone-input"

const CORRECT = "246810"

/** 默认示例：输入短信验证码。填满即校验（正确答案 246810），错了清空并提示；可以重新获取。 */
export default function OtpInputDemo() {
  const [code, setCode] = React.useState("")
  const [state, setState] = React.useState<"idle" | "error" | "done">("idle")

  return (
    <div className="w-full max-w-sm rounded-xl border border-edge bg-background p-4 shadow-xs">
      <div className="flex items-baseline justify-between gap-2 pb-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">输入验证码</p>
          <p className="truncate text-xs text-muted-foreground">
            已发送至 138 **** 8000
          </p>
        </div>
        <p className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
          {code.length} / 6
        </p>
      </div>
      <OtpInput
        align="center"
        aria-label="短信验证码"
        value={code}
        onValueChange={(next) => {
          setCode(next)
          if (state !== "done") setState("idle")
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
      <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <MessageSquareText className="size-3" aria-hidden="true" />
          {state === "done" ? "验证通过" : "提示：正确答案是 246810"}
        </span>
        <PhoneInputSendButton
          variant="button"
          size="sm"
          cooldown={30}
          onSend={() => setState("idle")}
        />
      </div>
    </div>
  )
}
