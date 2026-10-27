import {
  StatCard,
  StatHeader,
  StatLabel,
  StatStatus,
  StatValue,
} from "@/registry/ui/stat-card/stat-card"

const GOALS = [
  {
    label: "本月 API 调用量",
    value: 12840000,
    done: 5,
    total: 5,
    status: "ok",
  },
  { label: "构建成功率", value: "98.6%", done: 3, total: 5, status: "watch" },
  {
    label: "首屏 LCP 达标率",
    value: "71.2%",
    done: 1,
    total: 5,
    status: "risk",
  },
  { label: "新站点内容审核", value: 24, done: 2, total: 4, status: "review" },
] as const

export default function StatCardGoalDemo() {
  return (
    <div className="grid w-full max-w-3xl gap-3 sm:grid-cols-2">
      {GOALS.map((goal) => (
        <StatCard key={goal.label}>
          <StatHeader>
            <StatLabel>{goal.label}</StatLabel>
          </StatHeader>
          <StatValue value={goal.value} size="lg" />
          <StatStatus status={goal.status} showChevron render={<a href="#" />}>
            {goal.done}/{goal.total} 个目标
          </StatStatus>
        </StatCard>
      ))}
    </div>
  )
}
