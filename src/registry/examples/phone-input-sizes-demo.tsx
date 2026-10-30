"use client"

import {
  PhoneInput,
  PhoneInputSendButton,
} from "@/registry/ui/phone-input/phone-input"

const send = () => new Promise<void>((resolve) => setTimeout(resolve, 600))

/** 三档高度（28 / 32 / 36px，触屏上 36 / 40 / 44px），带不带「获取验证码」都能对齐；最后一条是单独使用的发送按钮。 */
export default function PhoneInputSizesDemo() {
  return (
    <div className="w-full max-w-sm rounded-xl border border-edge bg-background p-4 shadow-xs">
      <div className="flex items-baseline justify-between gap-2 pb-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">尺寸</p>
          <p className="truncate text-xs text-muted-foreground">
            高度与方条开关、金额输入同一套
          </p>
        </div>
        <p className="shrink-0 font-mono text-[11px] text-muted-foreground">
          28 / 32 / 36
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <PhoneInput size="sm" label="sm" defaultValue="13800138000" />
        <PhoneInput
          label="default"
          defaultValue="13800138000"
          action={<PhoneInputSendButton onSend={send} />}
        />
        <PhoneInput
          size="lg"
          label="lg"
          defaultValue="13800138000"
          action={<PhoneInputSendButton onSend={send} />}
        />
        {/* 发送按钮也能单独用，比如放在邮箱输入旁边：高度与默认档的方条一致 */}
        <div className="flex gap-2">
          <label className="flex h-8 min-w-0 flex-1 items-center gap-3 rounded-md border border-edge bg-muted/60 px-3 text-sm focus-within:ring-3 focus-within:ring-ring/50 pointer-coarse:h-10">
            <span className="shrink-0 text-muted-foreground">邮箱</span>
            <input
              type="email"
              defaultValue="hi@yiui.dev"
              className="min-w-0 flex-1 bg-transparent text-right text-base outline-none md:text-sm"
            />
          </label>
          <PhoneInputSendButton variant="button" onSend={send} />
        </div>
      </div>
    </div>
  )
}
