"use client"

import * as React from "react"
import { LockKeyhole, Pause, Play } from "lucide-react"

import { Button } from "@/components/ui/button"
import { GlyphField } from "@/registry/ui/glyph-field/glyph-field"

export default function GlyphFieldDemo() {
  // 字符会持续闪烁，旁边留一个暂停入口，直接绑定 `paused`
  const [paused, setPaused] = React.useState(false)
  return (
    <div className="relative w-full">
      <GlyphField
        glyphs="hex"
        tone={["muted", "primary", "muted"]}
        fade="center"
        fontSize={12}
        paused={paused}
        className="h-96 rounded-lg"
      >
        <div className="mb-5 flex size-14 items-center justify-center rounded-xl border border-edge bg-background text-primary shadow-sm">
          <LockKeyhole className="size-6" aria-hidden="true" />
        </div>
        <p className="text-3xl font-semibold tracking-tight">安全访问</p>
        <p className="mt-3 text-sm text-muted-foreground">
          端到端加密 · 零信任
        </p>
      </GlyphField>
      <Button
        variant="outline"
        size="icon-sm"
        className="absolute top-3 right-3 bg-background"
        aria-label={paused ? "播放字符动画" : "暂停字符动画"}
        aria-pressed={paused}
        onClick={() => setPaused(!paused)}
      >
        {paused ? <Play /> : <Pause />}
      </Button>
    </div>
  )
}
