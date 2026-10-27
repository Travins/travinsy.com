import {
  Checklist,
  ChecklistItem,
  ChecklistList,
  ChecklistProgress,
} from "@/registry/ui/checklist/checklist"

const TASKS = [
  "类型检查与代码规范通过",
  "端到端测试全部通过",
  "无障碍与键盘操作自查",
  "更新日志与迁移说明",
  "合并到主分支并打标签",
]

// 自动播放的默认清单：服务端直接输出划到第 3 条的画面，进入视口后逐条往下划，划完停一会儿再重来
export default function ChecklistDemo() {
  return (
    <div className="w-full max-w-md overflow-hidden rounded-lg border border-edge bg-card">
      <Checklist autoplay>
        <div className="flex flex-col gap-3 border-b border-edge px-5 py-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-sm font-medium">发布前检查清单</p>
            <span className="font-mono text-xs text-muted-foreground">
              v2.4.0
            </span>
          </div>
          <ChecklistProgress total={TASKS.length} />
        </div>
        <ChecklistList className="px-5 py-2">
          {TASKS.map((task) => (
            <ChecklistItem key={task}>{task}</ChecklistItem>
          ))}
        </ChecklistList>
      </Checklist>
    </div>
  )
}
