import { MiniChart } from "@/registry/ui/mini-chart/mini-chart"
import { formatDay } from "@/registry/lib/data-display"

// 2026-02-02 是周一，一周七天刚好「一…日」
const READS = [150, 250, 190, 290, 220, 350, 250].map((value, index) => ({
  label: `2026-02-0${index + 2}`,
  value,
}))

const BUILDS = [42, 38, 55, 47, 40, 36, 33].map((value, index) => ({
  label: `2026-02-0${index + 2}`,
  value,
}))

export default function MiniChartAxisDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-2">
      <figure className="flex flex-col gap-3 rounded-lg border border-edge bg-card p-4">
        <figcaption className="text-sm text-muted-foreground">
          本周博客阅读量 · 强调最高的一天
        </figcaption>
        <MiniChart
          type="bar"
          className="h-28"
          data={READS}
          showAxis
          highlight="max"
          tickFormatter={(label) => formatDay(label, "weekday")}
          seriesLabel="阅读量"
          label="本周每天博客阅读量"
        />
      </figure>
      <figure className="flex flex-col gap-3 rounded-lg border border-edge bg-card p-4">
        <figcaption className="text-sm text-muted-foreground">
          近 7 天构建时长 · 底槽与最近一天
        </figcaption>
        <MiniChart
          type="bar"
          className="h-28"
          data={BUILDS}
          tone="amber"
          showAxis
          track
          highlight="last"
          tickFormatter={(label) => formatDay(label, "short")}
          seriesLabel="秒"
          label="近 7 天构建时长"
        />
      </figure>
    </div>
  )
}
