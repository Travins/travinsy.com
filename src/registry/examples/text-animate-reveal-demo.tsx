"use client"

import { useState } from "react"
import { RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TextReveal } from "@/registry/ui/text-animate/text-animate"

export default function TextAnimateRevealDemo() {
  const [cycle, setCycle] = useState(0)
  return (
    <div className="flex w-full max-w-md flex-col items-start gap-6">
      <p className="text-2xl leading-relaxed font-medium">
        <TextReveal key={cycle} trigger="mount">
          每一个字，都有自己的入场。
        </TextReveal>
      </p>
      <p className="text-base text-muted-foreground">
        <TextReveal key={`en-${cycle}`} by="word" trigger="mount" stagger={95}>
          Small details make a lasting impression.
        </TextReveal>
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setCycle((value) => value + 1)}
      >
        <RotateCcw data-icon="inline-start" />
        重新播放
      </Button>
    </div>
  )
}
