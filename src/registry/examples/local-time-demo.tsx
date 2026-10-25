import { LocalTime } from "@/registry/ui/local-time/local-time"

const zones = [
  { label: "杭州", timeZone: "Asia/Shanghai" },
  { label: "伦敦", timeZone: "Europe/London" },
  { label: "旧金山", timeZone: "America/Los_Angeles" },
]

export default function LocalTimeDemo() {
  return (
    <dl className="w-full max-w-sm divide-y divide-border border-y border-edge font-mono text-sm">
      {zones.map((zone) => (
        <div
          key={zone.timeZone}
          className="flex items-center justify-between gap-4 py-2.5"
        >
          <dt className="text-muted-foreground">{zone.label}</dt>
          <dd className="tabular-nums">
            <LocalTime timeZone={zone.timeZone} />
          </dd>
        </div>
      ))}
    </dl>
  )
}
