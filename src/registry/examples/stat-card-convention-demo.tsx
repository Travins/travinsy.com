"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  StatCard,
  StatGroup,
  StatLabel,
  StatTrend,
  StatValue,
  type StatGroupProps,
} from "@/registry/ui/stat-card/stat-card"

export default function StatCardConventionDemo() {
  const [convention, setConvention] =
    React.useState<NonNullable<StatGroupProps["convention"]>>("cn")
  return (
    <div className="flex w-full max-w-2xl flex-col gap-3">
      <div
        className="flex items-center gap-2"
        role="group"
        aria-label="涨跌配色约定"
      >
        <Button
          size="sm"
          variant={convention === "intl" ? "default" : "outline"}
          aria-pressed={convention === "intl"}
          onClick={() => setConvention("intl")}
        >
          绿涨红跌
        </Button>
        <Button
          size="sm"
          variant={convention === "cn" ? "default" : "outline"}
          aria-pressed={convention === "cn"}
          onClick={() => setConvention("cn")}
        >
          红涨绿跌
        </Button>
      </div>
      {/* convention 设在外层的 StatGroup 上，里面的卡片都沿用它 */}
      <StatGroup convention={convention} className="grid gap-3 sm:grid-cols-3">
        <StatCard>
          <StatLabel>CDN 流量</StatLabel>
          <StatValue value={4.82} unit="TB" />
          <StatTrend value={15.2}>较上月</StatTrend>
        </StatCard>
        <StatCard>
          <StatLabel>回源请求</StatLabel>
          <StatValue value={918000} unit="次" />
          <StatTrend value={-6.7}>较上月</StatTrend>
        </StatCard>
        <StatCard>
          <StatLabel>P95 延迟</StatLabel>
          <StatValue value={128} unit="ms" />
          {/* 延迟越低越好：下降用「好」的颜色，箭头方向不变 */}
          <StatTrend value={-8.3} invert>
            较上月
          </StatTrend>
        </StatCard>
      </StatGroup>
    </div>
  )
}
