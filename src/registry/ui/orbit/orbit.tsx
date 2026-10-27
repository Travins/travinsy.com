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
const OrbitContext = React.createContext({ active: false, size: 320 })
const OrbitRingContext = React.createContext<{
  angle: MotionValue<number>
} | null>(null)

function Orbit({
  size = 320,
  paused = false,
  background = "dots",
  label,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  /** 设计画布边长；半径以此为坐标，窄容器内自动缩小。 */
  size?: number
  paused?: boolean
  background?: FlowBackgroundName
  /** 传入说明后作为图片朗读；默认作为装饰隐藏。内部不应放交互元素。 */
  label?: string
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.2 })
  const reduced = useOrbitReducedMotion()
  return (
    <div
      {...props}
      ref={ref}
      data-slot="orbit"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(
        "relative flex h-72 w-full items-center justify-center overflow-hidden",
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
        className="relative aspect-square shrink-0"
        style={{ width: `min(100%, ${Math.max(1, size)}px)` }}
      >
        <OrbitContext.Provider
          value={{
            active: inView && !paused && !reduced,
            size: Math.max(1, size),
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
  reverse = false,
  paused = false,
  startAngle = -90,
  arc = "full",
  dashed = false,
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
}) {
  const { active, size } = React.useContext(OrbitContext)
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
            Math.max(0.1, duration)) *
            (reverse ? -1 : 1),
      )
      last = now
      frame = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(frame)
  }, [active, paused, duration, reverse, angle])
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
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-edge",
          dashed && "border-dashed",
        )}
        style={{ width: `${diameter}%`, height: `${diameter}%` }}
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

export { Orbit, OrbitRing, OrbitItem, OrbitCenter }
export type { OrbitArc }
