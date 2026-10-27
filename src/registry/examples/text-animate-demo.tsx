"use client"

import { useState } from "react"
import { Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  TextFlip,
  TextHighlight,
  TextReveal,
  TextScramble,
} from "@/registry/ui/text-animate/text-animate"
import { GridCrosshair } from "@/registry/ui/grid-layout/grid-layout"

export default function TextAnimateDemo() {
  const [paused, setPaused] = useState(false)
  return (
    <div className="relative flex min-h-80 w-full min-w-0 flex-col justify-center gap-6 overflow-hidden bg-dots px-6 py-8 sm:min-h-[22rem] sm:px-10">
      {/* 蓝紫两团光晕：让关键词的色调有落脚的地方，亮暗模式下都靠 --flow-* 变量取色 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_88%_6%,color-mix(in_oklab,var(--flow-blue)_20%,transparent),transparent_52%),radial-gradient(ellipse_at_6%_104%,color-mix(in_oklab,var(--flow-violet)_14%,transparent),transparent_50%)]"
      />
      <p className="relative flex flex-col items-start gap-3 text-3xl leading-tight font-semibold tracking-tight sm:text-5xl">
        <span>把界面写成</span>
        <TextFlip
          tone="blue"
          paused={paused}
          words={["组件", "积木", "设计系统"]}
          interval={2800}
        >
          组件、积木或设计系统
        </TextFlip>
      </p>
      <p className="relative max-w-sm text-sm leading-7 text-muted-foreground">
        <TextReveal by="word">从一行文字开始，让每个想法都有形状。</TextReveal>
        <br />
        <TextHighlight tone="amber" className="text-foreground">
          少一点重复，多一点创造。
        </TextHighlight>
      </p>
      <div className="relative flex flex-wrap items-center gap-2 pr-10 font-mono text-[10px] text-muted-foreground">
        <span>DECODING →</span>
        <TextScramble className="text-(--flow-green)" duration={1800}>
          构建完成 / READY TO SHIP
        </TextScramble>
      </div>
      <GridCrosshair position="top-right" className="top-5 right-5" />
      <GridCrosshair position="bottom-left" className="bottom-5 left-5" />
      <Button
        variant="outline"
        size="icon-sm"
        className="absolute right-4 bottom-4 bg-background"
        aria-label={paused ? "继续轮换" : "暂停轮换"}
        aria-pressed={paused}
        onClick={() => setPaused((value) => !value)}
      >
        {paused ? <Play /> : <Pause />}
      </Button>
    </div>
  )
}
