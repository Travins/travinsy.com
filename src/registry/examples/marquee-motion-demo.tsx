"use client"

import * as React from "react"
import { Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

// 演示共用暂停入口；CSS 选择器控制子级带子，不介入动画时钟。
export default function MarqueeMotionDemo({
  children,
}: {
  children?: React.ReactNode
}) {
  const [paused, setPaused] = React.useState(false)
  return (
    <div
      data-slot="marquee-motion-demo"
      data-paused={paused}
      className="relative w-full min-w-0 [&[data-paused=true]_[data-slot=marquee-group]]:[animation-play-state:paused]!"
    >
      {children}
      <Button
        variant="outline"
        size="icon-sm"
        className="absolute right-3 bottom-3 bg-background"
        aria-label={paused ? "继续滚动" : "暂停滚动"}
        aria-pressed={paused}
        onClick={() => setPaused((value) => !value)}
      >
        {paused ? <Play /> : <Pause />}
      </Button>
    </div>
  )
}
