import { AmountInput } from "@/registry/ui/amount-input/amount-input"

/** 自定义：换货币符号并关掉大写、整数输入、四位小数的汇率。 */
export default function AmountInputCustomDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-edge bg-background p-5 shadow-xs">
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
  )
}
