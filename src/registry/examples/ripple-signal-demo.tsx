import { Ripple, RippleMarker } from "@/registry/ui/ripple/ripple"
import { Radio } from "lucide-react"

export default function RippleSignalDemo() {
  return (
    <Ripple
      label="信号正常，覆盖半径 5 千米"
      mode="reach"
      rings={3}
      baseSize={88}
      ringGap={80}
      background="hatch"
      duration={3}
    >
      <RippleMarker
        radius={0}
        className="flex size-16 flex-col items-center justify-center gap-1 rounded-full border border-edge bg-background text-primary"
      >
        <Radio className="size-6" />
        <span className="text-[10px]">信号正常</span>
      </RippleMarker>
      <RippleMarker
        angle={90}
        radius={0.45}
        className="bg-background px-1 font-mono text-[10px] text-muted-foreground"
      >
        1 km
      </RippleMarker>
      <RippleMarker
        angle={90}
        radius={1}
        className="bg-background px-1 font-mono text-[10px] text-muted-foreground"
      >
        5 km
      </RippleMarker>
    </Ripple>
  )
}
