import { GitBranch } from "lucide-react"

import {
  Checklist,
  ChecklistItem,
  ChecklistList,
  ChecklistProgress,
} from "@/registry/ui/checklist/checklist"

// 每条自带一种划线色调，复选框的填充跟着变色；行尾的耗时用 `meta` 显示
const TASKS = [
  { text: "类型检查与代码规范通过", meta: "12s", tone: "blue" },
  { text: "端到端测试全部通过", meta: "48s", tone: "violet" },
  { text: "无障碍与键盘操作自查", meta: "手动", tone: "cyan" },
  { text: "更新日志与迁移说明", meta: "手动", tone: "amber" },
  { text: "合并到主分支并打标签", meta: "5s", tone: "rose" },
] as const

// 自动播放的默认清单：服务端直接输出划到第 3 条的画面，进入视口后逐条往下划，划完停一会儿再重来
export default function ChecklistDemo() {
  return (
    <Checklist
      autoplay
      className="w-full max-w-md overflow-hidden rounded-xl border border-edge bg-card shadow-xs"
    >
      <div className="flex flex-col gap-3.5 border-b border-edge bg-[linear-gradient(to_bottom,color-mix(in_oklab,var(--flow-green)_9%,transparent),transparent)] px-5 py-4">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="grid size-8 shrink-0 place-items-center rounded-lg bg-[color-mix(in_oklab,var(--flow-green)_14%,var(--background))] text-(--flow-green) ring-1 ring-(--flow-green)/30"
          >
            <GitBranch className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">发布前检查清单</p>
            <p className="truncate font-mono text-[11px] text-muted-foreground">
              release/v2.4.0 → main
            </p>
          </div>
        </div>
        <ChecklistProgress total={TASKS.length} tone="green" />
      </div>
      <ChecklistList className="px-5 py-3">
        {TASKS.map((task) => (
          <ChecklistItem key={task.text} tone={task.tone} meta={task.meta}>
            {task.text}
          </ChecklistItem>
        ))}
      </ChecklistList>
    </Checklist>
  )
}
