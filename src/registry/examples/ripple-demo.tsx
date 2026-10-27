import { Ripple, RippleMarker } from "@/registry/ui/ripple/ripple"
import { Globe } from "lucide-react"

// 覆盖范围：四圈蓝色波纹向外铺开，地区按延迟远近落在不同圈层；延迟用绿 / 琥珀色点加数字，不只靠颜色
const REGIONS = [
  { label: "华东", latency: "12 ms", angle: 66, radius: 0.5, tone: "green" },
  { label: "华南", latency: "24 ms", angle: 148, radius: 0.68, tone: "green" },
  {
    label: "新加坡",
    latency: "68 ms",
    angle: 212,
    radius: 0.82,
    tone: "amber",
  },
  {
    label: "法兰克福",
    latency: "186 ms",
    angle: 336,
    radius: 0.9,
    tone: "amber",
  },
] as const

export default function RippleDemo() {
  return (
    <Ripple
      label="服务覆盖华东、华南、新加坡和法兰克福，延迟依次升高"
      mode="reach"
      rings={4}
      baseSize={92}
      ringGap={78}
      size={360}
      duration={5}
      className="h-[22.5rem] [&_[data-slot=ripple-wave]]:border-(--flow-blue)/50 [&_[data-slot=ripple-wave]]:bg-(--flow-blue)/8"
    >
      <RippleMarker
        radius={0}
        className="flex size-16 items-center justify-center rounded-full bg-(--flow-blue) text-background shadow-lg ring-8 ring-(--flow-blue)/20"
      >
        <Globe className="size-8" />
      </RippleMarker>
      {REGIONS.map((region) => (
        <RippleMarker
          key={region.label}
          angle={region.angle}
          radius={region.radius}
          className="flex items-center gap-2 rounded-md border border-edge bg-background py-1.5 pr-2.5 pl-2 text-xs whitespace-nowrap shadow-sm"
        >
          <span className="relative flex size-2">
            <span
              aria-hidden="true"
              className="absolute inline-flex size-full rounded-full opacity-60 motion-safe:animate-ping"
              style={{ backgroundColor: `var(--flow-${region.tone})` }}
            />
            <span
              aria-hidden="true"
              className="relative inline-flex size-2 rounded-full"
              style={{ backgroundColor: `var(--flow-${region.tone})` }}
            />
          </span>
          <span className="font-medium">{region.label}</span>
          <span className="font-mono text-[10px] text-muted-foreground">
            {region.latency}
          </span>
        </RippleMarker>
      ))}
    </Ripple>
  )
}
