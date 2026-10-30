"use client"

import * as React from "react"
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "motion/react"
import { cn } from "@/lib/utils"
import {
  backgroundClasses,
  FADE_MASK,
  type FlowBackgroundName,
} from "@/registry/ui/flow-diagram/background"
import { flowToneStyle, type FlowTone } from "@/registry/lib/flow-tone"

// 订阅系统偏好的实时变更，服务端始终使用静帧。
function subscribeReducedMotion(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)")
  media.addEventListener("change", callback)
  return () => media.removeEventListener("change", callback)
}
function reducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}
function serverReducedMotionSnapshot() {
  return true
}
function useRippleReducedMotion() {
  return React.useSyncExternalStore(
    subscribeReducedMotion,
    reducedMotionSnapshot,
    serverReducedMotionSnapshot,
  )
}

type RippleMode = "pulse" | "reach"

/**
 * 调整用的覆盖项：子树里所有 `Ripple` 的对应属性被这里的值替换。
 * 用于调试面板一类的场景；不包 `RippleTuningContext.Provider` 时组件行为不变。
 */
type RippleTuning = {
  rings?: number
  ringGap?: number
  baseSize?: number
  mode?: RippleMode
  duration?: number
  paused?: boolean
  background?: FlowBackgroundName
  /** `false` 表示不上色，沿用主题线条色。 */
  tone?: FlowTone | false
  /** 回报示例自己的实际取值（未被覆盖前），面板据此显示当前值。 */
  onReport?: (values: RippleReport) => void
}

type RippleReport = {
  rings: number
  ringGap: number
  baseSize: number
  mode: RippleMode
  duration: number
  paused: boolean
  background: FlowBackgroundName
  tone: FlowTone | undefined
}

const RippleTuningContext = React.createContext<RippleTuning>({})
const RippleContext = React.createContext({ outerSize: 256, size: 320 })

function Ripple({
  rings: ringsProp = 4,
  ringGap: ringGapProp = 48,
  baseSize: baseSizeProp = 48,
  mode: modeProp = "pulse",
  duration: durationProp = 4,
  paused: pausedProp = false,
  size = 320,
  background: backgroundProp = "dots",
  tone: toneProp,
  label,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  /** 同心环数量，限制为 1–24。 */
  rings?: number
  /** 相邻圆环直径的差值，单位为设计像素。 */
  ringGap?: number
  baseSize?: number
  mode?: RippleMode
  duration?: number
  paused?: boolean
  /** 设计画布边长，容器窄时整体缩小。 */
  size?: number
  background?: FlowBackgroundName
  /**
   * 波纹色调：内置名或任意 CSS 颜色；不传沿用主题的线条色。
   * 同时写入 `--flow-tone`，内部的 `RippleMarker` 可用 `bg-(--flow-tone)` 取同一个颜色。
   */
  tone?: FlowTone
  /** 图示说明；不传时作为装饰隐藏。内部不应放交互元素。 */
  label?: string
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.2 })
  const reduced = useRippleReducedMotion()
  const time = useMotionValue(0)
  const tuning = React.useContext(RippleTuningContext)
  const { onReport } = tuning
  React.useEffect(() => {
    onReport?.({
      rings: ringsProp,
      ringGap: ringGapProp,
      baseSize: baseSizeProp,
      mode: modeProp,
      duration: durationProp,
      paused: pausedProp,
      background: backgroundProp,
      tone: toneProp,
    })
  }, [
    onReport,
    ringsProp,
    ringGapProp,
    baseSizeProp,
    modeProp,
    durationProp,
    pausedProp,
    backgroundProp,
    toneProp,
  ])
  const rings = tuning.rings ?? ringsProp
  const ringGap = tuning.ringGap ?? ringGapProp
  const baseSize = tuning.baseSize ?? baseSizeProp
  const mode = tuning.mode ?? modeProp
  const duration = tuning.duration ?? durationProp
  const paused = tuning.paused ?? pausedProp
  const background = tuning.background ?? backgroundProp
  const tone = tuning.tone === false ? undefined : (tuning.tone ?? toneProp)
  const count = Math.min(24, Math.max(1, Math.floor(rings)))
  const base = Math.max(1, baseSize)
  const gap = Math.max(0, ringGap)
  const canvasSize = Math.max(1, size)
  const outerSize = base + (count - 1) * gap
  React.useEffect(() => {
    if (reduced) time.set(0)
  }, [reduced, time])
  React.useEffect(() => {
    if (paused || reduced || !inView) return
    let last = performance.now()
    let frame = requestAnimationFrame(function tick(now) {
      time.set(
        (time.get() +
          Math.min(now - last, 100) / 1000 / Math.max(0.1, duration)) %
          1,
      )
      last = now
      frame = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(frame)
  }, [paused, reduced, inView, duration, time])
  return (
    <div
      {...props}
      ref={ref}
      data-slot="ripple"
      data-mode={mode}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(
        "relative flex h-72 w-full items-center justify-center overflow-hidden",
        className,
      )}
      style={{ ...flowToneStyle(tone), ...style }}
    >
      <div
        data-slot="ripple-background"
        className={cn(
          "pointer-events-none absolute inset-0",
          backgroundClasses[background],
          FADE_MASK,
        )}
      />
      <div
        data-slot="ripple-canvas"
        className="relative aspect-square shrink-0"
        style={{ width: `min(100%, ${canvasSize}px)` }}
      >
        {Array.from({ length: count }, (_, index) => (
          <RippleWave
            key={index}
            index={index}
            count={count}
            base={base}
            gap={gap}
            size={canvasSize}
            mode={mode}
            toned={tone !== undefined}
            time={time}
          />
        ))}
        <RippleContext.Provider value={{ outerSize, size: canvasSize }}>
          {children}
        </RippleContext.Provider>
      </div>
    </div>
  )
}

function RippleWave({
  index,
  count,
  base,
  gap,
  size,
  mode,
  toned,
  time,
}: {
  index: number
  count: number
  base: number
  gap: number
  size: number
  mode: RippleMode
  toned: boolean
  time: MotionValue<number>
}) {
  const progress = useTransform(
    time,
    (value) => (value + (index + 0.5) / count) % 1,
  )
  const diameter = mode === "pulse" ? base + count * gap : base + index * gap
  const scale = useTransform(progress, (value) =>
    mode === "pulse" ? (base + value * count * gap) / diameter : 1,
  )
  const opacity = useTransform(progress, (value) =>
    mode === "pulse"
      ? Math.sin(value * Math.PI) * 0.75
      : 0.55 + Math.sin(value * Math.PI * 2) * 0.2,
  )
  return (
    <motion.div
      data-slot="ripple-wave"
      aria-hidden
      className={cn(
        "pointer-events-none absolute top-1/2 left-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border",
        toned
          ? "border-(--flow-tone)/50 bg-(--flow-tone)/8"
          : "border-edge bg-primary/2",
      )}
      style={{ width: `${(diameter / size) * 100}%`, scale, opacity }}
    />
  )
}

function RippleMarker({
  angle = 0,
  radius = 1,
  node,
  children,
  className,
  style,
  ...props
}: React.ComponentProps<"div"> & {
  /** 0 在上方，正值顺时针。 */
  angle?: number
  /** 相对最外圈半径的比例，0–1 位于覆盖范围内。 */
  radius?: number
  node?: React.ReactNode
}) {
  const { outerSize, size } = React.useContext(RippleContext)
  const distance = ((Math.max(0, radius) * outerSize) / size) * 50
  const radians = (angle * Math.PI) / 180
  return (
    <div
      {...props}
      data-slot="ripple-marker"
      className={cn(
        "absolute z-10 -translate-x-1/2 -translate-y-1/2",
        className,
      )}
      style={{
        left: `${(50 + Math.sin(radians) * distance).toFixed(3)}%`,
        top: `${(50 - Math.cos(radians) * distance).toFixed(3)}%`,
        ...style,
      }}
    >
      {node ?? children}
    </div>
  )
}

export { Ripple, RippleMarker, RippleTuningContext }
export type { RippleMode, RippleReport, RippleTuning }
