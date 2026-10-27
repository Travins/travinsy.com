"use client"

import { useState } from "react"
import { Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  TextFlip,
  TextReveal,
  TextScramble,
} from "@/registry/ui/text-animate/text-animate"

export default function TextAnimateMixedDemo() {
  const [paused, setPaused] = useState(false)
  return (
    <div className="flex w-full flex-col items-start gap-6 px-6 py-10">
      <h3 className="m-0! text-2xl! leading-loose! font-medium">
        你好，
        <TextFlip
          paused={paused}
          words={["世界", "world", "つくり手"]}
          variant="underline"
        />
        。
      </h3>
      <p className="text-sm leading-7 text-muted-foreground">
        <TextReveal by="word">
          用 React 构建界面，把 ideas 变成 reality。
        </TextReveal>
      </p>
      <TextScramble characters="界面UI01/" className="text-xs text-primary">
        SYSTEM READY / 系统就绪
      </TextScramble>
      <Button
        variant="outline"
        size="icon-sm"
        aria-label={paused ? "继续轮换" : "暂停轮换"}
        aria-pressed={paused}
        onClick={() => setPaused((value) => !value)}
      >
        {paused ? <Play /> : <Pause />}
      </Button>
    </div>
  )
}
