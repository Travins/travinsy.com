"use client"

import * as React from "react"
import { Disc3, Pause, Play } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ValueSlider } from "@/registry/ui/value-slider/value-slider"

/** 时长 3:34：格式化成分:秒，读屏朗读的也是这个格式 */
const DURATION = 214
/** 已缓冲段固定比当前进度多 40 秒，封顶到总长 */
const BUFFER_AHEAD = 40

function clock(value: number) {
  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value % 60)
  return `${minutes}:${String(seconds).padStart(2, "0")}`
}

/** 读数写成「已播 / 总长」，`aria-valuetext` 也是这个字符串 */
const progress = (value: number) => `${clock(value)} / ${clock(DURATION)}`

/** 播放进度：播放时每秒前进一格，拖到末尾自动停下 */
export default function ValueSliderPlaybackDemo() {
  const [position, setPosition] = React.useState(62)
  const [playing, setPlaying] = React.useState(false)
  // 走到末尾就停：真正的播放状态由 position 一起决定，不需要额外的副作用
  const running = playing && position < DURATION

  React.useEffect(() => {
    if (!running) return
    const timer = window.setInterval(
      () => setPosition((previous) => Math.min(DURATION, previous + 1)),
      1000,
    )
    return () => window.clearInterval(timer)
  }, [running])

  const toggle = () => {
    if (running) {
      setPlaying(false)
      return
    }
    if (position >= DURATION) setPosition(0)
    setPlaying(true)
  }

  return (
    <div className="w-full max-w-xs rounded-xl border border-edge bg-background p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className="grid size-12 shrink-0 place-items-center rounded-lg text-foreground/75"
          style={{
            background:
              "linear-gradient(140deg, color-mix(in oklab, var(--flow-violet) 62%, var(--background)), color-mix(in oklab, var(--flow-rose) 52%, var(--background)))",
          }}
        >
          <Disc3 className="size-5" aria-hidden="true" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="truncate text-sm font-medium">晚风里的旧唱机</p>
          <p className="truncate text-xs text-muted-foreground">
            林砚 · 夜行手记
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="icon-sm"
          aria-label={running ? "暂停" : "播放"}
          title={running ? "暂停" : "播放"}
          onClick={toggle}
        >
          {running ? <Pause /> : <Play />}
        </Button>
      </div>
      <div className="mt-4 flex h-11 items-center">
        <ValueSlider
          aria-label="播放进度"
          variant="line"
          tone="primary"
          size="sm"
          min={0}
          max={DURATION}
          step={1}
          largeStep={30}
          value={position}
          onValueChange={setPosition}
          formatValue={progress}
          buffer={Math.min(DURATION, position + BUFFER_AHEAD)}
        />
      </div>
    </div>
  )
}
