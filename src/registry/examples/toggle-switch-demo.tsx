"use client"

import * as React from "react"
import { Bell } from "lucide-react"

import { ToggleSwitch } from "@/registry/ui/toggle-switch/toggle-switch"

/** 四个通知渠道：名称、右侧的送达方式、色调与初始状态都固定 */
const CHANNELS = [
  { id: "reply", label: "评论回复", description: "邮件", tone: "blue" },
  { id: "mention", label: "被提及", description: "桌面", tone: "violet" },
  { id: "digest", label: "每周摘要", description: "邮件", tone: "amber" },
  { id: "push", label: "移动端推送", description: "手机", tone: "rose" },
] as const

type ChannelId = (typeof CHANNELS)[number]["id"]

const INITIAL: Record<ChannelId, boolean> = {
  reply: true,
  mention: true,
  digest: false,
  push: false,
}

/**
 * 默认示例：通知设置卡。每条是一个整条可点的开关，打开时整条铺上淡色、竖线手柄滑到右端，
 * 四个渠道各用一种色调；`description` 在标签右侧标出送达方式。
 */
export default function ToggleSwitchDemo() {
  const [enabled, setEnabled] = React.useState(INITIAL)
  const count = CHANNELS.filter((channel) => enabled[channel.id]).length

  return (
    <div className="w-full max-w-sm rounded-xl border border-edge bg-background p-4 shadow-xs">
      <div className="flex items-baseline justify-between gap-2 pb-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">通知</p>
          <p className="truncate text-xs text-muted-foreground">
            选择想收到提醒的渠道
          </p>
        </div>
        <p className="shrink-0 font-mono text-[11px] text-muted-foreground">
          {count} / {CHANNELS.length}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {CHANNELS.map((channel) => (
          <ToggleSwitch
            key={channel.id}
            label={channel.label}
            description={channel.description}
            tone={channel.tone}
            checked={enabled[channel.id]}
            onCheckedChange={(checked) =>
              setEnabled((current) => ({ ...current, [channel.id]: checked }))
            }
          />
        ))}
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Bell className="size-3" aria-hidden="true" />
        关闭的渠道只会写进站内消息
      </p>
    </div>
  )
}
