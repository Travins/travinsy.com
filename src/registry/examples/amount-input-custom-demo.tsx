import { AmountInput } from "@/registry/ui/amount-input/amount-input"

/** 自定义：换货币符号并关掉大写、整数输入、四位小数的汇率。 */
export default function AmountInputCustomDemo() {
  return (
    <div className="w-full max-w-sm rounded-xl border border-edge bg-background p-4 shadow-xs">
      <div className="flex items-baseline justify-between gap-2 pb-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">外币订单</p>
          <p className="truncate text-xs text-muted-foreground">
            换符号、只收整数、四位小数
          </p>
        </div>
        <p className="shrink-0 font-mono text-[11px] text-muted-foreground">
          USD
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <AmountInput
          label="美元收款"
          symbol="$"
          showUppercase={false}
          defaultValue="25000"
        />
        <AmountInput
          label="购买数量"
          symbol={null}
          decimals={0}
          showUppercase={false}
          showApproximate={false}
          defaultValue="1200"
          placeholder="件"
        />
        <AmountInput
          label="汇率"
          symbol={null}
          decimals={4}
          showUppercase={false}
          showApproximate={false}
          padDecimals={false}
          defaultValue="7.2468"
        />
      </div>
    </div>
  )
}
