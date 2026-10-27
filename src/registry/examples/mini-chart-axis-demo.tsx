import { MiniChart } from "@/registry/ui/mini-chart/mini-chart"
import { formatDay } from "@/registry/lib/data-display"
import {
  StatCard,
  StatHeader,
  StatLabel,
  StatTrend,
  StatValue,
} from "@/registry/ui/stat-card/stat-card"

// 2026-02-02 是周一，一周七天刚好「一…日」
const WEEK = [150, 250, 190, 290, 220, 350, 250].map((value, index) => ({
  label: `2026-02-0${index + 2}`,
  value,
}))

export default function MiniChartAxisDemo() {
  return (
    <StatCard className="w-full max-w-sm">
      <StatHeader>
        <div className="flex flex-col gap-2">
          <StatLabel>本周博客阅读量</StatLabel>
          <StatValue value={1_700} unit="次" />
        </div>
        <StatTrend value={15} />
      </StatHeader>
      {/* 星期轴用单字，周六阅读量最高，其余柱变淡 */}
      <MiniChart
        type="bar"
        className="h-28"
        data={WEEK}
        showAxis
        highlight="max"
        tickFormatter={(label) => formatDay(label, "weekday")}
        seriesLabel="阅读量"
        label="本周每天博客阅读量"
      />
    </StatCard>
  )
}
