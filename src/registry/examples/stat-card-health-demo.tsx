import {
  StatCard,
  StatHeader,
  StatLabel,
  StatMeter,
} from "@/registry/ui/stat-card/stat-card"

const SERVICES = [
  { label: "站点可用率", detail: "近 30 天", value: 99.9 },
  { label: "图片 CDN 命中率", detail: "近 7 天", value: 62 },
  { label: "搜索索引新鲜度", detail: "上次重建 3 天前", value: 28 },
]

export default function StatCardHealthDemo() {
  return (
    <StatCard className="w-full max-w-3xl gap-4">
      <StatHeader>
        <span className="text-sm font-semibold">服务健康</span>
      </StatHeader>
      <div className="grid gap-5 sm:grid-cols-3">
        {SERVICES.map((service) => (
          <div key={service.label} className="flex flex-col gap-2">
            <StatLabel>{service.label}</StatLabel>
            <div className="flex items-center gap-3">
              <StatMeter value={service.value} label={service.label} />
              <div className="flex flex-col">
                <span className="text-base font-semibold tabular-nums">
                  {service.value}%
                </span>
                <span className="text-xs whitespace-nowrap text-muted-foreground">
                  {service.detail}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </StatCard>
  )
}
