"use client"

import * as React from "react"
import { Users } from "lucide-react"

import { NumberStepper } from "@/registry/ui/number-stepper/number-stepper"

export default function NumberStepperDemo() {
  const [adults, setAdults] = React.useState<number | null>(2)
  const [children, setChildren] = React.useState<number | null>(0)

  return (
    <div
      data-slot="number-stepper-demo"
      className="w-full max-w-sm rounded-xl border border-edge bg-background p-4 shadow-xs"
    >
      <div className="flex items-baseline justify-between gap-2 pb-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">预约人数</p>
          <p className="text-xs text-muted-foreground">
            选好同行人数，一起出发
          </p>
        </div>
        <p className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
          共 {(adults ?? 0) + (children ?? 0)} 人
        </p>
      </div>
      <div className="space-y-2">
        <NumberStepper
          label="出行人数"
          value={adults}
          onValueChange={setAdults}
          min={1}
          max={6}
        />
        <NumberStepper
          label="儿童"
          value={children}
          onValueChange={setChildren}
          max={4}
        />
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Users className="size-3" aria-hidden="true" />
        出行人数 1–6 位，儿童最多 4 位
      </p>
    </div>
  )
}
