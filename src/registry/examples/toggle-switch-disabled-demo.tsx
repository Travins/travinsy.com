"use client"

import * as React from "react"
import { Lock } from "lucide-react"

import { ToggleSwitch } from "@/registry/ui/toggle-switch/toggle-switch"

// 从属项：总开关关着时它们都不可点
const DEPENDENTS = [
  { id: "theme", label: "主题偏好", checked: true },
  { id: "shortcuts", label: "快捷键方案", checked: true },
  { id: "tabs", label: "打开的标签页", checked: false },
] as const

type DependentId = (typeof DEPENDENTS)[number]["id"]

const INITIAL = Object.fromEntries(
  DEPENDENTS.map((item) => [item.id, item.checked]),
) as Record<DependentId, boolean>

/**
 * 禁用态示例：总开关关着时，下面的 `disabled` 项整条淡一半、也不响应点击与键盘；
 * 打开总开关，三项立刻可以操作。`description` 在同一个位置换成状态文案，说明为什么点不动。
 */
export default function ToggleSwitchDisabledDemo() {
  const [sync, setSync] = React.useState(false)
  const [values, setValues] = React.useState(INITIAL)

  return (
    <div className="w-full max-w-sm rounded-xl border border-edge bg-background p-4 shadow-xs">
      <div className="flex items-baseline justify-between gap-2 pb-3">
        <p className="text-sm font-medium">云同步</p>
        <p className="text-xs text-muted-foreground">
          {sync ? "已开启" : "已关闭"}
        </p>
      </div>
      <ToggleSwitch
        label="同步到云端"
        description={sync ? "3 项正在同步" : "未上传"}
        tone="blue"
        checked={sync}
        onCheckedChange={setSync}
      />
      <div className="mt-2 flex flex-col gap-1.5 border-s border-edge ps-3">
        {DEPENDENTS.map((item) => (
          <ToggleSwitch
            key={item.id}
            variant="compact"
            label={item.label}
            description={sync ? undefined : "需开启同步"}
            disabled={!sync}
            checked={values[item.id]}
            onCheckedChange={(checked) =>
              setValues((current) => ({ ...current, [item.id]: checked }))
            }
          />
        ))}
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Lock className="size-3 shrink-0" aria-hidden="true" />
        同步关闭时这三项保留上次的选择
      </p>
    </div>
  )
}
