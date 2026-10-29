import { AmountInput } from "@/registry/ui/amount-input/amount-input"

/** 尺寸与状态：三档高度（28 / 32 / 36px）、禁用、只读。 */
export default function AmountInputStatesDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-edge bg-background p-5 shadow-xs">
      <AmountInput
        size="sm"
        label="sm · 28px"
        defaultValue="1280"
        showUppercase={false}
        showApproximate={false}
      />
      <AmountInput
        label="default · 32px"
        defaultValue="1280"
        showUppercase={false}
        showApproximate={false}
      />
      <AmountInput
        size="lg"
        label="lg · 36px"
        defaultValue="1280"
        showUppercase={false}
        showApproximate={false}
      />
      <AmountInput
        label="禁用"
        disabled
        defaultValue="1200"
        showUppercase={false}
        showApproximate={false}
      />
      <AmountInput
        label="只读"
        readOnly
        defaultValue="88.5"
        showUppercase={false}
        showApproximate={false}
      />
    </div>
  )
}
