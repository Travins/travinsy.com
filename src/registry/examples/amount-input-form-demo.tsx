"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { AmountInput } from "@/registry/ui/amount-input/amount-input"

/** 文本框也做成方条：标签在条内左侧、内容靠右，和金额输入排在一起是一套样式 */
const FIELD =
  "flex h-8 items-center gap-3 rounded-md border border-edge bg-muted/60 px-3 text-sm pointer-coarse:h-10 focus-within:ring-3 focus-within:ring-ring/50"
const FIELD_INPUT =
  "min-w-0 flex-1 bg-transparent text-right text-base outline-none placeholder:text-muted-foreground md:text-sm"

/**
 * 受控 + 表单提交：`value` 是不带千分位的十进制字符串，
 * 设了 `name` 后提交的也是这个原始值，服务端拿到的不会是 "1,234.50"。
 */
export default function AmountInputFormDemo() {
  const [amount, setAmount] = React.useState("1234.50")
  const [submitted, setSubmitted] = React.useState<{
    reason: string
    amount: string
  } | null>(null)

  return (
    <form
      className="w-full max-w-sm rounded-xl border border-edge bg-background p-4 shadow-xs"
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        setSubmitted({
          reason: String(data.get("reason")),
          amount: String(data.get("amount")),
        })
      }}
    >
      <div className="flex items-baseline justify-between gap-2 pb-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">差旅报销</p>
          <p className="truncate text-xs text-muted-foreground">
            提交的是不带千分位的原始值
          </p>
        </div>
        <p className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
          ≤ 20,000
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <label className={FIELD}>
          <span className="shrink-0 text-muted-foreground">事由</span>
          <input
            name="reason"
            defaultValue="上海出差机票"
            className={FIELD_INPUT}
          />
        </label>
        <AmountInput
          name="amount"
          label="报销金额"
          required
          min={0.01}
          max={20000}
          value={amount}
          onValueChange={setAmount}
        />
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="font-mono text-[11px] text-muted-foreground">
          value = {JSON.stringify(amount)}
        </p>
        <Button type="submit">提交</Button>
      </div>
      {submitted && (
        <dl className="mt-3 rounded-lg border border-dashed border-edge bg-muted/30 p-3 font-mono text-xs">
          <dt className="text-muted-foreground">FormData</dt>
          <dd>reason = {JSON.stringify(submitted.reason)}</dd>
          <dd>amount = {JSON.stringify(submitted.amount)}</dd>
        </dl>
      )}
    </form>
  )
}
