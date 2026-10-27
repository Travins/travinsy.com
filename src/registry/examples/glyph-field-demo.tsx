"use client"

import * as React from "react"
import { LockKeyhole, Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlyphField } from "@/registry/ui/glyph-field/glyph-field"

export default function GlyphFieldDemo() {
  const [paused, setPaused] = React.useState(false)
  return (
    <div
      data-slot="glyph-field-demo"
      className="relative w-full overflow-hidden rounded-lg border border-edge"
    >
      <GlyphField
        glyphs="hex"
        tone={["muted", "primary", "muted"]}
        fade="center"
        fontSize={12}
        paused={paused}
        className="h-[26rem]"
      >
        <div className="relative mb-5 flex size-32 items-center justify-center text-primary">
          <div className="absolute inset-4 rounded-full bg-primary/15 blur-2xl" />
          <svg
            aria-hidden="true"
            viewBox="0 0 120 136"
            className="absolute h-full w-28 overflow-visible fill-primary/5 stroke-primary [filter:drop-shadow(0_0_12px_var(--edge))]"
            strokeWidth="1.25"
          >
            <path d="M60 7 105 25v39c0 29-23 48-45 62C38 112 15 93 15 64V25Z" />
            <path
              d="m60 18 35 15v31c0 22-16 39-35 51-19-12-35-29-35-51V33Z"
              strokeDasharray="3 5"
              className="stroke-primary/40"
            />
            <path
              d="M60 0v15m0 106v15M0 68h22m76 0h22"
              className="stroke-primary/30"
            />
          </svg>
          <LockKeyhole
            aria-hidden="true"
            className="relative size-9"
            strokeWidth={1.3}
          />
        </div>
        <span className="mb-2 font-mono text-[10px] tracking-[0.24em] text-primary">
          ACCESS VERIFIED / 200
        </span>
        <p className="text-3xl font-semibold tracking-tight">安全访问</p>
        <p className="mt-3 text-sm text-muted-foreground">
          端到端加密 · 零信任
        </p>
      </GlyphField>
      <div className="absolute inset-x-4 top-4 flex items-center justify-between font-mono text-[10px] tracking-wider text-muted-foreground">
        <span className="bg-background/80 px-1">01 / SECURITY</span>
        <Button
          className="bg-background/80"
          variant="ghost"
          size="icon-sm"
          aria-label={paused ? "播放字符动画" : "暂停字符动画"}
          aria-pressed={paused}
          onClick={() => setPaused(!paused)}
        >
          {paused ? <Play /> : <Pause />}
        </Button>
      </div>
      <div className="pointer-events-none absolute inset-x-4 bottom-4 flex justify-between font-mono text-[10px] text-muted-foreground">
        <span className="bg-background/80 px-1">TLS 1.3</span>
        <span className="bg-background/80 px-1">连接已加密</span>
      </div>
    </div>
  )
}
