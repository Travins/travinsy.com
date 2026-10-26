import { LocalTime } from "@/registry/ui/local-time/local-time"

const rows = [
  {
    title: "昼夜图标 + UTC 偏移",
    node: (
      <LocalTime
        timeZone="Asia/Tokyo"
        showDayNight
        showZone
        showDifference={false}
      />
    ),
  },
  {
    title: "数字翻动",
    node: <LocalTime timeZone="Europe/Paris" animated />,
  },
  {
    title: "12 小时制，不显示秒",
    node: (
      <LocalTime
        timeZone="America/New_York"
        hour12
        showSeconds={false}
        showZone
        showDayNight
      />
    ),
  },
  {
    title: "英文文案",
    node: (
      <LocalTime
        timeZone="Europe/London"
        locale="en-GB"
        labels={{
          pending: "local time",
          same: "same as you",
          ahead: "ahead",
          behind: "behind",
          hourUnit: "h",
        }}
      />
    ),
  },
]

export default function LocalTimeInlineDemo() {
  return (
    <dl className="w-full max-w-md divide-y divide-edge border-y border-edge text-sm">
      {rows.map((row) => (
        <div
          key={row.title}
          className="flex flex-col gap-1 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
        >
          <dt className="text-muted-foreground">{row.title}</dt>
          <dd className="font-mono text-xs sm:text-right">{row.node}</dd>
        </div>
      ))}
    </dl>
  )
}
