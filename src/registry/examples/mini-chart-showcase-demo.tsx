import { MiniChart, MiniRing } from "@/registry/ui/mini-chart/mini-chart"
import {
  StatCard,
  StatHeader,
  StatLabel,
  StatTrend,
  StatValue,
} from "@/registry/ui/stat-card/stat-card"

const BARS = [12, 19, 15, 26, 21, 31, 24]
const AREA = [28, 27, 35, 29, 40, 57, 50, 38, 48, 47, 42, 51]

/** 列表封面：点阵底纹上放柱、面积和进度环三张迷你图卡片。 */
export default function MiniChartShowcaseDemo() {
  return (
    <div className="relative flex size-full items-center justify-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-dots [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
      />
      <div className="relative grid w-[min(100%-2rem,26rem)] grid-cols-2 gap-2">
        <StatCard className="gap-2 p-3">
          <StatLabel className="text-xs">API 调用量</StatLabel>
          <MiniChart
            type="bar"
            track
            data={BARS}
            className="h-14"
            highlight="last"
            label="近 7 天 API 调用量"
          />
          <StatTrend value={18.2} />
        </StatCard>
        <StatCard className="gap-2 p-3">
          <StatLabel className="text-xs">博客访客</StatLabel>
          <MiniChart
            type="area"
            tone="blue"
            data={AREA}
            className="h-14"
            label="博客访客走势"
          />
          <StatTrend value={-4.3} />
        </StatCard>
        <StatCard className="col-span-2 flex-row items-center gap-4 p-3">
          <MiniRing
            value={72}
            arc={270}
            size={64}
            tone="green"
            label="站点可用率"
          >
            <span className="text-sm font-semibold">72%</span>
          </MiniRing>
          <StatHeader className="flex-1 flex-col gap-1.5">
            <StatLabel className="text-xs">本月构建配额</StatLabel>
            <StatValue value={4320} unit="/ 6000 分钟" size="sm" />
          </StatHeader>
        </StatCard>
      </div>
    </div>
  )
}
