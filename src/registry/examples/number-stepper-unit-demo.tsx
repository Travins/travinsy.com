"use client"

import { NumberStepper } from "@/registry/ui/number-stepper/number-stepper"

export default function NumberStepperUnitDemo() {
  return (
    <div data-slot="number-stepper-unit-demo" className="w-full max-w-sm rounded-xl border border-edge bg-background p-4 shadow-xs">
      <p className="pb-3 text-sm font-medium">画布设置</p>
      <div className="flex flex-col gap-2">
        <NumberStepper label="宽度" defaultValue={1080} unit="px" max={9999} />
        <NumberStepper label="高度" defaultValue={1350} unit="px" max={9999} />
        <NumberStepper label="线宽" defaultValue={2} unit="pt" step={0.5} format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }} />
        <NumberStepper label="字号" defaultValue={14} unit="px" />
      </div>
      <p className="pt-3 text-xs leading-relaxed text-muted-foreground">换算单位属于业务逻辑，用官方 input-group 也可以组合，不做内置单位换算。</p>
    </div>
  )
}
