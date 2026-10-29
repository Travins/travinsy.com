"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AmountInput } from "@/registry/ui/amount-input/amount-input"

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
      className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-edge bg-background p-5 shadow-xs"
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        setSubmitted({
          reason: String(data.get("reason")),
          amount: String(data.get("amount")),
        })
      }}
    >
      <p className="text-sm font-medium">差旅报销</p>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="amount-form-reason" className="text-sm font-medium">
          事由
        </label>
        <Input
          id="amount-form-reason"
          name="reason"
          defaultValue="上海出差机票"
        />
      </div>
      <AmountInput
        name="amount"
        label="报销金额"
        required
        min={0.01}
        max={20000}
        value={amount}
        onValueChange={setAmount}
      />
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-[11px] text-muted-foreground">
          value = {JSON.stringify(amount)}
        </p>
        <Button type="submit">提交</Button>
      </div>
      {submitted && (
        <dl className="rounded-lg border border-dashed border-edge bg-muted/30 p-3 font-mono text-xs">
          <dt className="text-muted-foreground">FormData</dt>
          <dd>reason = {JSON.stringify(submitted.reason)}</dd>
          <dd>amount = {JSON.stringify(submitted.amount)}</dd>
        </dl>
      )}
    </form>
  )
}
