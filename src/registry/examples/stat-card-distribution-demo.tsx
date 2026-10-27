import {
  StatCard,
  StatDistribution,
  StatHeader,
  StatLabel,
  StatValue,
} from "@/registry/ui/stat-card/stat-card"

const SOURCES = [
  { label: "搜索引擎", value: 148200 },
  { label: "直接访问", value: 92600 },
  { label: "社交媒体", value: 64300 },
  { label: "RSS 与外链", value: 36900 },
]

const TOTAL = SOURCES.reduce((sum, item) => sum + item.value, 0)

export default function StatCardDistributionDemo() {
  return (
    <StatCard className="w-full max-w-3xl gap-4">
      <StatHeader>
        <div className="flex flex-col gap-2">
          <StatLabel>博客阅读量 · 近 30 天</StatLabel>
          <StatValue value={TOTAL} unit="次" size="lg" />
        </div>
      </StatHeader>
      <StatDistribution segments={SOURCES} />
    </StatCard>
  )
}
