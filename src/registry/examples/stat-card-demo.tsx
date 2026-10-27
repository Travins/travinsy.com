import { Activity, Share2 } from "lucide-react"
import { formatStat, toneColor } from "@/registry/lib/data-display"
import {
  StatBadge,
  StatCard,
  StatHeader,
  StatIcon,
  StatLabel,
  StatMeta,
  StatProgress,
  StatSegments,
  StatTrend,
  StatValue,
} from "@/registry/ui/stat-card/stat-card"

const SOURCES = [
  { label: "搜索", value: 148, tone: "blue" },
  { label: "直接", value: 93, tone: "violet" },
  { label: "社交", value: 64, tone: "amber" },
  { label: "外链", value: 37, tone: "cyan" },
] as const

const SOURCE_TOTAL = SOURCES.reduce((sum, item) => sum + item.value, 0)

// 三张独立的统计卡片：大数字与涨跌、配额进度、通栏的占比分布——都只用数字与条形，图表交给 mini-chart / chart-card
export default function StatCardDemo() {
  return (
    <div className="grid w-full max-w-xl gap-3 sm:grid-cols-2">
      <StatCard>
        <StatHeader>
          <StatLabel>API 调用量</StatLabel>
          <StatIcon tone="blue">
            <Activity />
          </StatIcon>
        </StatHeader>
        <StatValue value={12840000} unit="次" size="lg" />
        <StatTrend value={12.4}>较上周</StatTrend>
      </StatCard>
      <StatCard>
        <StatHeader className="items-center">
          <StatLabel>本月构建配额</StatLabel>
          <StatBadge status="watch">偏高</StatBadge>
        </StatHeader>
        <StatValue value="4320" unit="/ 6000 分钟" />
        <StatProgress value={72} tone="usage" label="构建配额已用 72%" />
        <StatMeta>
          <span>已用 72%</span>
          <span>剩余 12 天</span>
        </StatMeta>
      </StatCard>
      <StatCard className="sm:col-span-2">
        <StatHeader>
          <StatLabel>流量来源</StatLabel>
          <StatIcon tone="violet">
            <Share2 />
          </StatIcon>
        </StatHeader>
        <StatValue value={SOURCE_TOTAL} unit="次访问" />
        <StatSegments segments={[...SOURCES]} className="h-2" />
        <ul className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs sm:grid-cols-4">
          {SOURCES.map((item) => (
            <li key={item.label} className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: toneColor(item.tone) }}
              />
              <span className="text-muted-foreground">{item.label}</span>
              <span className="ml-auto font-medium tabular-nums">
                {formatStat((item.value / SOURCE_TOTAL) * 100, {
                  style: "percent",
                  digits: 0,
                })}
              </span>
            </li>
          ))}
        </ul>
      </StatCard>
    </div>
  )
}
