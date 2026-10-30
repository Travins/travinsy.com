"use client"

import * as React from "react"

import { Steps } from "@/registry/ui/steps/steps"
import { ValueSlider } from "@/registry/ui/value-slider/value-slider"

export default function StepsCompactDemo() {
  const [width, setWidth] = React.useState(100)

  return (
    <div className="w-full max-w-xl rounded-xl border border-edge bg-background p-4 shadow-xs">
      <div className="flex items-baseline justify-between gap-2 pb-3">
        <p className="text-sm font-medium">随容器收起</p>
        <p className="font-mono text-[11px] text-muted-foreground">
          auto / 28rem
        </p>
      </div>
      <ValueSlider
        label="容器宽度"
        min={45}
        max={100}
        value={width}
        onValueChange={(next) => setWidth(next as number)}
        formatValue={(value) => `${value}%`}
        className="mb-4"
      />
      <div
        className="min-w-0 rounded-lg border border-dashed border-edge p-3"
        style={{ width: `${width}%` }}
      >
        <Steps
          orientation="auto"
          defaultValue={1}
          items={[
            { title: "填写信息", description: "收货地址" },
            { title: "选择支付", description: "确认订单" },
            { title: "下单成功", description: "等待发货" },
          ]}
        />
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        拖动滑块缩小容器；可用宽度不足 28rem 时显示摘要与分段进度。
      </p>
    </div>
  )
}
