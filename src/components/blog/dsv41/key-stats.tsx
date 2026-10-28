"use client"

import {
  StatCard,
  StatLabel,
  StatMeta,
  StatTrend,
  StatValue,
} from "@/registry/ui/stat-card/stat-card"

// 数据：1017 版正式口径（3 轮均值）对原生产 0909 版的单轮基线，输出 tok/s
const STATS = [
  {
    label: "短请求 · 并发 32",
    value: "997",
    unit: "tok/s",
    gain: 10.4,
    note: "输入 256，输出 128",
  },
  {
    label: "1K/1K · 并发 100",
    value: "1,692",
    unit: "tok/s",
    gain: 26.3,
    note: "输入 1K，输出 1K",
  },
  {
    label: "长输入 · 并发 10",
    value: "390",
    unit: "tok/s",
    gain: 80.0,
    note: "输入 17.4K，输出 1K",
  },
] as const

/** 文章顶部的一排关键结论：三个场景的输出吞吐与相对原生产的提升，外加上下文长度。 */
export function KeyStats() {
  return (
    <div className="not-prose my-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {STATS.map((item) => (
        <StatCard key={item.label} className="gap-2 p-3 sm:p-4">
          <StatLabel>{item.label}</StatLabel>
          <StatValue value={item.value} unit={item.unit} />
          <StatTrend value={item.gain} format={{ digits: 0 }}>
            较原生产
          </StatTrend>
          <StatMeta>{item.note}</StatMeta>
        </StatCard>
      ))}
      <StatCard className="gap-2 p-3 sm:p-4">
        <StatLabel>上下文上限</StatLabel>
        <StatValue value="512K" unit="token" />
        <StatMeta>524,288，含提示词与输出</StatMeta>
      </StatCard>
    </div>
  )
}
