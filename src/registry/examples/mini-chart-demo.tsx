import { MiniChart } from "@/registry/ui/mini-chart/mini-chart"
import {
  StatCard,
  StatHeader,
  StatLabel,
  StatTrend,
  StatValue,
} from "@/registry/ui/stat-card/stat-card"

const REQUESTS = [
  120, 285, 190, 190, 315, 190, 220, 260, 240, 330, 310, 380,
].map((value, index) => ({
  label: `2026-02-${String(index + 1).padStart(2, "0")}`,
  value,
}))
const VISITS = [280, 270, 350, 290, 400, 570, 500, 380, 480, 470, 420, 510].map(
  (value, index) => ({
    label: `2026-02-${String(index + 1).padStart(2, "0")}`,
    value,
  }),
)
const BUILD = [48, 52, 47, 51, 44, 46, 43, 45, 41, 42, 40, 38]

export default function MiniChartDemo() {
  return (
    <div className="grid w-full max-w-3xl gap-3 sm:grid-cols-3">
      <StatCard>
        <StatHeader>
          <StatLabel>API 调用量</StatLabel>
        </StatHeader>
        <MiniChart
          type="bar"
          track
          data={REQUESTS}
          tickFormatter={(label) => label.slice(5)}
          seriesLabel="调用量"
          label="近 12 天 API 调用量柱图"
        />
        <div className="flex items-end justify-between">
          <StatValue value={2_850_000} unit="次" size="sm" />
          <StatTrend value={18.2} />
        </div>
      </StatCard>
      <StatCard>
        <StatHeader>
          <StatLabel>博客访客</StatLabel>
        </StatHeader>
        <MiniChart
          type="area"
          data={VISITS}
          tone="blue"
          seriesLabel="访客"
          label="近 12 天博客访客面积图"
        />
        <div className="flex items-end justify-between">
          <StatValue value={4_810} unit="人" size="sm" />
          <StatTrend value={-4.3} />
        </div>
      </StatCard>
      <StatCard>
        <StatHeader>
          <StatLabel>构建时长</StatLabel>
        </StatHeader>
        <MiniChart
          type="line"
          data={BUILD}
          tone="violet"
          seriesLabel="秒"
          label="近 12 次构建时长折线图"
        />
        <div className="flex items-end justify-between">
          <StatValue value="38" unit="秒" size="sm" />
          <StatTrend value={-20.8} invert />
        </div>
      </StatCard>
    </div>
  )
}
