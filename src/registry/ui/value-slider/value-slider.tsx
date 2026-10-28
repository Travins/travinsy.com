"use client"

import * as React from "react"
import { useDirection } from "@base-ui/react/direction-provider"
import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import { cva } from "class-variance-authority"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"
import { useControllableState } from "@/registry/hooks/use-controllable-state"
import { flowToneStyle } from "@/registry/ui/flow-diagram/tone"

import { playEdge, playTick, useValueSliderMuted } from "./sound"
import type {
  ValueSliderProps,
  ValueSliderTuning,
  ValueSliderValue,
} from "./types"
import { useElasticPull } from "./use-elastic-pull"
import { useHandleDodge } from "./use-handle-dodge"
import { ValueSliderThumb, ValueSliderTrack } from "./value-slider-parts"
import {
  clamp01,
  crossedTick,
  resolveTicks,
  sameValue,
  snapValuesToTicks,
  stepDecimals,
  toNumberList,
  valueToPercent,
} from "./utils"

/** 刻度音效的最短间隔（毫秒），拖动时值变化很快，太密会糊成噪声。 */
const TICK_INTERVAL = 35
/** 碰边音效的最短间隔（毫秒），磁吸与过冲可能同时报同一次碰边。 */
const EDGE_INTERVAL = 250
/** 磁吸判定：与最近刻度的距离不超过整个范围的这个比例时吸过去。 */
const SNAP_RATIO = 0.03

const valueSliderVariants = cva("flex w-full flex-col select-none", {
  variants: {
    size: {
      sm: "gap-1 text-xs [--value-slider-height:1.75rem]",
      default: "gap-1 text-sm [--value-slider-height:2rem]",
      lg: "gap-1 text-sm [--value-slider-height:2.25rem]",
    },
    variant: {
      // 三种形态都是方条，只是高度不同：bar 沿用尺寸档的高度，compact / slim 在 compoundVariants 里按尺寸细分
      bar: "[--value-slider-track-height:var(--value-slider-height)]",
      // 中等高度：轨道里仍放标签与读数，字号统一收到 xs
      compact: "text-xs",
      // 矮轨：文字移到上方，手柄比轨道高出一截
      slim: "gap-1.5",
    },
  },
  compoundVariants: [
    {
      variant: "compact",
      size: "sm",
      class: "[--value-slider-track-height:1.125rem]",
    },
    {
      variant: "compact",
      size: "default",
      class: "[--value-slider-track-height:1.375rem]",
    },
    {
      variant: "compact",
      size: "lg",
      class: "[--value-slider-track-height:1.5rem]",
    },
    {
      variant: "slim",
      size: "sm",
      class:
        "[--value-slider-track-height:0.375rem] [--value-slider-thumb-height:0.875rem]",
    },
    {
      variant: "slim",
      size: "default",
      class:
        "[--value-slider-track-height:0.5rem] [--value-slider-thumb-height:1rem]",
    },
    {
      variant: "slim",
      size: "lg",
      class:
        "[--value-slider-track-height:0.625rem] [--value-slider-thumb-height:1.125rem]",
    },
  ],
  defaultVariants: {
    size: "default",
    variant: "bar",
  },
})

/**
 * 可选的调整上下文：子树里所有 ValueSlider 的对应属性被这里的值覆盖。
 * 用于调试面板一类的场景；不包这一层时组件行为不变。
 */
const ValueSliderTuningContext = React.createContext<ValueSliderTuning>({})

/** 带标签与读数的数值滑块，拖出两端时有橡皮筋过冲与弹簧回弹。 */
function ValueSlider<Value extends ValueSliderValue = number>(
  allProps: ValueSliderProps<Value>,
) {
  const { onReport, ...overrides } = React.useContext(ValueSliderTuningContext)
  const {
    value: valueProp,
    defaultValue,
    onValueChange,
    onValueCommitted,
    min = 0,
    max = 100,
    step = 1,
    largeStep = 10,
    minStepsBetweenValues = 0,
    disabled = false,
    name,
    format,
    locale,
    label,
    "aria-label": ariaLabel,
    labelPlacement = "inside",
    buffer,
    formatValue,
    showValue: showValueProp = true,
    startIcon,
    endIcon,
    ticks: ticksProp,
    snapToTicks: snapToTicksProp = false,
    elasticity: elasticityProp = 12,
    size: sizeProp = "default",
    variant: variantProp = "bar",
    tone: toneProp,
    sound: soundProp = false,
    className,
    style,
    ...props
  } = allProps

  // 回报示例自己的取值（覆盖前），面板打开时显示的就是示例现在的样子
  React.useEffect(() => {
    onReport?.({
      elasticity: elasticityProp,
      size: sizeProp,
      variant: variantProp,
      tone: toneProp,
      // 显式刻度数组没有「段数」可言，报 undefined 让面板显示默认值
      ticks: typeof ticksProp === "number" ? ticksProp : undefined,
      snapToTicks: snapToTicksProp,
      showValue: showValueProp,
      sound: soundProp,
    })
  }, [
    onReport,
    elasticityProp,
    sizeProp,
    variantProp,
    toneProp,
    ticksProp,
    snapToTicksProp,
    showValueProp,
    soundProp,
  ])

  const elasticity = Math.max(0, overrides.elasticity ?? elasticityProp)
  const size = overrides.size ?? sizeProp
  const variant = overrides.variant ?? variantProp
  const ticks = overrides.ticks ?? ticksProp
  const snapToTicks = overrides.snapToTicks ?? snapToTicksProp
  const showValue = overrides.showValue ?? showValueProp
  const sound = overrides.sound ?? soundProp
  const tone =
    overrides.tone === false ? undefined : (overrides.tone ?? toneProp)
  const hasTone = tone !== undefined
  // slim 的轨道只有几像素高，文字放不进去，一律摆到上方，等同 labelPlacement="outside"
  const slim = variant === "slim"
  const outside = slim || labelPlacement === "outside"

  // 读数、碰边判断都基于当前值，所以值统一收在这里，再以受控方式交给 Base UI
  const [value, setValue] = useControllableState<Value>({
    prop: valueProp,
    defaultProp: (defaultValue ?? min) as Value,
    onChange: onValueChange,
  })
  const values = React.useMemo(() => toNumberList(value), [value])
  const isRange = values.length > 1

  const direction = useDirection()
  const [muted] = useValueSliderMuted()
  const soundOn = sound && !muted
  const soundOnRef = React.useRef(soundOn)
  React.useEffect(() => {
    soundOnRef.current = soundOn
  })

  const decimals = stepDecimals(step)
  const formatNumber = React.useMemo(() => {
    if (formatValue) return formatValue
    const formatter = new Intl.NumberFormat(locale ?? "zh-CN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals,
      ...format,
    })
    return (item: number) => formatter.format(item)
  }, [formatValue, locale, format, decimals])

  const tickList = React.useMemo(
    () => resolveTicks(ticks, min, max),
    [ticks, min, max],
  )
  const innerTicks = React.useMemo(
    () => tickList.filter((tick) => tick > min && tick < max),
    [tickList, min, max],
  )

  /* ---------- 音效 ---------- */

  const lastTickRef = React.useRef(0)
  const lastEdgeRef = React.useRef(0)
  const previousValuesRef = React.useRef<number[] | null>(null)

  const playEdgeOnce = React.useCallback(() => {
    const now = performance.now()
    if (now - lastEdgeRef.current < EDGE_INTERVAL) return
    lastEdgeRef.current = now
    if (soundOnRef.current) playEdge()
  }, [])

  const handleValueChange = (next: Value) => {
    const list = toNumberList(next)
    const previous = previousValuesRef.current
    previousValuesRef.current = list
    setValue(next)

    // 音效跟着变化最大的那个手柄走
    let index = 0
    let from = previous?.[0]
    if (previous && previous.length === list.length) {
      let largest = -1
      list.forEach((item, itemIndex) => {
        const delta = Math.abs(item - (previous[itemIndex] ?? item))
        if (delta > largest) {
          largest = delta
          index = itemIndex
          from = previous[itemIndex]
        }
      })
    }
    const changed = list[index] ?? min
    if (changed <= min || changed >= max) playEdgeOnce()
    if (!soundOn) return
    const crossed = from !== undefined && crossedTick(from, changed, tickList)
    const stepped =
      from === undefined || Math.abs(changed - from) >= step - 1e-9
    if (tickList.length > 0 ? crossed : stepped) {
      const now = performance.now()
      if (now - lastTickRef.current >= TICK_INTERVAL) {
        lastTickRef.current = now
        playTick(clamp01((changed - min) / Math.max(1e-6, max - min)))
      }
    }
  }

  /**
   * 只有指针交互松开时才磁吸。
   * Base UI 对每一次键盘变更也会调 `onValueCommitted`（reason 为 `"keyboard"`），
   * 在那里吸附会让值被反复拉回最近的刻度，方向键就只能在刻度上原地挣扎。
   */
  const handleValueCommitted = (
    next: Value,
    details: SliderPrimitive.Root.CommitEventDetails,
  ) => {
    let committed = next
    const fromPointer =
      details.reason === "drag" || details.reason === "track-press"
    if (snapToTicks && fromPointer && tickList.length > 0) {
      const list = toNumberList(next)
      const snapped = snapValuesToTicks(list, {
        ticks: tickList,
        min,
        max,
        step,
        minGapSteps: minStepsBetweenValues,
        tolerance: (max - min) * SNAP_RATIO,
      })
      if (!sameValue(snapped, list)) {
        const result = (snapped.length === 1 ? snapped[0] : snapped) as Value
        setValue(result)
        committed = result
      }
    }
    onValueCommitted?.(committed)
  }

  /* ---------- 过冲 ---------- */

  const elastic = useElasticPull({ elasticity, disabled, onEdge: playEdgeOnce })

  const handleThumbKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    const current = values[index] ?? min
    // RTL 时左右方向键的增减是反的；方向取自 Base UI 的 DirectionProvider，与它自己的按键映射一致
    const rtl = direction === "rtl"
    // 端点脉冲是物理方向的：RTL 时 min 在右边，所以两侧要互换
    const minSide = rtl ? "end" : "start"
    const maxSide = rtl ? "start" : "end"
    const towardStart =
      event.key === (rtl ? "ArrowRight" : "ArrowLeft") ||
      event.key === "ArrowDown" ||
      event.key === "PageDown" ||
      event.key === "Home"
    const towardEnd =
      event.key === (rtl ? "ArrowLeft" : "ArrowRight") ||
      event.key === "ArrowUp" ||
      event.key === "PageUp" ||
      event.key === "End"
    if (towardStart && current <= min) elastic.pulse(minSide)
    else if (towardEnd && current >= max) elastic.pulse(maxSide)
  }

  /* ---------- 手柄让开轨道内的文字 ---------- */

  const insideText = !outside && (label !== undefined || showValue)
  const { trackRef, labelRef, valueRef, isNear } = useHandleDodge(insideText)

  const thumbName = ariaLabel ?? (typeof label === "string" ? label : "数值")
  const readout = isRange
    ? `${formatNumber(values[0])} – ${formatNumber(values[values.length - 1])}`
    : formatNumber(values[0] ?? min)
  const bufferPercent =
    buffer === undefined || isRange
      ? undefined
      : valueToPercent(buffer, min, max)

  return (
    <SliderPrimitive.Root
      {...props}
      value={value}
      onValueChange={(next) => handleValueChange(next as unknown as Value)}
      onValueCommitted={(next, details) =>
        handleValueCommitted(next as unknown as Value, details)
      }
      min={min}
      max={max}
      step={step}
      largeStep={largeStep}
      minStepsBetweenValues={minStepsBetweenValues}
      disabled={disabled}
      name={name}
      format={format}
      locale={locale}
      data-slot="value-slider"
      data-variant={variant}
      data-overshoot={elastic.side ?? undefined}
      data-disabled={disabled ? "" : undefined}
      className={cn(
        valueSliderVariants({ size, variant }),
        "group/value-slider data-[disabled]:opacity-50",
        className,
      )}
      style={{ ...flowToneStyle(tone), ...style }}
    >
      {outside ? (
        <div
          data-slot="value-slider-labels"
          className="flex items-baseline justify-between gap-2 px-0.5"
        >
          <span
            data-slot="value-slider-label"
            className="truncate font-medium text-muted-foreground"
          >
            {label}
          </span>
          {showValue ? (
            <span
              data-slot="value-slider-value"
              className="font-mono text-muted-foreground tabular-nums"
            >
              {readout}
            </span>
          ) : null}
        </div>
      ) : null}
      <div className="flex w-full min-w-0 items-center gap-2">
        {startIcon ? (
          <motion.span
            data-slot="value-slider-start-icon"
            aria-hidden="true"
            className="flex shrink-0 items-center text-muted-foreground [&_svg:not([class*='size-'])]:size-4"
            style={{ x: elastic.startIconX, scale: elastic.startIconScale }}
          >
            {startIcon}
          </motion.span>
        ) : null}
        {/* Control 只负责把指针换算成数值，自己不缩放；缩放在它内部的视觉层上。
            slim 的轨道只有几像素高，给 Control 一个 20px 的命中区，视觉层在其中垂直居中 */}
        <SliderPrimitive.Control
          data-slot="value-slider-control"
          className={cn(
            "relative w-full min-w-0 cursor-pointer touch-none select-none in-data-[disabled]:cursor-not-allowed has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50",
            slim && "flex min-h-5 items-center",
          )}
          onPointerDown={elastic.onPointerDown}
        >
          <motion.div
            data-slot="value-slider-rail"
            className="relative w-full origin-center"
            style={{
              x: elastic.x,
              scaleX: elastic.scaleX,
              scaleY: elastic.scaleY,
            }}
          >
            <ValueSliderTrack
              trackRef={trackRef}
              labelRef={labelRef}
              valueRef={valueRef}
              variant={variant}
              outside={outside}
              label={label}
              readout={readout}
              showValue={showValue}
              bufferPercent={bufferPercent}
              hasTone={hasTone}
              ticks={innerTicks}
              min={min}
              max={max}
            />
            {values.map((item, index) => (
              <ValueSliderThumb
                key={index}
                index={index}
                variant={variant}
                near={isNear(valueToPercent(item, min, max))}
                hasTone={hasTone}
                outside={outside}
                label={
                  isRange
                    ? `${thumbName}（${index === 0 ? "起点" : "终点"}）`
                    : thumbName
                }
                valueText={formatNumber(item)}
                onKeyDown={(event) => handleThumbKeyDown(event, index)}
              />
            ))}
          </motion.div>
        </SliderPrimitive.Control>
        {endIcon ? (
          <motion.span
            data-slot="value-slider-end-icon"
            aria-hidden="true"
            className="flex shrink-0 items-center text-muted-foreground [&_svg:not([class*='size-'])]:size-4"
            style={{ x: elastic.endIconX, scale: elastic.endIconScale }}
          >
            {endIcon}
          </motion.span>
        ) : null}
      </div>
    </SliderPrimitive.Root>
  )
}

export {
  ValueSlider,
  ValueSliderTuningContext,
  useValueSliderMuted,
  valueSliderVariants,
}
export type {
  ValueSliderLabelPlacement,
  ValueSliderProps,
  ValueSliderReport,
  ValueSliderSize,
  ValueSliderTuning,
  ValueSliderValue,
  ValueSliderVariant,
} from "./types"
