import { Ripple, RippleMarker } from "@/registry/ui/ripple/ripple"
import { Radio } from "lucide-react"

// 圆环直径 100 / 200 / 300，半径之比 1 : 2 : 3；标记的 radius 是相对最外圈的比例，刻度正好落在对应的圆环上
const SCALE = [
  { km: 1, radius: 1 / 3 },
  { km: 2, radius: 2 / 3 },
  { km: 3, radius: 1 },
]

export default function RippleSignalDemo() {
  return (
    <Ripple
      label="信号正常，覆盖半径 3 千米"
      mode="reach"
      rings={3}
      baseSize={100}
      ringGap={100}
      size={360}
      background="hatch"
      className="h-[22.5rem]"
    >
      <RippleMarker
        radius={0}
        className="flex size-16 flex-col items-center justify-center gap-1 rounded-full border border-edge bg-background text-primary"
      >
        <Radio className="size-6" />
        <span className="text-[10px]">信号正常</span>
      </RippleMarker>
      {SCALE.map(({ km, radius }) => (
        <RippleMarker
          key={km}
          angle={90}
          radius={radius}
          className="bg-background px-1 font-mono text-[10px] whitespace-nowrap text-muted-foreground"
        >
          {km} km
        </RippleMarker>
      ))}
    </Ripple>
  )
}
