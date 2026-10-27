import { Database, Hammer, Globe } from "lucide-react"

import {
  StatBadge,
  StatCard,
  StatHeader,
  StatIcon,
  StatLabel,
  StatMeta,
  StatProgress,
  StatValue,
  usageStatus,
} from "@/registry/ui/stat-card/stat-card"

const QUOTAS = [
  { icon: Globe, title: "CDN 流量", used: 3.8, max: 10, unit: "TB" },
  { icon: Hammer, title: "构建时长", used: 5120, max: 6000, unit: "分钟" },
  { icon: Database, title: "对象存储", used: 41, max: 100, unit: "GB" },
] as const

const BADGE = {
  ok: "健康",
  watch: "偏高",
  risk: "紧张",
  review: "审核中",
} as const

export default function StatCardQuotaDemo() {
  return (
    <div className="grid w-full max-w-3xl gap-3 sm:grid-cols-3">
      {QUOTAS.map(({ icon: Icon, title, used, max, unit }) => {
        const percent = (used / max) * 100
        const status = usageStatus(percent)
        return (
          <StatCard key={title}>
            <StatHeader className="items-center">
              <span className="flex items-center gap-2">
                <StatIcon>
                  <Icon />
                </StatIcon>
                <span className="text-sm font-medium">{title}</span>
              </span>
              <StatBadge status={status}>{BADGE[status]}</StatBadge>
            </StatHeader>
            <div className="flex flex-col gap-1">
              <StatLabel>剩余</StatLabel>
              <StatValue value={max - used} unit={unit} />
            </div>
            <div className="flex flex-col gap-1.5">
              {/* 进度条表示已用，颜色按用量自动变：65% 起关注，90% 起风险 */}
              <StatProgress
                value={used}
                max={max}
                tone="usage"
                label={`${title}已用`}
              />
              <StatMeta>
                <span>已用 {Math.round(percent)}%</span>
                <span>
                  {used} / {max} {unit}
                </span>
              </StatMeta>
            </div>
          </StatCard>
        )
      })}
    </div>
  )
}
