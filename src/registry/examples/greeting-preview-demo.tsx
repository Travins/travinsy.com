"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { GreetingCard } from "@/registry/ui/greeting/greeting"

// `null` 表示跟随访客的真实时间
const PREVIEWS = [
  { label: "现在", hour: null },
  { label: "08:00", hour: 8 },
  { label: "12:30", hour: 12.5 },
  { label: "16:00", hour: 16 },
  { label: "22:00", hour: 22 },
] as const

/** 传入 `hour` 即可固定在某个时刻：做设计预览、截图或测试时不必等到那个时段。 */
export default function GreetingPreviewDemo() {
  const [hour, setHour] = useState<number | null>(null)
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div
        role="group"
        aria-label="预览时刻"
        className="flex flex-wrap gap-1.5"
      >
        {PREVIEWS.map((preview) => (
          <Button
            key={preview.label}
            size="sm"
            variant={hour === preview.hour ? "default" : "outline"}
            aria-pressed={hour === preview.hour}
            onClick={() => setHour(preview.hour)}
          >
            {preview.label}
          </Button>
        ))}
      </div>
      <GreetingCard name="Travins" hour={hour ?? undefined} />
    </div>
  )
}
