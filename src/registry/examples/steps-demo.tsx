"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Steps } from "@/registry/ui/steps/steps"

const items = [
  { title: "填写信息", description: "收货地址" },
  { title: "选择支付", description: "确认订单" },
  { title: "下单成功", description: "等待发货" },
]

export default function StepsDemo() {
  const [value, setValue] = React.useState(1)

  return (
    <div className="w-full max-w-xl rounded-xl border border-edge bg-background p-4 shadow-xs">
      <div className="flex items-baseline justify-between gap-2 pb-5">
        <p className="text-sm font-medium">订单结算</p>
        <p className="font-mono text-[11px] text-muted-foreground tabular-nums">
          {value + 1} / {items.length}
        </p>
      </div>
      <Steps items={items} value={value} onValueChange={setValue} />
      <div className="mt-5 flex items-center justify-between gap-3">
        <Button
          size="default"
          variant="outline"
          disabled={value === 0}
          onClick={() => setValue(value - 1)}
        >
          上一步
        </Button>
        <Button
          size="default"
          disabled={value === items.length - 1}
          onClick={() => setValue(value + 1)}
        >
          下一步
        </Button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        点已完成的步骤，可以返回修改。
      </p>
    </div>
  )
}
