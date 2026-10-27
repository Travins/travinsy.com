import { cn } from "@/lib/utils"
import { Ripple, RippleMarker } from "@/registry/ui/ripple/ripple"
import { Globe } from "lucide-react"

// 延迟越高的地区离中心越远；状态点同时配数字，不只靠颜色
const REGIONS = [
  { label: "华东", latency: "12 ms", angle: 66, radius: 0.5, ok: true },
  { label: "华南", latency: "24 ms", angle: 148, radius: 0.68, ok: true },
  { label: "新加坡", latency: "68 ms", angle: 212, radius: 0.82, ok: false },
  { label: "法兰克福", latency: "186 ms", angle: 336, radius: 0.9, ok: false },
]

export default function RippleDemo() {
  return (
    <Ripple
      label="服务覆盖华东、华南、新加坡和法兰克福，延迟依次升高"
      mode="reach"
      tone="blue"
      rings={4}
      baseSize={92}
      ringGap={78}
      size={360}
      className="h-[22.5rem]"
    >
      <RippleMarker
        radius={0}
        className="flex size-16 items-center justify-center rounded-full bg-(--flow-tone) text-background shadow-lg"
      >
        <Globe className="size-8" />
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
