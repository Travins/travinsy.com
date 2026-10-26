"use client"

import {
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react"
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"

import { cn } from "@/lib/utils"

/** 画布的设计尺寸：最窄的格子（768px 视口）内宽约 207px，留出一点余量后缩放 */
const CANVAS_WIDTH = 216
const CANVAS_HEIGHT = 192
/** 等宽字 10px 下的字符宽度，用来估算光标位置（中文按全角 10px 计） */
const LATIN_ADVANCE = 6
const CJK_ADVANCE = 10

type Clock = {
  /** 当前循环内的时间（秒） */
  time: MotionValue<number>
  duration: number
  /** 从这一刻起动态内容淡出，循环末尾回到起点 */
  exit: number
}

const ClockContext = createContext<Clock | null>(null)

function useClock() {
  const clock = useContext(ClockContext)
  if (!clock) throw new Error("useClock 只能在 DiagramFrame 内使用")
  return clock
}

/**
 * 插画外框：点阵底纹 + 固定设计尺寸的 SVG，并提供统一的时间轴。
 *
 * 所有动画都由同一个 `time` 推导，渲染期间不依赖 Date/随机数，水合结果稳定：
 * - 初始（含服务端渲染、减少动态效果）停在 `rest`，即内容完整、没有光点的一帧；
 * - 进入视口后从 `rest` 继续走完停留→淡出→重新开始，所以不会闪一下；
 * - 离开视口暂停，不占 CPU。
 */
function DiagramFrame({
  duration,
  exit,
  rest,
  children,
}: {
  duration: number
  exit: number
  rest: number
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.4 })
  const reducedMotion = useReducedMotion()
  const time = useMotionValue(rest)
  const playing = inView && !reducedMotion

  useEffect(() => {
    if (reducedMotion) time.set(rest)
  }, [reducedMotion, rest, time])

  useEffect(() => {
    if (!playing) return
    let last = performance.now()
    let frame = requestAnimationFrame(function tick(now) {
      // 切回标签页时间差会很大，截断后动画从原地继续而不是跳一大段
      const delta = Math.min((now - last) / 1000, 0.1)
      last = now
      time.set((time.get() + delta) % duration)
      frame = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(frame)
  }, [playing, duration, time])

  const clock = useMemo(() => ({ time, duration, exit }), [time, duration, exit])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-slot="focus-illustration"
      className="relative flex h-48 items-center justify-center overflow-hidden border-b border-edge"
    >
      {/* 点阵底纹向四周淡出，让图示像摆在图纸上 */}
      <div className="pointer-events-none absolute inset-0 bg-dots [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />
      <svg
        viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        fill="none"
        focusable="false"
        className="relative h-auto max-w-full"
      >
        {/* 整体平移半像素，1px 的线落在像素中心，边缘才清晰 */}
        <g transform="translate(0.5 0.5)">
          <ClockContext.Provider value={clock}>{children}</ClockContext.Provider>
        </g>
      </svg>
    </div>
  )
}

/** 在 `at` 秒淡入（可带上浮），停留到 `exit` 后随循环淡出。 */
function Reveal({
  at,
  rise = 0,
  fade = 0.3,
  children,
}: {
  at: number
  rise?: number
  fade?: number
  children: ReactNode
}) {
  const { time, exit, duration } = useClock()
  const opacity = useTransform(time, [at, at + fade, exit, duration], [0, 1, 1, 0])
  const y = useTransform(time, [at, at + fade], [rise, 0])
  return <motion.g style={{ opacity, y }}>{children}</motion.g>
}

type Box = { x: number; y: number; width: number; height: number; rx: number }

function Lit({ box, at }: { box: Box; at: number }) {
  const { time, exit, duration } = useClock()
  const opacity = useTransform(time, [at, at + 0.25, exit, duration], [0, 1, 1, 0])
  return (
    <motion.g style={{ opacity }}>
      <rect
        {...box}
        strokeWidth={1}
        className="fill-primary/10 stroke-primary"
      />
    </motion.g>
  )
}

/**
 * 细边框小胶囊。`x`、`y` 是中心点；`litAt` 到达时，边框和底色换成主色。
 * `radius` 缺省为高度的一半（胶囊），传小值得到方角的框。
 */
function Node({
  x,
  y,
  width,
  height = 20,
  radius = height / 2,
  litAt,
  children,
}: {
  x: number
  y: number
  width: number
  height?: number
  radius?: number
  litAt?: number
  children?: ReactNode
}) {
  const box: Box = {
    x: x - width / 2,
    y: y - height / 2,
    width,
    height,
    rx: radius,
  }
  return (
    <g>
      <rect
        {...box}
        strokeWidth={1}
        className="fill-background stroke-foreground/30"
      />
      {litAt === undefined ? null : <Lit box={box} at={litAt} />}
      {children}
    </g>
  )
}

/** 流程图里的分叉/汇合点：旋转 45° 的小方块。 */
function Diamond({ x, y, litAt }: { x: number; y: number; litAt?: number }) {
  const box: Box = { x: -4, y: -4, width: 8, height: 8, rx: 1.5 }
  return (
    <g transform={`translate(${x} ${y}) rotate(45)`}>
      <rect
        {...box}
        strokeWidth={1}
        className="fill-background stroke-foreground/30"
      />
      {litAt === undefined ? null : <Lit box={box} at={litAt} />}
    </g>
  )
}

/** 等宽小标签，默认居中；颜色、字号用 className 覆盖。 */
function Label({
  x,
  y,
  anchor = "middle",
  className,
  children,
}: {
  x: number
  y: number
  anchor?: "start" | "middle" | "end"
  className?: string
  children: ReactNode
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      dominantBaseline="central"
      className={cn("fill-foreground font-mono text-[10px]", className)}
    >
      {children}
    </text>
  )
}

/**
 * 逐字打出的文字，后面跟一个主色光标。
 * 已打出的字数由时间推导；`x` 是文字起点（左对齐）。
 */
function TypedText({
  text,
  at,
  interval,
  x,
  y,
}: {
  text: string
  at: number
  /** 每个字的间隔（秒） */
  interval: number
  x: number
  y: number
}) {
  const { time, exit, duration } = useClock()
  const chars = useMemo(() => Array.from(text), [text])
  const typedCount = (value: number) =>
    Math.max(0, Math.min(chars.length, Math.floor((value - at) / interval) + 1))
  const [count, setCount] = useState(() => typedCount(time.get()))
  useMotionValueEvent(time, "change", (value) => setCount(typedCount(value)))

  const typed = chars.slice(0, count)
  const caretX =
    x +
    typed.reduce(
      (width, char) =>
        width + (char.charCodeAt(0) > 0xff ? CJK_ADVANCE : LATIN_ADVANCE),
      0,
    )
  const typingEnd = at + chars.length * interval
  // 打字时常亮，打完后闪几下就收起
  const caretOpacity = useTransform(time, (value) => {
    if (value < at || value > typingEnd + 0.9) return 0
    if (value < typingEnd) return 1
    return Math.floor((value - typingEnd) * 3) % 2 === 0 ? 1 : 0
  })
  const opacity = useTransform(time, [exit, duration], [1, 0])

  return (
    <motion.g style={{ opacity }}>
      <Label x={x} y={y} anchor="start">
        {typed.join("")}
      </Label>
      <motion.g style={{ opacity: caretOpacity }}>
        <rect x={caretX + 1} y={y - 6} width={1} height={12} className="fill-primary" />
      </motion.g>
    </motion.g>
  )
}

export { Diamond, DiagramFrame, Label, Node, Reveal, TypedText, useClock }
