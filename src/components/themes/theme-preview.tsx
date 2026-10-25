"use client"

import { useId, useState } from "react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const CELL = "flex flex-col gap-5 border-b border-dashed border-edge p-6 last:border-b-0 md:nth-last-[-n+2]:border-b-0 md:odd:border-r"

const INPUT =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"

function CardHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  )
}

function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
    >
      <div
        className="h-full rounded-full bg-primary transition-[width] motion-reduce:transition-none"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

/* ---------------------------------- 登录 ---------------------------------- */

function LoginCard() {
  const id = useId()
  return (
    <div className={CELL}>
      <CardHeading title="登录你的账户" description="输入邮箱和密码以继续。" />
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-email`} className="text-sm font-medium">
            邮箱
          </label>
          <input
            id={`${id}-email`}
            type="email"
            autoComplete="off"
            placeholder="name@example.com"
            className={INPUT}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor={`${id}-password`} className="text-sm font-medium">
              密码
            </label>
            <Button type="button" variant="link" size="xs">
              忘记密码？
            </Button>
          </div>
          <input
            id={`${id}-password`}
            type="password"
            autoComplete="off"
            defaultValue="preview-only"
            className={INPUT}
          />
        </div>
        <Button type="submit" size="lg" className="w-full">
          登录
        </Button>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <Separator className="flex-1" />
          或
          <Separator className="flex-1" />
        </div>
        <Button type="button" variant="outline" size="lg" className="w-full">
          使用 GitHub 继续
        </Button>
      </form>
    </div>
  )
}

/* ---------------------------------- 统计 ---------------------------------- */

const STATS = [
  { label: "总访问量", value: "12,480", delta: "+12.5%", positive: true },
  { label: "流失用户", value: "318", delta: "-8.2%", positive: false },
]

function StatsCard() {
  return (
    <div className={CELL}>
      <CardHeading title="本月概览" description="较上月的核心指标变化。" />
      <dl className="grid grid-cols-2 gap-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-2 rounded-lg border border-edge bg-card p-4 text-card-foreground"
          >
            <dt className="font-mono text-xs text-muted-foreground">
              {stat.label}
            </dt>
            <dd className="text-2xl font-semibold tracking-tight tabular-nums">
              {stat.value}
            </dd>
            <dd
              className={cn(
                "w-fit rounded-full px-2 py-0.5 font-mono text-xs",
                stat.positive
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-destructive/10 text-destructive"
              )}
            >
              {stat.delta}
            </dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm">
          <span>本月目标</span>
          <span className="font-mono text-xs text-muted-foreground">76%</span>
        </div>
        <ProgressBar value={76} label="本月目标完成度" />
        <p className="text-xs leading-6 text-muted-foreground">
          距离目标还差 2,400 次访问。
        </p>
      </div>
    </div>
  )
}

/* --------------------------------- 任务列表 --------------------------------- */

type Task = { id: string; title: string; progress: number }

const TASKS: Task[] = [
  { id: "grid", title: "设计线条网格", progress: 100 },
  { id: "theme", title: "整理颜色主题", progress: 80 },
  { id: "docs", title: "撰写组件文档", progress: 45 },
  { id: "deploy", title: "部署到 OSS", progress: 10 },
]

const FILTERS = [
  { value: "all", label: "全部" },
  { value: "doing", label: "进行中" },
  { value: "done", label: "已完成" },
] as const

type Filter = (typeof FILTERS)[number]["value"]

function TaskRows({ filter }: { filter: Filter }) {
  const [done, setDone] = useState<Record<string, boolean>>({ grid: true })
  const rows = TASKS.filter((task) => {
    const finished = done[task.id] ?? false
    return filter === "all" || (filter === "done" ? finished : !finished)
  })

  if (rows.length === 0) {
    return <p className="py-6 text-center text-sm text-muted-foreground">暂无任务</p>
  }

  return (
    <ul className="flex flex-col gap-4">
      {rows.map((task) => {
        const finished = done[task.id] ?? false
        const progress = finished ? 100 : Math.min(task.progress, 99)
        const inputId = `task-${task.id}`
        return (
          <li key={task.id} className="flex flex-col gap-2">
            <div className="flex items-center gap-2.5">
              <input
                id={inputId}
                type="checkbox"
                checked={finished}
                onChange={(event) =>
                  setDone((prev) => ({ ...prev, [task.id]: event.target.checked }))
                }
                className="size-4 shrink-0 cursor-pointer accent-primary"
              />
              <label
                htmlFor={inputId}
                className={cn(
                  "flex-1 cursor-pointer text-sm",
                  finished && "text-muted-foreground line-through"
                )}
              >
                {task.title}
              </label>
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                {progress}%
              </span>
            </div>
            <ProgressBar value={progress} label={`${task.title}进度`} />
          </li>
        )
      })}
    </ul>
  )
}

function TasksCard() {
  const [filter, setFilter] = useState<Filter>("all")
  return (
    <div className={CELL}>
      <CardHeading title="项目任务" description="勾选任务，观察主色在进度条上的表现。" />
      <Tabs
        value={filter}
        onValueChange={(value) => setFilter(value as Filter)}
        className="gap-4"
      >
        <TabsList>
          {FILTERS.map((item) => (
            <TabsTrigger key={item.value} value={item.value}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {FILTERS.map((item) => (
          <TabsContent key={item.value} value={item.value}>
            <TaskRows filter={item.value} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

/* ---------------------------------- 柱状图 --------------------------------- */

const SERIES = [
  { label: "搜索", bar: "bg-chart-1" },
  { label: "直接", bar: "bg-chart-2" },
  { label: "社交", bar: "bg-chart-3" },
  { label: "邮件", bar: "bg-chart-4" },
  { label: "其他", bar: "bg-chart-5" },
] as const

/** 每天五个来源的占比，合计不超过 100。 */
const BARS = [
  { day: "一", values: [20, 24, 18, 12, 8] },
  { day: "二", values: [26, 22, 20, 14, 10] },
  { day: "三", values: [18, 20, 16, 10, 6] },
  { day: "四", values: [30, 26, 22, 12, 8] },
  { day: "五", values: [34, 28, 20, 16, 10] },
  { day: "六", values: [22, 18, 14, 8, 6] },
  { day: "日", values: [16, 14, 12, 8, 4] },
]

function ChartCard() {
  return (
    <div className={CELL}>
      <CardHeading title="流量来源" description="近 7 天各渠道访问占比，使用 chart-1 ~ chart-5。" />
      <div
        role="img"
        aria-label="近 7 天按来源堆叠的柱状图，来源包括搜索、直接、社交、邮件和其他"
        className="flex h-40 items-end gap-2 border-b border-edge"
      >
        {BARS.map((bar) => (
          <div
            key={bar.day}
            className="flex h-full flex-1 flex-col-reverse gap-px"
          >
            {bar.values.map((value, index) => (
              <div
                key={SERIES[index].label}
                className={cn(
                  SERIES[index].bar,
                  "first:rounded-b-[2px] last:rounded-t-[2px]"
                )}
                style={{ height: `${value}%` }}
              />
            ))}
          </div>
        ))}
      </div>
      <div aria-hidden className="-mt-3 flex gap-2">
        {BARS.map((bar) => (
          <span
            key={bar.day}
            className="flex-1 text-center font-mono text-xs text-muted-foreground"
          >
            {bar.day}
          </span>
        ))}
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
        {SERIES.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <span aria-hidden className={cn("size-2.5 rounded-[3px]", item.bar)} />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ---------------------------------- 色板 ---------------------------------- */

const TOKENS = [
  { name: "background", chip: "bg-background" },
  { name: "card", chip: "bg-card" },
  { name: "primary", chip: "bg-primary" },
  { name: "secondary", chip: "bg-secondary" },
  { name: "muted", chip: "bg-muted" },
  { name: "accent", chip: "bg-accent" },
  { name: "destructive", chip: "bg-destructive" },
  { name: "border", chip: "bg-border" },
] as const

export function ThemePalette() {
  return (
    <ul className="grid grid-cols-4 gap-3 sm:grid-cols-8">
      {TOKENS.map((token) => (
        <li key={token.name} className="flex flex-col gap-1.5">
          <span
            aria-hidden
            className={cn("h-10 rounded-md border border-edge", token.chip)}
          />
          <span className="truncate font-mono text-xs text-muted-foreground">
            {token.name}
          </span>
        </li>
      ))}
    </ul>
  )
}

/** 预览区：4 张样例卡片。放在带有 data-theme-scope 的容器里使用。 */
export function ThemePreviewCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <LoginCard />
      <StatsCard />
      <TasksCard />
      <ChartCard />
    </div>
  )
}
