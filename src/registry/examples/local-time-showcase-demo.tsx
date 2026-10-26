import { WorldClock } from "@/registry/ui/local-time/local-time"

const ZONES = [
  { label: "杭州", timeZone: "Asia/Shanghai", highlighted: true },
  { label: "伦敦", timeZone: "Europe/London" },
  { label: "纽约", timeZone: "America/New_York" },
  { label: "旧金山", timeZone: "America/Los_Angeles" },
]

/** 列表封面：世界时钟放在点阵底纹上，数字翻动、昼夜图标、时差与日期差一屏都能看到。 */
export default function LocalTimeShowcaseDemo() {
  return (
    <div className="relative flex size-full items-center justify-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-dots [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
      />
      <WorldClock
        zones={ZONES}
        className="relative w-[min(100%-2rem,22rem)] shadow-xs"
      />
    </div>
  )
}
