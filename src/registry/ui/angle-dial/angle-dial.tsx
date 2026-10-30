"use client"

import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { useControllableState } from "@/registry/hooks/use-controllable-state"
import { flowToneStyle, type FlowTone } from "@/registry/ui/flow-diagram/tone"

/**
 * 角度刻度尺：方条中间是一段可以左右拖动的刻度，固定在正中的竖线指针读出当前角度。
 * 外框与高度表与数值滑块一致（bar 28 / 32 / 36px，compact 18 / 22 / 24px），放进同一个面板能对齐。
 */
/** 触摸时横向移动超过这么多像素才算拖动，先往上下走的交给页面滚动 */
const TOUCH_SLOP = 6

const angleDialVariants = cva(
  "group/angle-dial relative flex h-(--angle-dial-height) w-full min-w-0 items-center gap-3 overflow-hidden rounded-md border border-edge bg-muted/60 px-3 select-none aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-sm",
      },
      variant: {
        bar: "",
        compact: "gap-2 px-2.5 text-xs",
      },
    },
    compoundVariants: [
      {
        variant: "bar",
        size: "sm",
        class:
          "[--angle-dial-height:1.75rem] pointer-coarse:[--angle-dial-height:2.25rem]",
      },
      {
        variant: "bar",
        size: "default",
        class:
          "[--angle-dial-height:2rem] pointer-coarse:[--angle-dial-height:2.5rem]",
      },
      {
        variant: "bar",
        size: "lg",
        class:
          "[--angle-dial-height:2.25rem] pointer-coarse:[--angle-dial-height:2.75rem]",
      },
      {
        variant: "compact",
        size: "sm",
        class: "[--angle-dial-height:1.125rem]",
      },
      {
        variant: "compact",
        size: "default",
        class: "[--angle-dial-height:1.375rem]",
      },
      { variant: "compact", size: "lg", class: "[--angle-dial-height:1.5rem]" },
    ],
    defaultVariants: {
      size: "default",
      variant: "bar",
    },
  },
)

type AngleDialSize = "sm" | "default" | "lg"
type AngleDialVariant = "bar" | "compact"

type AngleDialProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange" | "children"
> & {
  /** 受控值（度） */
  value?: number
  /** 非受控时的初始值；双击刻度尺时也回到它。不传时取 0（不在范围内则取 `min`） */
  defaultValue?: number
  onValueChange?: (value: number) => void
  /** 拖动松手、键盘每次变更、双击复位后触发 */
  onValueCommitted?: (value: number) => void
  /**
   * 最小值
   * @default -180
   */
  min?: number
  /**
   * 最大值
   * @default 180
   */
  max?: number
  /**
   * 步长
   * @default 1
   */
  step?: number
  /**
   * PageUp / PageDown 与 Shift + 方向键的步长
   * @default 15
   */
  largeStep?: number
  /**
   * 首尾相接：越过一端从另一端接着走。不传时，范围正好一整圈（360°）就自动开启
   */
  wrap?: boolean
  /**
   * 拖动灵敏度：每度对应的像素数，越大越细
   * @default 3
   */
  pixelsPerDegree?: number
  /** 左侧标签，同时作为可访问名称 */
  label?: React.ReactNode
  /** 读数格式；默认 `数值°`，读屏朗读的也是它 */
  formatValue?: (value: number) => string
  /**
   * 高度档：`bar` 与数值滑块默认同高，`compact` 是面板里用的中等高度
   * @default "bar"
   */
  variant?: AngleDialVariant
  /**
   * 尺寸档
   * @default "default"
   */
  size?: AngleDialSize
  /** 色调：指针与小表盘取 `--flow-tone`；不传时用前景色 */
  tone?: FlowTone
  /**
   * 标记为「已改动」：标签与读数改用前景色，根元素带 `data-modified`
   * @default false
   */
  modified?: boolean
  disabled?: boolean
  /** 表单字段名：设了就随表单提交当前角度（数字字符串），表单重置时回到 `defaultValue` */
  name?: string
  /** 关联到另一个表单的 id，同 `<input form>` */
  form?: string
}

/** 小刻度的间隔（度）与每隔几个小刻度画一根大刻度 */
const MINOR = 5
const MAJOR_EVERY = 3

const defaultFormat = (value: number) => `${value}°`

/** 把值约束进范围：首尾相接时取模，否则夹住；再对齐到步长 */
function normalize(
  value: number,
  {
    min,
    max,
    step,
    wrap,
  }: { min: number; max: number; step: number; wrap: boolean },
) {
  let next = value
  if (wrap) {
    const span = max - min
    next = ((((next - min) % span) + span) % span) + min
  } else {
    next = Math.min(max, Math.max(min, next))
  }
  const decimals = (String(step).split(".")[1] ?? "").length
  const stepped = min + Math.round((next - min) / step) * step
  // 首尾相接时 max 与 min 是同一个角度，统一显示成 min
  const result = wrap && stepped >= max ? min : stepped
  return Number(result.toFixed(decimals))
}

/**
 * 角度刻度尺。拖动刻度（不是拖指针）改变角度：手指往左带走刻度，指针就读到更大的角度。
 * 键盘：方向键按 `step`、Shift / PageUp / PageDown 按 `largeStep`、Home / End 到两端；双击复位。
 */
function AngleDial({
  value: valueProp,
  defaultValue,
  onValueChange,
  onValueCommitted,
  min = -180,
  max = 180,
  step = 1,
  largeStep = 15,
  wrap: wrapProp,
  pixelsPerDegree = 3,
  label,
  formatValue = defaultFormat,
  variant = "bar",
  size = "default",
  tone,
  modified = false,
  disabled = false,
  name,
  form,
  className,
  style,
  "aria-label": ariaLabel,
  ...props
}: AngleDialProps) {
  const wrap = wrapProp ?? max - min === 360
  const options = { min, max, step, wrap }
  const resetValue = defaultValue ?? (0 >= min && 0 <= max ? 0 : min)
  const [value, setValue] = useControllableState<number>({
    prop: valueProp,
    defaultProp: resetValue,
    onChange: onValueChange,
  })

  // 非受控时表单重置回到初始值；reset 事件在表单清空之前触发，等一帧再覆盖
  const hiddenRef = React.useRef<HTMLInputElement>(null)
  const controlled = valueProp !== undefined
  React.useEffect(() => {
    const element = hiddenRef.current?.form
    if (!element || controlled) return
    const reset = () => window.setTimeout(() => setValue(resetValue))
    element.addEventListener("reset", reset)
    return () => element.removeEventListener("reset", reset)
  }, [controlled, resetValue, setValue])
  const labelId = React.useId()
  const [dragging, setDragging] = React.useState(false)
  // pending：触摸刚按下、还没看出是横向拖动还是上下滚动页面
  const dragRef = React.useRef<{
    x: number
    y: number
    from: number
    pending: boolean
  } | null>(null)

  const commit = (next: number) => {
    const normalized = normalize(next, options)
    if (normalized !== value) setValue(normalized)
    return normalized
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || event.button !== 0) return
    // 鼠标按下不抢走文字选区之外的焦点样式；触摸与笔照常
    if (event.pointerType === "mouse") event.preventDefault()
    event.currentTarget.focus({ preventScroll: true })
    const touch = event.pointerType === "touch"
    dragRef.current = {
      x: event.clientX,
      y: event.clientY,
      from: value,
      pending: touch,
    }
    // 触摸先不接管：轨道是 touch-action: pan-y，上下滑由浏览器滚动页面，横向移动过阈值才开始拖
    if (touch) return
    event.currentTarget.setPointerCapture(event.pointerId)
    setDragging(true)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag) return
    if (drag.pending) {
      const dx = Math.abs(event.clientX - drag.x)
      const dy = Math.abs(event.clientY - drag.y)
      if (dx < TOUCH_SLOP && dy < TOUCH_SLOP) return
      if (dy >= dx) {
        dragRef.current = null
        return
      }
      // 从这里起算，过阈值的那几像素不计入，转盘不会突然跳一下
      drag.pending = false
      drag.x = event.clientX
      event.currentTarget.setPointerCapture(event.pointerId)
      setDragging(true)
      return
    }
    commit(drag.from - (event.clientX - drag.x) / pixelsPerDegree)
  }

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag) return
    dragRef.current = null
    // 只是点了一下，或者被浏览器拿去滚动页面了：值没动，不算一次提交
    if (drag.pending) return
    setDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    onValueCommitted?.(value)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return
    const big = event.shiftKey ? largeStep : step
    let next: number | undefined
    if (event.key === "ArrowRight" || event.key === "ArrowUp")
      next = value + big
    else if (event.key === "ArrowLeft" || event.key === "ArrowDown")
      next = value - big
    else if (event.key === "PageUp") next = value + largeStep
    else if (event.key === "PageDown") next = value - largeStep
    else if (event.key === "Home") next = min
    else if (event.key === "End") next = wrap ? max - step : max
    if (next === undefined) return
    event.preventDefault()
    // 先算再回调：写成 onValueCommitted?.(commit(next)) 时，没传回调会连 commit 一起短路掉
    const committed = commit(next)
    onValueCommitted?.(committed)
  }

  const handleDoubleClick = () => {
    if (disabled) return
    const committed = commit(resetValue)
    onValueCommitted?.(committed)
  }

  const readout = formatValue(value)
  // 刻度跟着值平移：值每增加 1°，刻度往左移 pixelsPerDegree 像素
  const minorGap = MINOR * pixelsPerDegree
  const offset = `calc(50% - ${(value * pixelsPerDegree).toFixed(2)}px)`

  return (
    <div
      {...props}
      data-slot="angle-dial"
      data-variant={variant}
      data-dragging={dragging ? "" : undefined}
      data-modified={modified ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      className={cn(
        angleDialVariants({ size, variant }),
        "data-[disabled]:opacity-50",
        className,
      )}
      style={{ ...flowToneStyle(tone), ...style }}
    >
      {label !== undefined ? (
        <span
          id={labelId}
          data-slot="angle-dial-label"
          className="shrink-0 truncate font-medium text-muted-foreground transition-colors group-data-[modified]/angle-dial:text-foreground"
        >
          {label}
        </span>
      ) : null}
      <div
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-labelledby={label !== undefined ? labelId : undefined}
        aria-label={label === undefined ? (ariaLabel ?? "角度") : undefined}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={readout}
        aria-disabled={disabled || undefined}
        data-slot="angle-dial-ruler"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={handleKeyDown}
        onDoubleClick={handleDoubleClick}
        className="relative h-full min-w-0 flex-1 cursor-ew-resize touch-pan-y rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 in-data-[disabled]:cursor-not-allowed"
      >
        {/* 刻度：两层重复渐变，小刻度每 5°、大刻度每 15°；两端渐隐，像一段从窗口里露出来的转盘 */}
        <span
          aria-hidden="true"
          data-slot="angle-dial-ticks"
          className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_right,transparent,var(--foreground)_22%,var(--foreground)_78%,transparent)]"
          style={{
            backgroundImage: [
              "linear-gradient(to right, color-mix(in oklab, var(--foreground) 45%, transparent) 1px, transparent 1px)",
              "linear-gradient(to right, color-mix(in oklab, var(--foreground) 22%, transparent) 1px, transparent 1px)",
            ].join(", "),
            backgroundSize: `${minorGap * MAJOR_EVERY}px 60%, ${minorGap}px 34%`,
            backgroundPosition: `${offset} center, ${offset} center`,
            backgroundRepeat: "repeat-x",
          }}
        />
        {/* 指针：固定在正中的竖线，与数值滑块的手柄同形 */}
        <span
          aria-hidden="true"
          data-slot="angle-dial-needle"
          className={cn(
            "pointer-events-none absolute inset-y-[18%] left-1/2 w-1 -translate-x-1/2 rounded-full transition-transform group-data-[dragging]/angle-dial:scale-y-110 motion-reduce:transition-none",
            tone !== undefined ? "bg-(--flow-tone)" : "bg-foreground",
          )}
        />
      </div>
      <span
        aria-hidden="true"
        data-slot="angle-dial-value"
        className="flex shrink-0 items-center gap-1.5 font-mono text-muted-foreground tabular-nums transition-colors group-hover/angle-dial:text-foreground group-data-[dragging]/angle-dial:text-foreground group-data-[modified]/angle-dial:text-foreground"
      >
        {readout}
        {/* 小表盘：指针随角度转，帮助读出方向 */}
        <svg
          viewBox="0 0 16 16"
          data-slot="angle-dial-glyph"
          className="size-3.5 shrink-0"
        >
          <circle
            cx="8"
            cy="8"
            r="6.5"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.4"
          />
          <line
            x1="8"
            y1="8"
            x2="8"
            y2="2.5"
            strokeWidth="1.6"
            strokeLinecap="round"
            className={
              tone !== undefined ? "stroke-(--flow-tone)" : "stroke-current"
            }
            transform={`rotate(${value.toFixed(2)} 8 8)`}
          />
        </svg>
      </span>
      {name !== undefined && (
        <input
          ref={hiddenRef}
          type="hidden"
          data-slot="angle-dial-field"
          name={name}
          form={form}
          value={value}
          disabled={disabled}
        />
      )}
    </div>
  )
}

export { AngleDial, angleDialVariants }
export type { AngleDialProps, AngleDialSize, AngleDialVariant }
