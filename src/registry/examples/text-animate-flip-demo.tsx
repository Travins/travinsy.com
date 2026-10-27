"use client"

import { useState } from "react"
import { Pause, Play } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TextFlip } from "@/registry/ui/text-animate/text-animate"

export default function TextAnimateFlipDemo() {
  const [paused, setPaused] = useState(false)
  return (
    <div className="flex w-full max-w-md flex-col items-start gap-6 leading-loose font-medium tracking-tight">
      <p className="text-2xl">
        为 <TextFlip paused={paused} words={["开发者", "设计师", "创造者"]} />{" "}
        而造。
      </p>
      <p className="text-xl">
        Build with{" "}
        <TextFlip
          paused={paused}
          words={["care", "clarity", "a little curiosity"]}
          variant="underline"
          tone="violet"
          interval={3200}
        />
        .
      </p>
      <Button
        variant="outline"
        size="sm"
        aria-pressed={paused}
        onClick={() => setPaused((value) => !value)}
      >
        {paused ? (
          <Play data-icon="inline-start" />
        ) : (
          <Pause data-icon="inline-start" />
        )}
        {paused ? "继续轮换" : "暂停轮换"}
      </Button>
    </div>
  )
}
