import { WorldClock } from "@/registry/ui/local-time/local-time"

const ZONES = [
  { label: "杭州", timeZone: "Asia/Shanghai", highlighted: true },
  { label: "伦敦", timeZone: "Europe/London" },
  { label: "纽约", timeZone: "America/New_York" },
  { label: "旧金山", timeZone: "America/Los_Angeles" },
]

export default function LocalTimeWorldClockDemo() {
  return <WorldClock zones={ZONES} className="w-full max-w-sm" />
}
