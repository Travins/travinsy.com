"use client"

import * as React from "react"
import { BatteryFull, ChevronLeft, Signal, Wifi } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AmountInput } from "@/registry/ui/amount-input/amount-input"

const BALANCE = 26_480.5

/** 文本框也做成方条：标签在条内左侧、内容靠右，和其他表单控件是一套样式 */
const FIELD =
  "flex h-11 items-center gap-3 rounded-md border border-edge bg-muted/60 px-3 text-sm focus-within:ring-3 focus-within:ring-ring/50"
const FIELD_INPUT =
  "min-w-0 flex-1 bg-transparent text-right text-base outline-none placeholder:text-muted-foreground md:text-sm"

/**
 * 手机上的体验：一台 6.3 英寸的「手机」（402 × 874pt）里的转账页。
 * 主金额用 `variant="display"` 大字，下面实时出大写；超过余额时直接给出错误，按钮置灰。
 */
export default function AmountInputMobileDemo() {
  const [amount, setAmount] = React.useState("")
  const over = amount !== "" && Number(amount) > BALANCE

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
        <div className="flex h-11 shrink-0 items-center gap-1 border-b border-border px-3">
          <ChevronLeft
            aria-hidden="true"
            className="size-6 text-muted-foreground"
          />
          <p className="text-[17px] font-semibold">转账</p>
        </div>

        <div className="flex flex-1 flex-col gap-6 px-5 pt-5">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium"
            >
              林
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium">林小满</p>
              <p className="font-mono text-xs text-muted-foreground">
                招商银行 · 尾号 6021
              </p>
            </div>
          </div>

          <AmountInput
            variant="display"
            label="转账金额"
            value={amount}
            onValueChange={setAmount}
            min={0.01}
            error={over ? "超出可用余额" : undefined}
          />

          <p className="-mt-3 text-xs text-muted-foreground tabular-nums">
            可用余额 ¥
            {BALANCE.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            <button
              type="button"
              className="ml-2 text-primary underline-offset-2 hover:underline"
              onClick={() => setAmount(String(BALANCE))}
            >
              全部转出
            </button>
          </p>

          <label className={FIELD}>
            <span className="shrink-0 text-muted-foreground">转账说明</span>
            <input placeholder="选填，对方可见" className={FIELD_INPUT} />
          </label>
        </div>

        {/* 底部留出 34pt 的主屏指示条安全区 */}
        <div className="shrink-0 px-5 pt-3 pb-[34px] max-sm:pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button
            type="button"
            size="lg"
            className="w-full"
            disabled={amount === "" || Number(amount) <= 0 || over}
          >
            确认转账
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
