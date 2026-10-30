"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { useControllableState } from "@/registry/hooks/use-controllable-state"
import { flowToneStyle, type FlowTone } from "@/registry/ui/flow-diagram/tone"

type XyPadValue = { x: number; y: number }

type XyPadAxis = {
  /** @default 0 */
  min?: number
  /** @default 100 */
  max?: number
  /** @default 1 */
  step?: number
  /** 轴名：读屏朗读与读数里用，如「朝向」；不传时是 X / Y */
  label?: string
  /** 读数格式；不传时直接显示数字 */
  format?: (value: number) => string
}

type XyPadProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange" | "children"
> & {
  /** 受控值 */
  value?: XyPadValue
  /** 非受控时的初始值；不传时取两轴的中点 */
  defaultValue?: XyPadValue
  onValueChange?: (value: XyPadValue) => void
  /** 拖动松手、键盘每次变更后触发 */
  onValueCommitted?: (value: XyPadValue) => void
  /** 横轴：往右变大 */
  x?: XyPadAxis
  /** 纵轴：往上变大（与屏幕坐标相反，符合「抬高」的直觉） */
  y?: XyPadAxis
  /** 左上角标签，同时作为整组的可访问名称 */
  label?: React.ReactNode
  /**
   * 背景网格每个方向分几格
   * @default 4
   */
  grid?: number
  /** 色调：十字线、手柄与填充取 `--flow-tone`；不传时用前景色 */
  tone?: FlowTone
  /**
   * 标记为「已改动」：标签与读数改用前景色，根元素带 `data-modified`
   * @default false
   */
  modified?: boolean
  disabled?: boolean
  /**
   * 表单字段名：设了就随表单提交两个值。传字符串 `"pos"` 时字段是 `pos.x` 与 `pos.y`，
   * 也可以分别指定 `{ x: "pan", y: "tilt" }`。表单重置时回到 `defaultValue`
   */
  name?: string | { x: string; y: string }
  /** 关联到另一个表单的 id，同 `<input form>` */
  form?: string
}

type ResolvedAxis = Required<Omit<XyPadAxis, "format">> &
  Pick<XyPadAxis, "format">

function resolveAxis(axis: XyPadAxis | undefined, name: string): ResolvedAxis {
  return {
    min: axis?.min ?? 0,
    max: axis?.max ?? 100,
    step: axis?.step ?? 1,
    label: axis?.label ?? name,
    format: axis?.format,
  }
}

function clampStep(value: number, axis: ResolvedAxis) {
  const decimals = (String(axis.step).split(".")[1] ?? "").length
  const clamped = Math.min(axis.max, Math.max(axis.min, value))
  const stepped =
    axis.min + Math.round((clamped - axis.min) / axis.step) * axis.step
  return Number(Math.min(axis.max, stepped).toFixed(decimals))
}

/** 触摸时移动超过这么多像素就不再算「点按」，交给页面滚动 */
const TOUCH_SLOP = 6

const percentOf = (value: number, axis: ResolvedAxis) =>
  ((value - axis.min) / (axis.max - axis.min || 1)) * 100

const show = (value: number, axis: ResolvedAxis) =>
  axis.format ? axis.format(value) : String(value)

/**
 * 二维拖拽板：一块带网格的区域，拖动手柄同时改两个值。
 * 十字线标出当前位置，从左下角到手柄铺一层淡色（与数值滑块的已选填充同一种做法）。
 *
 * 键盘：板内有两个视觉隐藏的原生滑块（横轴、纵轴），聚焦任一个时左右键改横轴、上下键改纵轴，
 * Shift 加大步长十倍；读屏分别朗读两个轴的名称与读数。
 */
function XyPad({
  value: valueProp,
  defaultValue,
  onValueChange,
  onValueCommitted,
  x: xProp,
  y: yProp,
  label,
  grid = 4,
  tone,
  modified = false,
  disabled = false,
  name,
  form,
  className,
  style,
  "aria-label": ariaLabel,
  ...props
}: XyPadProps) {
  const xAxis = resolveAxis(xProp, "X")
  const yAxis = resolveAxis(yProp, "Y")
  const [value, setValue] = useControllableState<XyPadValue>({
    prop: valueProp,
    defaultProp: defaultValue ?? {
      x: clampStep((xAxis.min + xAxis.max) / 2, xAxis),
      y: clampStep((yAxis.min + yAxis.max) / 2, yAxis),
    },
    onChange: onValueChange,
  })

  // 非受控时表单重置回到初始值；reset 事件在表单清空之前触发，等一帧再覆盖
  const initialRef = React.useRef(value)
  const hiddenRef = React.useRef<HTMLInputElement>(null)
  const controlled = valueProp !== undefined
  React.useEffect(() => {
    const element = hiddenRef.current?.form
    if (!element || controlled) return
    const reset = () => window.setTimeout(() => setValue(initialRef.current))
    element.addEventListener("reset", reset)
    return () => element.removeEventListener("reset", reset)
  }, [controlled, setValue])
  const fieldNames =
    name === undefined
      ? null
      : typeof name === "string"
        ? { x: `${name}.x`, y: `${name}.y` }
        : name
  const labelId = React.useId()
  const areaRef = React.useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = React.useState(false)
  // 按在手柄上时记下手指与手柄中心的偏移，拖动时手柄不会先跳到指尖下
  const offsetRef = React.useRef({ x: 0, y: 0 })
  // 触摸按在空白处：先不拖，松手时没怎么动才算点按
  const tapRef = React.useRef<{ id: number; x: number; y: number } | null>(null)
  const hasTone = tone !== undefined

  const update = (next: XyPadValue) => {
    const resolved = {
      x: clampStep(next.x, xAxis),
      y: clampStep(next.y, yAxis),
    }
    if (resolved.x !== value.x || resolved.y !== value.y) setValue(resolved)
    return resolved
  }

  const fromPointer = (event: React.PointerEvent) => {
    const rect = areaRef.current?.getBoundingClientRect()
    if (!rect) return value
    const px = (event.clientX - offsetRef.current.x - rect.left) / rect.width
    const py =
      1 - (event.clientY - offsetRef.current.y - rect.top) / rect.height
    return update({
      x: xAxis.min + px * (xAxis.max - xAxis.min),
      y: yAxis.min + py * (yAxis.max - yAxis.min),
    })
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || event.button !== 0) return
    // 鼠标按下时不让浏览器开始选中旁边的文字
    if (event.pointerType === "mouse") event.preventDefault()
    const thumb = (event.target as Element).closest("[data-slot=xy-pad-handle]")
    // 触摸按在空白处：板子是 touch-action: pan-x pan-y，手指一动就交给页面滚动，
    // 只有原地点一下才把手柄移过去；要拖动得按住手柄（手柄外围有 44px 的触摸区，且 touch-action: none）
    if (event.pointerType === "touch" && !thumb) {
      tapRef.current = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
      }
      return
    }
    if (thumb) {
      const box = thumb.getBoundingClientRect()
      offsetRef.current = {
        x: event.clientX - (box.left + box.width / 2),
        y: event.clientY - (box.top + box.height / 2),
      }
    } else offsetRef.current = { x: 0, y: 0 }
    event.currentTarget.setPointerCapture(event.pointerId)
    setDragging(true)
    fromPointer(event)
    // 把焦点交给横轴的隐藏滑块，接下来可以直接用方向键微调
    areaRef.current?.querySelector<HTMLInputElement>("input")?.focus()
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const tap = tapRef.current
    if (
      tap?.id === event.pointerId &&
      Math.hypot(event.clientX - tap.x, event.clientY - tap.y) > TOUCH_SLOP
    )
      tapRef.current = null
    if (dragging) fromPointer(event)
  }

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const tap = tapRef.current
    if (tap?.id === event.pointerId) {
      tapRef.current = null
      if (event.type === "pointerup") {
        offsetRef.current = { x: 0, y: 0 }
        // 先算再回调，不能写进可选调用里：没传回调时会连 fromPointer 一起短路掉
        const committed = fromPointer(event)
        onValueCommitted?.(committed)
      }
      return
    }
    if (!dragging) return
    setDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    onValueCommitted?.(value)
  }

  /** 两个隐藏滑块共用：左右改横轴、上下改纵轴，原生的「上下也改本轴」被接管 */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const factor = event.shiftKey ? 10 : 1
    let next: XyPadValue | undefined
    if (event.key === "ArrowRight")
      next = { ...value, x: value.x + xAxis.step * factor }
    else if (event.key === "ArrowLeft")
      next = { ...value, x: value.x - xAxis.step * factor }
    else if (event.key === "ArrowUp")
      next = { ...value, y: value.y + yAxis.step * factor }
    else if (event.key === "ArrowDown")
      next = { ...value, y: value.y - yAxis.step * factor }
    if (!next) return
    event.preventDefault()
    // 先算再回调：写成 onValueCommitted?.(update(next)) 时，没传回调会连 update 一起短路掉
    const committed = update(next)
    onValueCommitted?.(committed)
  }

  const left = percentOf(value.x, xAxis)
  const bottom = percentOf(value.y, yAxis)
  const gridSize = `${100 / Math.max(1, grid)}%`

  return (
    <div
      {...props}
      role="group"
      aria-labelledby={label !== undefined ? labelId : undefined}
      aria-label={label === undefined ? ariaLabel : undefined}
      data-slot="xy-pad"
      data-dragging={dragging ? "" : undefined}
      data-modified={modified ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      className={cn(
        "group/xy-pad relative aspect-square w-full min-w-0 overflow-hidden rounded-md border border-edge bg-muted/60 text-xs select-none has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[disabled]:opacity-50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className,
      )}
      style={{ ...flowToneStyle(tone), ...style }}
    >
      <div
        ref={areaRef}
        data-slot="xy-pad-area"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="absolute inset-0 cursor-crosshair touch-pan-x touch-pan-y in-data-[disabled]:cursor-not-allowed"
      >
        {/*
          背景网格：等分的细线，与站点的线条网格同一种颜色。
          平铺时最右一列、最下一行的线正好压在外框上，会让这两条边看起来粗一倍，用 clip-path 裁掉。
        */}
        <span
          aria-hidden="true"
          data-slot="xy-pad-grid"
          className="pointer-events-none absolute inset-0 [clip-path:inset(0_1px_1px_0)]"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--edge) 1px, transparent 1px), linear-gradient(to top, var(--edge) 1px, transparent 1px)",
            backgroundSize: `${gridSize} ${gridSize}`,
            backgroundPosition: "-1px 100%",
          }}
        />
        {/* 从左下角到手柄的淡色填充 */}
        <span
          aria-hidden="true"
          data-slot="xy-pad-fill"
          className={cn(
            "pointer-events-none absolute bottom-0 left-0",
            hasTone
              ? "bg-(--flow-tone)/12 dark:bg-(--flow-tone)/20"
              : "bg-foreground/5 dark:bg-foreground/10",
          )}
          style={{ width: `${left}%`, height: `${bottom}%` }}
        />
        {/* 十字线 */}
        <span
          aria-hidden="true"
          data-slot="xy-pad-crosshair"
          className={cn(
            "pointer-events-none absolute inset-y-0 w-px -translate-x-1/2",
            hasTone ? "bg-(--flow-tone)/50" : "bg-foreground/30",
          )}
          style={{ left: `${left}%` }}
        />
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-0 h-px translate-y-1/2",
            hasTone ? "bg-(--flow-tone)/50" : "bg-foreground/30",
          )}
          style={{ bottom: `${bottom}%` }}
        />
        {/* 手柄：与开关同一种圆形手柄，拖动时轻微放大。外面套一层 44px 的透明触摸区，按住它才能拖 */}
        <span
          aria-hidden="true"
          data-slot="xy-pad-handle"
          className="absolute flex size-11 -translate-x-1/2 translate-y-1/2 cursor-grab touch-none items-center justify-center group-data-[dragging]/xy-pad:cursor-grabbing in-data-[disabled]:cursor-not-allowed"
          style={{ left: `${left}%`, bottom: `${bottom}%` }}
        >
          <span
            data-slot="xy-pad-thumb"
            className={cn(
              "size-3.5 rounded-full border-2 bg-background shadow-sm transition-transform group-data-[dragging]/xy-pad:scale-125 motion-reduce:transition-none pointer-coarse:size-5",
              hasTone ? "border-(--flow-tone)" : "border-foreground",
            )}
          />
        </span>
        {(["x", "y"] as const).map((key) => {
          const axis = key === "x" ? xAxis : yAxis
          return (
            <input
              key={key}
              type="range"
              data-slot={`xy-pad-input-${key}`}
              aria-label={axis.label}
              aria-valuetext={show(value[key], axis)}
              min={axis.min}
              max={axis.max}
              step={axis.step}
              value={value[key]}
              disabled={disabled}
              onKeyDown={handleKeyDown}
              onChange={(event) =>
                update({ ...value, [key]: Number(event.target.value) })
              }
              className="sr-only"
            />
          )
        })}
      </div>
      {label !== undefined ? (
        <span
          id={labelId}
          data-slot="xy-pad-label"
          className="pointer-events-none absolute top-2 left-2.5 font-medium text-muted-foreground transition-colors group-data-[modified]/xy-pad:text-foreground"
        >
          {label}
        </span>
      ) : null}
      <span
        aria-hidden="true"
        data-slot="xy-pad-value"
        className="pointer-events-none absolute right-2.5 bottom-2 font-mono text-muted-foreground tabular-nums transition-colors group-hover/xy-pad:text-foreground group-data-[dragging]/xy-pad:text-foreground group-data-[modified]/xy-pad:text-foreground"
      >
        {show(value.x, xAxis)} · {show(value.y, yAxis)}
      </span>
      {fieldNames &&
        (["x", "y"] as const).map((key) => (
          <input
            key={key}
            ref={key === "x" ? hiddenRef : undefined}
            type="hidden"
            data-slot={`xy-pad-field-${key}`}
            name={fieldNames[key]}
            form={form}
            value={value[key]}
            disabled={disabled}
          />
        ))}
    </div>
  )
}

export { XyPad }
export type { XyPadAxis, XyPadProps, XyPadValue }
