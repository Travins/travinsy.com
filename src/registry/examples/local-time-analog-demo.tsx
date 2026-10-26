import { AnalogClock } from "@/registry/ui/local-time/local-time"

const CLOCKS = [
  { label: "东京", timeZone: "Asia/Tokyo", props: {} },
  { label: "巴黎", timeZone: "Europe/Paris", props: { smooth: false } },
  {
    label: "洛杉矶",
    timeZone: "America/Los_Angeles",
    props: { showSeconds: false },
  },
] as const

export default function LocalTimeAnalogDemo() {
  return (
    <ul className="flex flex-wrap items-start justify-center gap-6">
      {CLOCKS.map((clock) => (
        <li key={clock.timeZone} className="flex flex-col items-center gap-2">
          <AnalogClock
            timeZone={clock.timeZone}
            label={clock.label}
            className="size-28"
            {...clock.props}
          />
          <span className="text-xs text-muted-foreground">
            {clock.label}
            {"smooth" in clock.props ? " · 按秒跳格" : ""}
            {"showSeconds" in clock.props ? " · 无秒针" : ""}
          </span>
        </li>
      ))}
    </ul>
  )
}
