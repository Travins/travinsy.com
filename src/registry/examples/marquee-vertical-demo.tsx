"use client"

import * as React from "react"
import { Pause, Play } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Marquee, MarqueeItem } from "@/registry/ui/marquee/marquee"

const UPDATES = [
  { time: "10:42", title: "组件已发布", note: "新增四向滚动与交叉丝带。" },
  { time: "10:28", title: "构建完成", note: "全部页面已导出为静态文件。" },
  { time: "09:56", title: "文字动效就绪", note: "支持中文分字与乱码解码。" },
  { time: "09:30", title: "主题同步", note: "亮暗模式与颜色主题独立切换。" },
]

export default function MarqueeVerticalDemo() {
  // 持续滚动的正文应当提供暂停入口，直接绑定 `paused`
  const [paused, setPaused] = React.useState(false)
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">更新动态</p>
        <Button
          variant="outline"
          size="sm"
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? <Play /> : <Pause />}
          暂停滚动
        </Button>
      </div>
      <Marquee
        direction="up"
        speed={22}
        gap={16}
        paused={paused}
        className="h-56"
        label="组件库更新动态"
      >
        {UPDATES.map(({ time, title, note }) => (
          <MarqueeItem
            key={time}
            className="w-full items-start gap-4 border-b border-edge pb-4 whitespace-normal"
          >
            <span className="pt-1 font-mono text-[10px] text-muted-foreground">
              {time}
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">{title}</span>
              <span className="text-xs leading-5 text-muted-foreground">
                {note}
              </span>
            </div>
          </MarqueeItem>
        ))}
      </Marquee>
    </div>
  )
}
