"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "@base-ui/react/slider"

import { cn } from "@/lib/utils"

import type { ValueSliderVariant } from "./types"
import { valueToPercent } from "./utils"

type ValueSliderTrackProps = {
  /** 观测轨道宽度，用于手柄让位 */
  trackRef: React.RefObject<HTMLDivElement | null>
  labelRef: React.RefObject<HTMLSpanElement | null>
  valueRef: React.RefObject<HTMLSpanElement | null>
  variant: ValueSliderVariant
  /** 文字放在轨道上方时（`labelPlacement="outside"`，以及 `pill` / `line`）轨道里不再渲染它们 */
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
 *
 * `pill` / `line` 的轨道只有几像素高，刻度线放进去会被裁掉、也会被手柄盖住，
 * 所以这两种形态把刻度画在轨道下方（点在轨道外一层，与手柄同级，不被 `overflow-hidden` 影响）。
 */
function ValueSliderTrack({
  trackRef,
  labelRef,
  valueRef,
  variant,
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
  // 细轨形态：轨道只有 2–12px，配色也换成实色，否则淡色叠在淡色上几乎看不见
  const thin = variant !== "bar"

  return (
    <>
      <SliderPrimitive.Track
        ref={trackRef}
        data-slot="value-slider-track"
        className={cn(
          "group/track relative h-(--value-slider-track-height) w-full overflow-hidden",
          thin
            ? "rounded-full bg-muted"
            : "rounded-md border border-edge bg-muted/60",
          // 轨道太细时再加一圈边框会吃掉大半个高度，只有 pill 保留
          variant === "pill" && "border border-edge",
        )}
      >
        {/* 缓冲段画在已选填充下面：先出现的是「已加载」，盖上去的是「已播放」 */}
        {bufferPercent === undefined ? null : (
          <span
            data-slot="value-slider-buffer"
            aria-hidden="true"
            className={cn(
              "absolute inset-y-0 start-0",
              thin
                ? hasTone
                  ? "bg-(--flow-tone)/25"
                  : "bg-foreground/20"
                : hasTone
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
            thin
              ? hasTone
                ? "bg-(--flow-tone)"
                : "bg-foreground"
              : hasTone
                ? "bg-(--flow-tone)/20 dark:bg-(--flow-tone)/35"
                : "bg-foreground/10 dark:bg-foreground/15",
          )}
        />
        {thin
          ? null
          : ticks.map((tick) => (
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
      {/* 刻度点：`top-full` 相对视觉层（等于轨道高度），`mt-0.5` 让点和轨道留出一点缝 */}
      {thin
        ? ticks.map((tick) => (
            <span
              key={tick}
              data-slot="value-slider-tick"
              aria-hidden="true"
              className="pointer-events-none absolute top-full mt-0.5 size-1 rounded-full bg-foreground/30"
              style={{
                insetInlineStart: `calc(${valueToPercent(tick, min, max)}% - 2px)`,
              }}
            />
          ))
        : null}
    </>
  )
}

type ValueSliderThumbProps = {
  index: number
  variant: ValueSliderVariant
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
 * 手柄：`bar` 是一根 4px 的竖线，`pill` / `line` 是圆点。
 * 都放在轨道外面一层，端点处不会被轨道的 overflow 裁掉，纵向由 Base UI 的 `top: 50%` 居中。
 * 内部是一个视觉隐藏的 `input`，键盘聚焦时由它来给手柄本身加出环（区间模式下 Control 上
 * 的整体焦点环指不出是哪个手柄）。
 *
 * 竖线手柄聚焦时从 4px 加粗到 6px 并撑满不透明度；圆点手柄常驻不透明，聚焦出环、
 * 拖动时轻微放大（`prefers-reduced-motion` 下只出环，不放大）。
 */
function ValueSliderThumb({
  index,
  variant,
  near,
  hasTone,
  outside,
  label,
  valueText,
  onKeyDown,
}: ValueSliderThumbProps) {
  const thin = variant !== "bar"

  return (
    <SliderPrimitive.Thumb
      index={index}
      data-slot="value-slider-thumb"
      data-near={near ? "true" : undefined}
      aria-label={label}
      aria-valuetext={valueText}
      className={cn(
        "rounded-full",
        thin
          ? // 圆点手柄：底色取背景色，边框取色调，压在任何填充上都分得清
            "size-(--value-slider-thumb-size) border-2 bg-background shadow-sm transition-[scale] motion-safe:in-data-[dragging]:scale-110"
          : "h-1/2 w-1 transition-[width,opacity]",
        "has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50",
        thin
          ? hasTone
            ? "border-(--flow-tone)"
            : "border-foreground"
          : hasTone
            ? "bg-(--flow-tone)"
            : "bg-foreground",
        thin || outside
          ? "opacity-100"
          : "opacity-40 group-hover/value-slider:opacity-100 in-data-[dragging]:opacity-100 data-[near=true]:not-has-[:focus-visible]:opacity-20!",
        !thin &&
          "has-[:focus-visible]:w-1.5 has-[:focus-visible]:opacity-100",
      )}
      onKeyDown={onKeyDown}
    />
  )
}

export { ValueSliderThumb, ValueSliderTrack }
export type { ValueSliderThumbProps, ValueSliderTrackProps }
