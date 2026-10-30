import { NumberStepper } from "@/registry/ui/number-stepper/number-stepper"

export default function NumberStepperSizesDemo() {
  return (
    <div
      data-slot="number-stepper-sizes-demo"
      className="w-full max-w-sm space-y-3 rounded-xl border border-edge bg-background p-4 shadow-xs"
    >
      <NumberStepper label="小号" size="sm" defaultValue={2} max={9} />
      <NumberStepper label="默认" defaultValue={2} max={9} />
      <NumberStepper label="大号" size="lg" defaultValue={2} max={9} />
      <NumberStepper label="暂不可选" defaultValue={2} disabled />
      <NumberStepper
        label="预约数量"
        defaultValue={5}
        error="当前时段最多可预约 4 位，请调整人数"
      />
    </div>
  )
}
