"use client"

import * as React from "react"
import { BookOpen, NotebookPen } from "lucide-react"

import { NumberStepper } from "@/registry/ui/number-stepper/number-stepper"

const PRODUCTS = [
  { name: "随行笔记本", price: 39, max: 9, Icon: NotebookPen },
  { name: "城市漫游手册", price: 68, max: 3, Icon: BookOpen },
]

function currency(value: number) {
  return value.toLocaleString("zh-CN", { style: "currency", currency: "CNY" })
}

export default function NumberStepperCartDemo() {
  const [quantities, setQuantities] = React.useState<(number | null)[]>([1, 3])
  const total = PRODUCTS.reduce(
    (sum, product, index) => sum + product.price * (quantities[index] ?? 0),
    0,
  )

  return (
    <div
      data-slot="number-stepper-cart-demo"
      className="w-full max-w-sm rounded-xl border border-edge bg-background p-4 shadow-xs"
    >
      <p className="text-sm font-medium">我的购物车</p>
      <p className="mt-0.5 text-xs text-muted-foreground">数量停手后自动保存</p>
      <div className="mt-3 divide-y divide-edge">
        {PRODUCTS.map(({ name, price, max, Icon }, index) => (
          <div key={name} className="flex items-center gap-2 py-3 first:pt-0">
            <div
              aria-hidden="true"
              className="flex size-9 shrink-0 items-center justify-center rounded-md border border-edge bg-primary/10 text-primary"
            >
              <Icon className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p
                id={`cart-item-${index}`}
                className="truncate text-xs font-medium"
              >
                {name}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground tabular-nums">
                {currency(price)}
              </p>
              {/* 库存提示单独一行：窄屏下和价格挤一行会被截断，这是关键信息 */}
              {index === 1 ? (
                <p className="text-[11px] text-muted-foreground">仅余 3 件</p>
              ) : null}
            </div>
            <NumberStepper
              size="sm"
              aria-labelledby={`cart-item-${index}`}
              value={quantities[index]}
              max={max}
              onValueChange={(value) =>
                setQuantities((current) =>
                  current.map((quantity, item) =>
                    item === index ? value : quantity,
                  ),
                )
              }
              onValueCommit={() =>
                new Promise<void>((resolve) => setTimeout(resolve, 600))
              }
            />
          </div>
        ))}
      </div>
      <div className="flex items-baseline justify-between border-t border-edge pt-3">
        <span className="text-xs text-muted-foreground">合计</span>
        <span className="text-lg font-semibold tabular-nums">
          {currency(total)}
        </span>
      </div>
    </div>
  )
}
