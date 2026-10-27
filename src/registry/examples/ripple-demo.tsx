import { cn } from "@/lib/utils"
import { Ripple, RippleMarker } from "@/registry/ui/ripple/ripple"
import { Globe } from "lucide-react"

// 波纹从中心持续扩散；延迟越高的地区离中心越远，状态点同时配数字，不只靠颜色
const REGIONS = [
  { label: "华东", latency: "12 ms", angle: 50, radius: 0.55, ok: true },
  { label: "华南", latency: "24 ms", angle: 140, radius: 0.75, ok: true },
  { label: "新加坡", latency: "68 ms", angle: 225, radius: 0.92, ok: false },
  { label: "法兰克福", latency: "186 ms", angle: 318, radius: 1, ok: false },
]

export default function RippleDemo() {
  return (
    <Ripple
      label="服务覆盖华东、华南、新加坡和法兰克福，延迟依次升高"
      tone="blue"
      rings={3}
      baseSize={72}
      ringGap={82}
      size={340}
      className="h-80"
    >
      <RippleMarker
        radius={0}
        className="flex size-14 items-center justify-center rounded-full bg-(--flow-tone) text-background shadow-lg ring-6 ring-(--flow-tone)/15"
      >
        <Globe className="size-7" />
      </RippleMarker>
      {REGIONS.map(({ label, latency, angle, radius, ok }) => (
        <RippleMarker
          key={label}
          angle={angle}
          radius={radius}
          className="flex items-center gap-2 rounded-md border border-edge bg-background py-1.5 pr-2.5 pl-2 text-xs whitespace-nowrap shadow-sm"
        >
          <span
            className={cn(
              "size-2 rounded-full",
              ok ? "bg-(--flow-green)" : "bg-(--flow-amber)",
            )}
          />
          <span className="font-medium">{label}</span>
          <span className="font-mono text-[10px] text-muted-foreground">
            {latency}
          </span>
        </RippleMarker>
      ))}
    </Ripple>
  )
}
