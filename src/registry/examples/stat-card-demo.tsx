import {
  StatCard,
  StatHeader,
  StatIcon,
  StatLabel,
  StatTrend,
  StatValue,
} from "@/registry/ui/stat-card/stat-card"
import { Activity, Eye, Timer } from "lucide-react"

export default function StatCardDemo() {
  return (
    <div className="grid w-full max-w-3xl gap-3 sm:grid-cols-3">
      <StatCard>
        <StatHeader>
          <StatLabel>API 调用量</StatLabel>
          <StatIcon>
            <Activity />
          </StatIcon>
        </StatHeader>
        <StatValue value={12840000} unit="次" />
        <StatTrend value={12.4}>较上周</StatTrend>
      </StatCard>
      <StatCard>
        <StatHeader>
          <StatLabel>平均构建时长</StatLabel>
          <StatIcon>
            <Timer />
          </StatIcon>
        </StatHeader>
        <StatValue value="42.6" unit="秒" />
        {/* 构建时长越短越好，下降用「好」的颜色 */}
        <StatTrend value={-8.1} invert>
          较上周
        </StatTrend>
      </StatCard>
      <StatCard>
        <StatHeader>
          <StatLabel>博客阅读量</StatLabel>
          <StatIcon>
            <Eye />
          </StatIcon>
        </StatHeader>
        <StatValue value={386420} unit="次" />
        <StatTrend value={0}>较上周</StatTrend>
      </StatCard>
    </div>
  )
}
