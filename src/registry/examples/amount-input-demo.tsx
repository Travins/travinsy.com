"use client"

import { ShieldCheck } from "lucide-react"

import { AmountInput } from "@/registry/ui/amount-input/amount-input"

/** 默认示例：一张转账卡片，敲数字时下方实时出大写与估读，超限立刻提示。 */
export default function AmountInputDemo() {
  return (
    <div className="w-full max-w-sm rounded-xl border border-edge bg-background p-4 shadow-xs">
      <div className="flex items-baseline justify-between gap-2 pb-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">转账付款</p>
          <p className="truncate text-xs text-muted-foreground">
            收款方：上海示例科技有限公司
          </p>
        </div>
        <p className="shrink-0 font-mono text-[11px] text-muted-foreground">
          CNY
        </p>
      </div>
      <AmountInput
        size="lg"
        label="付款金额"
        defaultValue="128800"
        min={0.01}
        max={500000}
      />
      <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <ShieldCheck className="size-3" aria-hidden="true" />
        单笔限额 ¥500,000.00，超出部分请分笔转账
      </p>
    </div>
  )
}
