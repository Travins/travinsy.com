"use client"

import {
  CardStack,
  CardStackItem,
  CardStackControls,
} from "@/registry/ui/card-stack/card-stack"
import {
  StatHeader,
  StatLabel,
  StatValue,
  StatTrend,
} from "@/registry/ui/stat-card/stat-card"

const stats = [
  { name: "本月访问", value: 38642, trend: 12.4, unit: "次" },
  { name: "组件安装", value: 8240, trend: 18.6, unit: "次" },
  { name: "平均构建", value: 42.6, trend: -8.1, unit: "秒" },
]
export default function CardStackStatsDemo() {
  return (
    <div className="w-full max-w-xs px-2 py-4">
      <CardStack label="站点指标">
        {stats.map((item, index) => (
          <CardStackItem key={item.name} className="space-y-5">
            <StatHeader>
              <StatLabel>{item.name}</StatLabel>
              <span className="font-mono text-xs text-muted-foreground">
                0{index + 1}
              </span>
            </StatHeader>
            <StatValue value={item.value} unit={item.unit} size="lg" />
            <StatTrend value={item.trend} invert={index === 2}>
              较上月
            </StatTrend>
          </CardStackItem>
        ))}
        <CardStackControls />
      </CardStack>
    </div>
  )
}
