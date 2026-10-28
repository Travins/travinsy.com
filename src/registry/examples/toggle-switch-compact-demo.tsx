"use client"

import * as React from "react"

import { ToggleSwitch } from "@/registry/ui/toggle-switch/toggle-switch"

/** 编辑器偏好：六条挤在一张卡里，用 compact 档排成密排 */
const PREFERENCES = [
  { id: "autosave", label: "自动保存", checked: true },
  { id: "numbers", label: "显示行号", checked: true },
  { id: "wrap", label: "自动换行", checked: false },
  { id: "highlight", label: "高亮当前行", checked: true },
  { id: "spaces", label: "显示空白字符", checked: false },
  { id: "vim", label: "Vim 键位", checked: false },
] as const

type PreferenceId = (typeof PREFERENCES)[number]["id"]

const INITIAL = Object.fromEntries(
  PREFERENCES.map((item) => [item.id, item.checked]),
) as Record<PreferenceId, boolean>

/**
 * 密排示例：`variant="compact"`把方条收到 22px 高，六条加上 `gap-1` 也只占半张卡，
 * 适合放进设置页或侧栏。密排时不带 `description`，一行只有一个标签，视线不会被切断。
 */
export default function ToggleSwitchCompactDemo() {
  const [values, setValues] = React.useState(INITIAL)

  return (
    <div className="w-full max-w-xs rounded-xl border border-edge bg-background p-3 shadow-xs">
      <p className="px-1 pb-2 text-xs font-medium text-muted-foreground">
        编辑器偏好
      </p>
      <div className="flex flex-col gap-1">
        {PREFERENCES.map((item) => (
          <ToggleSwitch
            key={item.id}
            variant="compact"
            label={item.label}
            checked={values[item.id]}
            onCheckedChange={(checked) =>
              setValues((current) => ({ ...current, [item.id]: checked }))
            }
          />
        ))}
      </div>
    </div>
  )
}
