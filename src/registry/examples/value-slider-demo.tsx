"use client"

import * as React from "react"
import {
  Flame,
  Snowflake,
  Sun,
  SunDim,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  ValueSlider,
  useValueSliderMuted,
} from "@/registry/ui/value-slider/value-slider"

const PERCENT: Intl.NumberFormatOptions = { style: "unit", unit: "percent" }
const KELVIN = (value: number) => `${value} K`

/** 音量图标按档位换：静音、低、高 */
function volumeIcon(value: number) {
  if (value === 0) return <VolumeX />
  return value < 50 ? <Volume1 /> : <Volume2 />
}

/** 音效开关：静音偏好存在本地，全站带音效的组件共用 */
function SoundToggle() {
  const [muted, setMuted] = useValueSliderMuted()
  const label = muted ? "打开拖动音效" : "关闭拖动音效"
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-pressed={!muted}
      aria-label={label}
      title={label}
      onClick={() => setMuted(!muted)}
    >
      {muted ? <VolumeX /> : <Volume2 />}
    </Button>
  )
}

/** 默认示例：一条「显示与声音」设置卡，三个滑块各用一种色调。 */
export default function ValueSliderDemo() {
  const [brightness, setBrightness] = React.useState(64)
  const [volume, setVolume] = React.useState(40)
  // 右侧的太阳跟着亮度长大：14px（size-3.5）到 20px（size-5）
  const sunSize = Math.round(14 + (brightness / 100) * 6)

  return (
    <div className="relative flex h-80 w-full items-center justify-center overflow-hidden bg-dots px-4">
      {/* 主题色光晕：从卡片下面往外晕开，颜色随颜色主题变化 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_55%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_72%)]"
      />
      <div className="relative w-full max-w-sm rounded-xl border border-edge bg-background p-4 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">显示与声音</p>
          <SoundToggle />
        </div>
        <div className="mt-3 flex flex-col gap-4">
          <div className="flex h-10 items-center">
            <ValueSlider
              label="亮度"
              size="lg"
              tone="amber"
              value={brightness}
              onValueChange={setBrightness}
              format={PERCENT}
              startIcon={<SunDim />}
              // 右侧图标都放进同宽插槽：太阳长大时轨道宽度不变，三条轨道也对齐
              endIcon={
                <span className="grid size-5 place-items-center">
                  <Sun style={{ width: sunSize, height: sunSize }} />
                </span>
              }
            />
          </div>
          <div className="flex h-10 items-center">
            <ValueSlider
              label="音量"
              size="lg"
              tone="blue"
              value={volume}
              onValueChange={setVolume}
              format={PERCENT}
              startIcon={volumeIcon(volume)}
              endIcon={
                <span className="grid size-5 place-items-center">
                  <Volume2 />
                </span>
              }
              sound
            />
          </div>
          <div className="flex h-10 items-center">
            <ValueSlider
              label="色温"
              size="lg"
              tone="cyan"
              min={2700}
              max={6500}
              step={100}
              largeStep={500}
              defaultValue={4500}
              ticks={4}
              snapToTicks
              formatValue={KELVIN}
              startIcon={<Flame />}
              endIcon={
                <span className="grid size-5 place-items-center">
                  <Snowflake />
                </span>
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}
