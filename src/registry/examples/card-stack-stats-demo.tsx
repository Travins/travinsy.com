"use client"

import {
  CardStack,
  CardStackControls,
  CardStackItem,
} from "@/registry/ui/card-stack/card-stack"
import {
  StatLabel,
  StatTrend,
  StatValue,
} from "@/registry/ui/stat-card/stat-card"

const STATS = [
  { name: "本月访问", value: 38642, trend: 12.4, unit: "次" },
  { name: "组件安装", value: 8240, trend: 18.6, unit: "次" },
  { name: "平均构建", value: 42.6, trend: -8.1, unit: "秒", invert: true },
]

export default function CardStackStatsDemo() {
  return (
    <div className="w-full max-w-xs px-2 py-4">
      <CardStack label="站点指标">
        {STATS.map(({ name, value, trend, unit, invert }) => (
          <CardStackItem key={name} className="flex flex-col gap-4">
            <StatLabel>{name}</StatLabel>
            <StatValue value={value} unit={unit} size="lg" />
            <StatTrend value={trend} invert={invert}>
              较上月
            </StatTrend>
          </CardStackItem>
        ))}
        <CardStackControls />
      </CardStack>
    </div>
  )
}
