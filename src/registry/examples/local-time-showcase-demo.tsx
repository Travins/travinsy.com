import { LocalTime } from "@/registry/ui/local-time/local-time"

const ZONES = [
  { label: "杭州", timeZone: "Asia/Shanghai" },
  { label: "伦敦", timeZone: "Europe/London" },
  { label: "纽约", timeZone: "America/New_York" },
  { label: "旧金山", timeZone: "America/Los_Angeles" },
] as const

/**
 * 世界时钟面板：四个城市各自每秒刷新，右侧小字标出与访客的时差。
 * 排成一张带点阵底纹的卡片，比单行时间更像一个可以直接放进页面的组件。
 */
export default function LocalTimeShowcaseDemo() {
  return (
    <div className="relative flex size-full items-center justify-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-dots [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
      />
      <div className="relative w-[min(100%-2rem,21rem)] overflow-hidden rounded-lg border border-edge bg-background shadow-xs">
        <div className="flex items-center justify-between border-b border-edge px-3 py-2 font-mono text-[10px] tracking-[0.08em] text-muted-foreground">
          <span>WORLD CLOCK</span>
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-primary motion-safe:animate-pulse" />
            LIVE
          </span>
        </div>
        <dl className="divide-y divide-edge">
          {ZONES.map((zone, index) => (
            <div
              key={zone.timeZone}
              data-first={index === 0 ? "" : undefined}
              className="flex items-center justify-between gap-3 px-3 py-1.5 data-[first]:bg-primary/5"
            >
              <dt className="min-w-0">
                <span className="block text-sm leading-5 font-medium">
                  {zone.label}
                </span>
                <span className="block truncate font-mono text-[10px] leading-4 text-muted-foreground">
                  {zone.timeZone}
                </span>
              </dt>
              <dd className="shrink-0 font-mono text-xs">
                <LocalTime timeZone={zone.timeZone} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
