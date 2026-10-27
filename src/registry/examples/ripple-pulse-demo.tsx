import { Ripple, RippleMarker } from "@/registry/ui/ripple/ripple"
import { Radio } from "lucide-react"

export default function RipplePulseDemo() {
  return (
    <Ripple label="信号向四周扩散" tone="blue" duration={5} className="h-80">
      <RippleMarker
        radius={0}
        className="flex size-14 items-center justify-center rounded-full bg-(--flow-tone) text-background shadow-lg"
      >
        <Radio className="size-6" />
      </RippleMarker>
    </Ripple>
  )
}
