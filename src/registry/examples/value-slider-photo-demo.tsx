"use client"

import * as React from "react"
import { RotateCcw, Sun, SunDim } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ValueSlider } from "@/registry/ui/value-slider/value-slider"

/** 只有 0 一个刻度：松手时吸回中性位置 */
const NEUTRAL_TICK = [0] as const

/** 带正负号的读数：0 不显示符号 */
function signed(value: number) {
  return value > 0 ? `+${value}` : String(value)
}

/** 三条滑块实时改预览图的 CSS filter，全程没有真实图片 */
export default function ValueSliderPhotoDemo() {
  const [exposure, setExposure] = React.useState(0)
  const [contrast, setContrast] = React.useState(0)
  const [saturation, setSaturation] = React.useState(0)
  const untouched = exposure === 0 && contrast === 0 && saturation === 0
  const reset = () => {
    setExposure(0)
    setContrast(0)
    setSaturation(0)
  }

  return (
    <div className="w-full max-w-sm rounded-xl border border-edge bg-background p-4 shadow-xs">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">调色</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={untouched}
          onClick={reset}
        >
          <RotateCcw />
          还原
        </Button>
      </div>
      <div className="mt-3 overflow-hidden rounded-lg border border-edge">
        <div
          className="relative aspect-[16/10] w-full"
          style={{
            filter: `brightness(${1 + (exposure / 100) * 0.6}) contrast(${
              1 + (contrast / 100) * 0.6
            }) saturate(${Math.max(0, 1 + saturation / 100)})`,
          }}
        >
          {/* 天空：从蓝到青，靠近地平线透出一点暖色 */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, color-mix(in oklab, var(--flow-blue) 52%, var(--background)), color-mix(in oklab, var(--flow-cyan) 26%, var(--background)) 62%, color-mix(in oklab, var(--flow-amber) 22%, var(--background)))",
            }}
          />
          <svg
            viewBox="0 0 320 200"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="absolute inset-0 size-full"
          >
            {/* 太阳与它周围的光晕 */}
            <defs>
              <radialGradient id="value-slider-photo-glow">
                <stop
                  offset="35%"
                  stopColor="var(--flow-amber)"
                  stopOpacity="0.5"
                />
                <stop
                  offset="100%"
                  stopColor="var(--flow-amber)"
                  stopOpacity="0"
                />
              </radialGradient>
            </defs>
            <circle
              cx="250"
              cy="56"
              r="52"
              fill="url(#value-slider-photo-glow)"
            />
            <circle cx="250" cy="56" r="18" fill="var(--flow-amber)" />
            {/* 远山与近处的坡地 */}
            <path
              d="M0 136 L56 82 L104 124 L154 70 L214 136 Z"
              fill="var(--flow-violet)"
              opacity="0.45"
            />
            <path
              d="M112 152 L182 88 L230 130 L276 98 L320 150 Z"
              fill="var(--flow-green)"
              opacity="0.6"
            />
            <rect
              y="150"
              width="320"
              height="50"
              fill="var(--flow-green)"
              opacity="0.32"
            />
          </svg>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-3">
        {/* 每条滑块占固定高度：调整面板换尺寸档时卡片高度不变 */}
        <div className="flex h-9 items-center">
          <ValueSlider
            label="曝光"
            tone="amber"
            min={-100}
            max={100}
            step={1}
            value={exposure}
            onValueChange={setExposure}
            formatValue={signed}
            ticks={NEUTRAL_TICK}
            snapToTicks
            startIcon={<SunDim />}
            endIcon={<Sun />}
          />
        </div>
        <div className="flex h-9 items-center">
          <ValueSlider
            label="对比度"
            tone="violet"
            min={-100}
            max={100}
            step={1}
            value={contrast}
            onValueChange={setContrast}
            formatValue={signed}
            ticks={NEUTRAL_TICK}
            snapToTicks
          />
        </div>
        <div className="flex h-9 items-center">
          <ValueSlider
            label="饱和度"
            tone="green"
            min={-100}
            max={100}
            step={1}
            value={saturation}
            onValueChange={setSaturation}
            formatValue={signed}
            ticks={NEUTRAL_TICK}
            snapToTicks
          />
        </div>
      </div>
    </div>
  )
}
