"use client"

import * as React from "react"

import { AmountInput } from "@/registry/ui/amount-input/amount-input"

const BALANCE = 8000

/**
 * 校验与错误态：`min` / `max` 越界自动提示并拦住表单提交；
 * 业务规则（余额）自己判断，用 `error` 传入提示即可。
 */
export default function AmountInputValidationDemo() {
  const [withdraw, setWithdraw] = React.useState("12000")

  return (
    <div className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-edge bg-background p-5 shadow-xs">
      <AmountInput
        label="单笔转账（100 – 50,000）"
        min={100}
        max={50000}
        defaultValue="60000"
        showApproximate={false}
      />
      <AmountInput
        label={`提现（余额 ¥${BALANCE.toLocaleString("en-US")}）`}
        value={withdraw}
        onValueChange={setWithdraw}
        error={
          Number(withdraw) > BALANCE
            ? "余额不足，最多可提现 ¥8,000.00"
            : undefined
        }
        showApproximate={false}
      />
    </div>
  )
}
