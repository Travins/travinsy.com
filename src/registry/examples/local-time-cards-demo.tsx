import { WorldClock } from "@/registry/ui/local-time/local-time"

const ZONES = [
  { label: "杭州", timeZone: "Asia/Shanghai", highlighted: true },
  { label: "伦敦", timeZone: "Europe/London" },
  { label: "纽约", timeZone: "America/New_York" },
  { label: "悉尼", timeZone: "Australia/Sydney" },
]

export default function LocalTimeCardsDemo() {
  return (
    <WorldClock
      variant="cards"
      zones={ZONES}
      title="CITIES / 城市"
      className="w-full max-w-md"
    />
  )
}
