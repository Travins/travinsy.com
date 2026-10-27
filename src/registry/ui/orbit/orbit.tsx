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
import {
  flowToneStyle,
  type FlowTone,
  type FlowToneName,
} from "@/registry/ui/flow-diagram/tone"

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
function useOrbitReducedMotion() {
  return React.useSyncExternalStore(
    subscribeReducedMotion,
    reducedMotionSnapshot,
    serverReducedMotionSnapshot,
  )
}

type OrbitArc = "full" | "half"
/** 画布在外框里的位置：`bottom` 让轨道中心落在外框底边，配合 `arc="half"` 得到贴地的半圆。 */
type OrbitAnchor = "center" | "bottom"

/**
 * 调整用的覆盖项：`Orbit` 子树里所有轨道的对应属性被这里的值替换。
 * 用于调试面板一类的场景；不包 `OrbitTuningContext.Provider` 时组件行为不变。
 */
type OrbitTuning = {
  /** 速度倍率，轨道实际用时为 `duration / speed`。 */
  speed?: number
  /** 为 true 时所有轨道的方向取反。 */
  flip?: boolean
  /** 覆盖根的 `paused`。 */
  paused?: boolean
  /** 覆盖每条轨道的 `dashed`。 */
  dashed?: boolean
  /** 覆盖每条轨道的 `tone`；`false` 表示不上色，沿用主题线条色。 */
  tone?: FlowTone | false
  /** 覆盖根的 `background`。 */
  background?: FlowBackgroundName
  /** 回报示例自己的实际取值（未被覆盖前），面板据此显示当前值。 */
  onReport?: (values: OrbitReport) => void
}

type OrbitReport = {
  paused: boolean
  background: FlowBackgroundName
}

const OrbitTuningContext = React.createContext<OrbitTuning>({})

const OrbitContext = React.createContext<{
  active: boolean
  size: number
  speed: number
  flip: boolean
  dashed?: boolean
  tone?: FlowTone | false
}>({ active: false, size: 320, speed: 1, flip: false })
const OrbitRingContext = React.createContext<{
  angle: MotionValue<number>
} | null>(null)

function Orbit({
  size = 320,
  paused: pausedProp = false,
  background: backgroundProp = "dots",
  anchor = "center",
  label,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  /** 设计画布边长；半径以此为坐标，窄容器内自动缩小。 */
  size?: number
  paused?: boolean
  background?: FlowBackgroundName
  /** 画布位置；`bottom` 把轨道中心放到外框底边，上半部分留在可视区内。@default "center" */
  anchor?: OrbitAnchor
  /** 传入说明后作为图片朗读；默认作为装饰隐藏。内部不应放交互元素。 */
  label?: string
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.2 })
  const reduced = useOrbitReducedMotion()
  const tuning = React.useContext(OrbitTuningContext)
  const { onReport } = tuning
  const paused = tuning.paused ?? pausedProp
  const background = tuning.background ?? backgroundProp
  React.useEffect(() => {
    onReport?.({ paused: pausedProp, background: backgroundProp })
  }, [onReport, pausedProp, backgroundProp])
  return (
    <div
      {...props}
      ref={ref}
      data-slot="orbit"
      data-anchor={anchor}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(
        "relative flex h-72 w-full items-center justify-center overflow-hidden",
        anchor === "bottom" && "items-end",
        className,
      )}
    >
      <div
        data-slot="orbit-background"
        className={cn(
          "pointer-events-none absolute inset-0",
          backgroundClasses[background],
          FADE_MASK,
        )}
      />
      <div
        data-slot="orbit-canvas"
        className={cn(
          "relative aspect-square shrink-0",
          anchor === "bottom" && "translate-y-1/2",
        )}
        style={{ width: `min(100%, ${Math.max(1, size)}px)` }}
      >
        <OrbitContext.Provider
          value={{
            active: inView && !paused && !reduced,
            size: Math.max(1, size),
            speed: Math.max(0.01, tuning.speed ?? 1),
            flip: tuning.flip ?? false,
            dashed: tuning.dashed,
            tone: tuning.tone,
          }}
        >
          {children}
        </OrbitContext.Provider>
      </div>
    </div>
  )
}

function OrbitRing({
  radius = 100,
  duration = 24,
  reverse: reverseProp = false,
  paused = false,
  startAngle = -90,
  arc = "full",
  dashed: dashedProp = false,
  tone: toneProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  radius?: number
  /** 完整转一圈的秒数。 */
  duration?: number
  reverse?: boolean
  paused?: boolean
  /** 起始角度，0 在右侧，正值顺时针。 */
  startAngle?: number
  /** half 只显示上半圆，节点在下半圆时隐藏，边缘渐隐。 */
  arc?: OrbitArc
  dashed?: boolean
  /** 轨道线的色调：内置名或任意 CSS 颜色；不传沿用主题的线条色。节点的颜色由各自的 `tone` 决定。 */
  tone?: FlowTone
}) {
  const { active, size, speed, flip, ...overrides } =
    React.useContext(OrbitContext)
  const reverse = flip ? !reverseProp : reverseProp
  const dashed = overrides.dashed ?? dashedProp
  const tone =
    overrides.tone === false ? undefined : (overrides.tone ?? toneProp)
  const angle = useMotionValue(startAngle)
  const reduced = useOrbitReducedMotion()
  React.useEffect(() => {
    angle.set(startAngle)
  }, [angle, startAngle, reduced])
  React.useEffect(() => {
    if (!active || paused) return
    let last = performance.now()
    let frame = requestAnimationFrame(function tick(now) {
      angle.set(
        angle.get() +
          (((Math.min(now - last, 100) / 1000) * 360) /
            Math.max(0.1, duration / speed)) *
            (reverse ? -1 : 1),
      )
      last = now
      frame = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(frame)
  }, [active, paused, duration, speed, reverse, angle])
  const diameter = ((Math.max(0, radius) * 2) / size) * 100
  return (
    <div
      {...props}
      data-slot="orbit-ring"
      data-arc={arc}
      className={cn(
        "pointer-events-none absolute inset-0",
        arc === "half" &&
          "[mask-image:linear-gradient(to_bottom,black_40%,transparent_52%)]",
        className,
      )}
      style={style}
    >
      <div
        data-slot="orbit-path"
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border",
          tone ? "border-(--flow-tone)/40" : "border-edge",
          dashed && "border-dashed",
        )}
        style={{
          width: `${diameter}%`,
          height: `${diameter}%`,
          ...flowToneStyle(tone),
        }}
      >
        <OrbitRingContext.Provider value={{ angle }}>
          {children}
        </OrbitRingContext.Provider>
      </div>
    </div>
  )
}

function OrbitItem({
  angle: offset = 0,
  tone = "foreground",
  className,
  style,
  ...props
}: React.ComponentProps<"div"> & {
  /** 同一轨道内节点之间的角度偏移。 */
  angle?: number
  tone?: FlowToneName
}) {
  const ring = React.useContext(OrbitRingContext)
  if (!ring) throw new Error("OrbitItem 必须放在 OrbitRing 内")
  const x = useTransform(
    ring.angle,
    (value) =>
      `${(Math.cos(((value + offset) * Math.PI) / 180) * 50).toFixed(3)}%`,
  )
  const y = useTransform(
    ring.angle,
    (value) =>
      `${(Math.sin(((value + offset) * Math.PI) / 180) * 50).toFixed(3)}%`,
  )
  return (
    <motion.div
      data-slot="orbit-item-position"
      className="absolute inset-0 flex items-center justify-center"
      style={{ x, y }}
    >
      <div
        {...props}
        data-slot="orbit-item"
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-lg border border-edge bg-background font-mono text-xs whitespace-nowrap text-(--flow-tone) [&_svg]:size-4",
          className,
        )}
        style={{ ...flowToneStyle(tone), ...style }}
      >
        {props.children}
      </div>
    </motion.div>
  )
}

function OrbitCenter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      data-slot="orbit-center"
      className={cn(
        "absolute top-1/2 left-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center",
        className,
      )}
    />
  )
}

export { Orbit, OrbitRing, OrbitItem, OrbitCenter, OrbitTuningContext }
export type { OrbitAnchor, OrbitArc, OrbitReport, OrbitTuning }
