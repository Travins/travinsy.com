import { Ripple, RippleMarker } from "@/registry/ui/ripple/ripple"
import { Globe } from "lucide-react"

export default function RippleReachDemo() {
  return (
    <Ripple
      label="服务覆盖华东、华南、新加坡和法兰克福"
      mode="reach"
      rings={4}
      baseSize={62}
      ringGap={60}
      background="grid"
    >
      <RippleMarker
        radius={0}
        className="flex size-16 items-center justify-center rounded-full border border-edge bg-background text-primary"
      >
        <Globe className="size-7" />
      </RippleMarker>
      {[
        { label: "华东", angle: 35, radius: 0.68 },
        { label: "华南", angle: 140, radius: 0.65 },
        { label: "新加坡", angle: 220, radius: 0.87 },
        { label: "法兰克福", angle: 300, radius: 0.94 },
      ].map((marker) => (
        <RippleMarker
          key={marker.label}
          angle={marker.angle}
          radius={marker.radius}
          className="flex items-center gap-2 rounded-md border border-edge bg-background px-2.5 py-1.5 text-xs whitespace-nowrap"
        >
          <span className="size-1.5 rounded-full bg-primary" />
          {marker.label}
        </RippleMarker>
      ))}
    </Ripple>
  )
}
