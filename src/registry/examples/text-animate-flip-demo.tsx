"use client"

import { useState } from "react"
import { Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TextFlip } from "@/registry/ui/text-animate/text-animate"

export default function TextAnimateFlipDemo() {
  const [paused, setPaused] = useState(false)
  return (
    <div className="flex w-full flex-col items-start gap-7 px-6 py-12 text-2xl leading-loose font-medium tracking-tight">
      <p>
        为 <TextFlip paused={paused} words={["开发者", "设计师", "创造者"]} />{" "}
        而造。
      </p>
      <p className="text-xl">
        Build with{" "}
        <TextFlip
          paused={paused}
          words={["care", "clarity", "a little curiosity"]}
          variant="underline"
          interval={3200}
        />
        .
      </p>
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
