import {
  StatBadge,
  StatCard,
  StatDistribution,
  StatHeader,
  StatLabel,
  StatMeta,
  StatMeter,
  StatProgress,
  StatTrend,
  StatValue,
} from "@/registry/ui/stat-card/stat-card"

/** 列表封面：点阵底纹上叠几张统计卡片，覆盖数字、涨跌、进度、计量和分布。 */
export default function StatCardShowcaseDemo() {
  return (
    <div className="relative flex size-full items-center justify-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-dots [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
      />
      <div className="relative grid w-[min(100%-2rem,26rem)] grid-cols-2 gap-2">
        <StatCard className="gap-2.5 p-3">
          <StatLabel className="text-xs">API 调用量</StatLabel>
          <StatValue value={12840000} unit="次" size="sm" />
          <StatTrend value={12.4}>较上周</StatTrend>
        </StatCard>
        <StatCard className="gap-2.5 p-3">
          <StatHeader className="items-center">
            <StatLabel className="text-xs">CDN 流量</StatLabel>
            <StatBadge status="watch">偏高</StatBadge>
          </StatHeader>
          <StatProgress value={78} tone="usage" label="CDN 流量已用" />
          <StatMeta>
            <span>已用 78%</span>
            <span>7.8 / 10 TB</span>
          </StatMeta>
        </StatCard>
        <StatCard className="col-span-2 gap-2.5 p-3">
          <StatHeader className="items-center">
            <StatLabel className="text-xs">博客来源</StatLabel>
            <StatMeter
              value={72}
              segments={8}
              className="h-4 w-20"
              label="站点健康"
            />
          </StatHeader>
          <StatDistribution
            legend={false}
            segments={[
              { label: "搜索引擎", value: 148 },
              { label: "直接访问", value: 93 },
              { label: "社交媒体", value: 64 },
              { label: "外链", value: 37 },
            ]}
          />
        </StatCard>
      </div>
    </div>
  )
}
