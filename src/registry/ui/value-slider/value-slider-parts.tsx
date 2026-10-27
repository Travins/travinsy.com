"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "@base-ui/react/slider"

import { cn } from "@/lib/utils"

import { valueToPercent } from "./utils"

type ValueSliderTrackProps = {
  /** 观测轨道宽度，用于手柄让位 */
  trackRef: React.RefObject<HTMLDivElement | null>
  labelRef: React.RefObject<HTMLSpanElement | null>
  valueRef: React.RefObject<HTMLSpanElement | null>
  /** 文字放在轨道上方时（`labelPlacement="outside"`）轨道里不再渲染它们 */
  outside: boolean
  label: React.ReactNode
  readout: string
  showValue: boolean
  /** 缓冲填充的百分比；`undefined` 表示不画 */
  bufferPercent: number | undefined
  hasTone: boolean
  ticks: readonly number[]
  min: number
  max: number
}

/**
 * 轨道与它内部的视觉层：缓冲填充、已选填充、刻度线、轨道内的标签与读数。
 * 只负责画，交互全部交给上层的 `Slider.Control` 与手柄。
 */
function ValueSliderTrack({
  trackRef,
  labelRef,
  valueRef,
  outside,
  label,
  readout,
  showValue,
  bufferPercent,
  hasTone,
  ticks,
  min,
  max,
}: ValueSliderTrackProps) {
  return (
    <SliderPrimitive.Track
      ref={trackRef}
      data-slot="value-slider-track"
      className="group/track relative h-(--value-slider-height) w-full overflow-hidden rounded-md border border-edge bg-muted/60"
    >
      {/* 缓冲段画在已选填充下面：先出现的是「已加载」，盖上去的是「已播放」 */}
      {bufferPercent === undefined ? null : (
        <span
          data-slot="value-slider-buffer"
          aria-hidden="true"
          className={cn(
            "absolute inset-y-0 start-0",
            hasTone
              ? "bg-(--flow-tone)/10"
              : "bg-foreground/10 dark:bg-foreground/15",
          )}
          style={{ width: `${bufferPercent}%` }}
        />
      )}
      <SliderPrimitive.Indicator
        data-slot="value-slider-indicator"
        className={cn(
          "h-full",
          hasTone
            ? "bg-(--flow-tone)/20 dark:bg-(--flow-tone)/35"
            : "bg-foreground/10 dark:bg-foreground/15",
        )}
      />
      {ticks.map((tick) => (
        <span
          key={tick}
          data-slot="value-slider-tick"
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 h-2 w-px -translate-y-1/2 bg-foreground/15 transition-colors group-hover/track:bg-foreground/30 in-data-[dragging]:bg-foreground/30"
          // 逻辑属性定位：LTR 从左边、RTL 从右边量；自己减掉半个线宽，两个方向都是居中的
          style={{
            insetInlineStart: `calc(${valueToPercent(tick, min, max)}% - 0.5px)`,
          }}
        />
      ))}
      {label !== undefined && !outside ? (
        <span
          ref={labelRef}
          data-slot="value-slider-label"
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 font-medium whitespace-nowrap text-muted-foreground"
        >
          {label}
        </span>
      ) : null}
      {showValue && !outside ? (
        <span
          ref={valueRef}
          data-slot="value-slider-value"
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 font-mono whitespace-nowrap tabular-nums text-muted-foreground transition-colors group-hover/value-slider:text-foreground in-data-[dragging]:text-foreground"
        >
          {readout}
        </span>
      ) : null}
    </SliderPrimitive.Track>
  )
}

type ValueSliderThumbProps = {
  index: number
  /** 手柄压在标签或读数上：淡下去让文字可读 */
  near: boolean
  hasTone: boolean
  /** 文字在轨道外时手柄常驻实色，不需要让位 */
  outside: boolean
  label: string
  valueText: string
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
}

/**
 * 手柄：一根 4px 的竖线，放在轨道外面一层，端点处不会被轨道的 overflow 裁掉。
 * 内部是一个视觉隐藏的 `input`，键盘聚焦时由它来给手柄本身加出环（区间模式下 Control 上
 * 的整体焦点环指不出是哪个手柄）。焦点把手柄从 4px 加粗到 6px，并撑满不透明度。
 */
function ValueSliderThumb({
  index,
  near,
  hasTone,
  outside,
  label,
  valueText,
  onKeyDown,
}: ValueSliderThumbProps) {
  return (
    <SliderPrimitive.Thumb
      index={index}
      data-slot="value-slider-thumb"
      data-near={near ? "true" : undefined}
      aria-label={label}
      aria-valuetext={valueText}
      className={cn(
        "h-1/2 w-1 rounded-full transition-[width,opacity]",
        "has-[:focus-visible]:w-1.5 has-[:focus-visible]:opacity-100 has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50",
        hasTone ? "bg-(--flow-tone)" : "bg-foreground",
        outside
          ? "opacity-100"
          : "opacity-40 group-hover/value-slider:opacity-100 in-data-[dragging]:opacity-100 data-[near=true]:not-has-[:focus-visible]:opacity-20!",
      )}
      onKeyDown={onKeyDown}
    />
  )
}

export { ValueSliderThumb, ValueSliderTrack }
export type { ValueSliderThumbProps, ValueSliderTrackProps }
