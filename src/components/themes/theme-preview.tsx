"use client"

import { useId, useState } from "react"
import dynamic from "next/dynamic"
import { ArrowUpRight, Layers, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { GridColumns } from "@/registry/ui/grid-layout/grid-layout"
import {
  StatCard,
  StatHeader,
  StatLabel,
  StatValue,
  StatMeta,
  StatProgress,
} from "@/registry/ui/stat-card/stat-card"
import { MiniChart } from "@/registry/ui/mini-chart/mini-chart"
import {
  Checklist,
  ChecklistItem,
  ChecklistList,
  ChecklistProgress,
} from "@/registry/ui/checklist/checklist"
import { SegmentedControl } from "@/registry/ui/segmented-control/segmented-control"
import { ToggleSwitch } from "@/registry/ui/toggle-switch/toggle-switch"
import { ValueSlider } from "@/registry/ui/value-slider/value-slider"

// 图表依赖独立加载，避免阻塞主题选择器的首次交互。
const PreviewChart = dynamic(
  () => import("./theme-preview-chart").then((module) => module.PreviewChart),
  {
    loading: () => (
      <div
        role="status"
        className="min-h-80 animate-pulse bg-muted/30 motion-reduce:animate-none"
      >
        <span className="sr-only">正在加载趋势图</span>
      </div>
    ),
  },
)

const SPARK = [18, 26, 21, 33, 29, 38, 32, 45, 39, 51, 46, 58].map(
  (value, index) => ({ label: `第 ${index + 1} 天`, value }),
)
const CELL = "flex min-w-0 flex-col gap-4 p-5 sm:p-6"

function PreviewSettings() {
  const [channel, setChannel] = useState("stable")
  const [enabled, setEnabled] = useState(true)
  const [limit, setLimit] = useState(72)
  return (
    <section className={CELL} aria-label="发布设置">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">发布设置</h3>
        <Layers className="size-4 text-primary" aria-hidden />
      </div>
      <SegmentedControl
        label="渠道"
        tone="primary"
        options={[
          { value: "stable", label: "正式" },
          { value: "preview", label: "预览" },
        ]}
        value={channel}
        onValueChange={setChannel}
      />
      <ToggleSwitch
        label="自动部署"
        description={enabled ? "已开启" : "已暂停"}
        tone="primary"
        checked={enabled}
        onCheckedChange={setEnabled}
      />
      <ValueSlider
        label="配额提醒"
        tone="primary"
        value={limit}
        onValueChange={setLimit}
        format={{ style: "unit", unit: "percent" }}
      />
      <p className="rounded-md bg-accent px-3 py-2 text-xs leading-5 text-accent-foreground">
        {channel === "stable" ? "正式渠道" : "预览渠道"} · 用量达到 {limit}%
        时发送提醒。
      </p>
    </section>
  )
}

function PreviewInvite() {
  const id = useId()
  const [sent, setSent] = useState(false)
  return (
    <section className={cn(CELL, "bg-card text-card-foreground")}>
      <div>
        <h3 className="text-sm font-medium">一起完成下一次发布</h3>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          邀请成员加入工作空间，协作管理项目。
        </p>
      </div>
      <form
        className="flex flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault()
          setSent(true)
        }}
      >
        <label className="text-xs font-medium" htmlFor={id}>
          成员邮箱
        </label>
        <Input
          id={id}
          type="email"
          required
          placeholder="name@example.com"
          autoComplete="email"
          onChange={() => setSent(false)}
        />
        <div className="flex gap-2">
          <Button type="submit" className="flex-1">
            <Send aria-hidden data-icon="inline-start" />
            发送邀请
          </Button>
          <Button
            type="reset"
            variant="secondary"
            onClick={() => setSent(false)}
          >
            清空
          </Button>
        </div>
      </form>
      <p className="text-xs text-destructive">
        外部成员需要管理员批准后才能访问。
      </p>
      <p role="status" className="text-xs text-muted-foreground">
        {sent
          ? "演示邀请已记录，不会发送邮件。"
          : "演示空间 · 邀请仅在当前预览中生效"}
      </p>
    </section>
  )
}

function ThemePreviewCards() {
  return (
    <div data-slot="theme-workspace">
      <div className="screen-line-bottom flex flex-wrap items-center justify-between gap-3 bg-muted/25 px-5 py-4 sm:px-6">
        <div>
          <p className="text-xs text-muted-foreground">工作空间 / 概览</p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight">
            把想法，推进一步。
          </h3>
        </div>
        <span className="rounded-md bg-primary px-2.5 py-1 font-mono text-xs text-primary-foreground">
          项目 / 024
        </span>
      </div>
      <GridColumns className="screen-line-bottom sm:grid-cols-[1fr_2fr]">
        <div className="flex min-w-0 flex-col justify-center gap-3 p-5 sm:p-6">
          <StatCard className="gap-3">
            <StatHeader>
              <StatLabel>本周访问量</StatLabel>
              <ArrowUpRight className="size-4 text-primary" aria-hidden />
            </StatHeader>
            <StatValue value="24,860" />
            <MiniChart
              data={SPARK}
              type="area"
              tone="primary"
              className="h-14 w-full"
              label="近十二天访问量上升趋势"
              seriesLabel="访问量"
            />
            <StatMeta>
              <span>较上周 +18.6%</span>
              <span>近 7 天</span>
            </StatMeta>
          </StatCard>
          <StatCard className="gap-3">
            <StatHeader>
              <StatLabel>本月目标</StatLabel>
              <span className="font-mono text-xs text-primary">78%</span>
            </StatHeader>
            <StatValue value="7,800" unit="/ 10,000 次" />
            <StatProgress value={78} tone="primary" label="本月目标完成 78%" />
          </StatCard>
        </div>
        <div className="min-w-0 p-5 sm:p-6">
          <PreviewChart />
        </div>
      </GridColumns>
      {/* 三列在 md 以下各自太窄（开关文字会被截断），直接退成单列，md 起再并排 */}
      <GridColumns className="sm:grid-cols-1 sm:divide-x-0 sm:divide-y md:grid-cols-3 md:divide-x md:divide-y-0">
        <section className={CELL}>
          <div>
            <h3 className="text-sm font-medium">交付清单</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              版本 2.4 · 点击更新完成状态
            </p>
          </div>
          <Checklist tone="primary">
            <ChecklistProgress tone="primary" />
            <ChecklistList className="mt-2">
              <ChecklistItem defaultChecked>确认视觉规范</ChecklistItem>
              <ChecklistItem defaultChecked>完成组件联调</ChecklistItem>
              <ChecklistItem>检查键盘操作</ChecklistItem>
              <ChecklistItem>整理发布说明</ChecklistItem>
            </ChecklistList>
          </Checklist>
        </section>
        <PreviewSettings />
        <PreviewInvite />
      </GridColumns>
    </div>
  )
}

const TOKENS = [
  "background",
  "card",
  "primary",
  "primary-foreground",
  "secondary",
  "muted",
  "accent",
  "destructive",
  "border",
  "edge",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
] as const

function ThemePalette() {
  return (
    <div data-slot="theme-palette">
      <div className="mb-4 flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-medium">主题变量</h3>
        <span className="font-mono text-xs text-muted-foreground">
          16 TOKENS
        </span>
      </div>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
        {TOKENS.map((token) => (
          <li
            key={token}
            className="min-w-0 rounded-md border border-edge bg-card p-2"
          >
            <span
              aria-hidden
              className="mb-2 block h-7 rounded-sm border border-border"
              style={{ background: `var(--${token})` }}
            />
            <span
              className="block truncate font-mono text-[10px] text-muted-foreground"
              title={`--${token}`}
            >
              {token}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export { ThemePalette, ThemePreviewCards }
