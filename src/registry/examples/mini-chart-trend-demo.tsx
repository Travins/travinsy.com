"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { MiniChart } from "@/registry/ui/mini-chart/mini-chart"
import {
  StatCard,
  StatGroup,
  StatLabel,
  StatTrend,
  StatValue,
  type StatGroupProps,
} from "@/registry/ui/stat-card/stat-card"

const UP = [20, 22, 21, 26, 25, 30, 29, 34, 38, 41]
const DOWN = [41, 38, 39, 33, 34, 30, 31, 26, 24, 22]

export default function MiniChartTrendDemo() {
  const [convention, setConvention] =
    React.useState<NonNullable<StatGroupProps["convention"]>>("cn")
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
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
      <StatGroup convention={convention} className="grid gap-3 sm:grid-cols-2">
        <StatCard>
          <StatLabel>订阅用户</StatLabel>
          <MiniChart
            type="area"
            tone="trend"
            data={UP}
            seriesLabel="订阅"
            label="订阅用户走势"
          />
          <div className="flex items-end justify-between">
            <StatValue value={4120} size="sm" />
            <StatTrend value={9.6} />
          </div>
        </StatCard>
        <StatCard>
          <StatLabel>RSS 打开率</StatLabel>
          <MiniChart
            type="area"
            tone="trend"
            data={DOWN}
            seriesLabel="打开率"
            label="RSS 打开率走势"
          />
          <div className="flex items-end justify-between">
            <StatValue value="22%" size="sm" />
            <StatTrend value={-8.4} />
          </div>
        </StatCard>
      </StatGroup>
    </div>
  )
}
