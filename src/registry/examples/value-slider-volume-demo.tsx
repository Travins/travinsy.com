"use client"

import * as React from "react"
import { Volume1, Volume2, VolumeX } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  ValueSlider,
  useValueSliderMuted,
} from "@/registry/ui/value-slider/value-slider"

const PERCENT: Intl.NumberFormatOptions = { style: "unit", unit: "percent" }

/** 静音入口：和滑块共用同一份静音偏好，点一下全站的滑块都不再出声 */
function SoundToggle({
  muted,
  onChange,
}: {
  muted: boolean
  onChange: (muted: boolean) => void
}) {
  const label = muted ? "打开拖动音效" : "关闭拖动音效"
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-pressed={!muted}
      aria-label={label}
      title={label}
      onClick={() => onChange(!muted)}
    >
      {muted ? <VolumeX /> : <Volume2 />}
    </Button>
  )
}

/** 受控音量：起点图标随音量换档，拖动时每一步都有刻度音效 */
export default function ValueSliderVolumeDemo() {
  const [volume, setVolume] = React.useState(60)
  const [muted, setMuted] = useValueSliderMuted()
  return (
    <div className="w-full max-w-xs rounded-xl border border-edge bg-background p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-medium">输出音量</p>
          <p className="text-xs text-muted-foreground">拖动刻度会发出轻响</p>
        </div>
        <SoundToggle muted={muted} onChange={setMuted} />
      </div>
      <div className="mt-4">
        <ValueSlider
          label="音量"
          tone="primary"
          value={volume}
          onValueChange={setVolume}
          format={PERCENT}
          sound
          startIcon={
            volume === 0 ? <VolumeX /> : volume < 50 ? <Volume1 /> : <Volume2 />
          }
        />
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        {muted ? "音效已静音，偏好记在本机" : "音效已打开，静音偏好记在本机"}
      </p>
    </div>
  )
}
