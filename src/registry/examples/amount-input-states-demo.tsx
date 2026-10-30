import { AmountInput } from "@/registry/ui/amount-input/amount-input"

/** 尺寸与状态：三档高度（28 / 32 / 36px）、禁用、只读。 */
export default function AmountInputStatesDemo() {
  return (
    <div className="w-full max-w-sm rounded-xl border border-edge bg-background p-4 shadow-xs">
      <div className="flex items-baseline justify-between gap-2 pb-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">尺寸与状态</p>
          <p className="truncate text-xs text-muted-foreground">
            高度与方条开关、数值滑块同一套
          </p>
        </div>
        <p className="shrink-0 font-mono text-[11px] text-muted-foreground">
          28 / 32 / 36
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <AmountInput
          size="sm"
          label="sm"
          defaultValue="1280"
          showUppercase={false}
          showApproximate={false}
        />
        <AmountInput
          label="default"
          defaultValue="1280"
          showUppercase={false}
          showApproximate={false}
        />
        <AmountInput
          size="lg"
          label="lg"
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
    </div>
  )
}
