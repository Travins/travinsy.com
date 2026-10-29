"use client"

import { AmountInput } from "@/registry/ui/amount-input/amount-input"

/** 默认示例：一张转账卡片，敲数字时下方实时出大写与估读，超限立刻提示。 */
export default function AmountInputDemo() {
  return (
    <div className="w-full max-w-sm rounded-xl border border-edge bg-background p-5 shadow-sm">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-sm font-medium">转账付款</p>
        <p className="font-mono text-[11px] text-muted-foreground">CNY</p>
      </div>
      <p className="mt-0.5 text-xs text-muted-foreground">
        收款方：上海示例科技有限公司
      </p>
      <div className="mt-4">
        <AmountInput
          size="lg"
          label="付款金额"
          defaultValue="128800"
          min={0.01}
          max={500000}
        />
      </div>
      <p className="mt-3 flex items-center justify-between font-mono text-[11px] text-muted-foreground">
        <span>单笔限额</span>
        <span className="tabular-nums">¥500,000.00</span>
      </p>
    </div>
  )
}
