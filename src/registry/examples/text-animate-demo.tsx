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
    <div className="relative flex min-h-80 w-full min-w-0 flex-col justify-center gap-7 overflow-hidden bg-dots px-6 py-10 sm:min-h-96 sm:px-10">
      <div className="flex items-center gap-3 font-mono text-[10px] tracking-widest text-muted-foreground">
        <span className="size-1.5 bg-primary" aria-hidden />
        <span>WORDS BECOME INTERFACES</span>
      </div>
      <h3 className="m-0! flex flex-col items-start gap-3 text-3xl! leading-tight! font-semibold tracking-tight sm:text-5xl!">
        <span>把界面写成</span>
        <TextFlip
          paused={paused}
          words={["组件", "积木", "设计系统"]}
          interval={2800}
        >
          组件、积木或设计系统
        </TextFlip>
      </h3>
      <p className="max-w-sm text-sm leading-7 text-muted-foreground">
        <TextReveal by="word">从一行文字开始，让每个想法都有形状。</TextReveal>
        <br />
        <TextHighlight>少一点重复，多一点创造。</TextHighlight>
      </p>
      <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] text-muted-foreground">
        <span>DECODING →</span>
        <TextScramble className="text-primary" duration={1800}>
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
