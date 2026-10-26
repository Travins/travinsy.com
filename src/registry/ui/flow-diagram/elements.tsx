"use client"

import { motion, useMotionValueEvent, useTransform } from "motion/react"
import { useMemo, useState, type ReactNode } from "react"

import { cn } from "@/lib/utils"

import type { FlowRoute } from "./route"
import { useFlowClock } from "./flow-clock"
import { toneClasses, type FlowTone } from "./tone"

/** 等宽字 10px 下的字符宽度，用来估算光标位置（中文按全角 10px 计） */
const LATIN_ADVANCE = 6
const CJK_ADVANCE = 10

type Box = { x: number; y: number; width: number; height: number; rx: number }

/** 在 `at` 秒淡入（可带上浮），停留到 `exit` 后随循环淡出。 */
function FlowReveal({
  at,
  rise = 0,
  fade = 0.3,
  children,
}: {
  /** 开始淡入的时刻（秒） */
  at: number
  /**
   * 淡入时从下方上浮的距离（设计尺寸中的像素）
   * @default 0
   */
  rise?: number
  /**
   * 淡入用时（秒）
   * @default 0.3
   */
  fade?: number
  children: ReactNode
}) {
  const { time, exit, duration } = useFlowClock()
  const opacity = useTransform(
    time,
    [at, at + fade, exit, duration],
    [0, 1, 1, 0],
  )
  const y = useTransform(time, [at, at + fade], [rise, 0])
  return (
    <motion.g data-slot="flow-reveal" style={{ opacity, y }}>
      {children}
    </motion.g>
  )
}

/** 节点被光点点亮后的状态层：主色（或警示色）描边加淡底色。 */
function Lit({ box, at, tone }: { box: Box; at: number; tone: FlowTone }) {
  const { time, exit, duration } = useFlowClock()
  const opacity = useTransform(
    time,
    [at, at + 0.25, exit, duration],
    [0, 1, 1, 0],
  )
  return (
    <motion.g style={{ opacity }}>
      <rect {...box} strokeWidth={1} className={toneClasses[tone].lit} />
    </motion.g>
  )
}

/**
 * 细边框小胶囊。`x`、`y` 是中心点；`litAt` 到达时，边框和底色换成主色。
 * 内部文字、图标请作为 `children` 传入，用 `FlowLabel` 等原语按绝对坐标摆放。
 */
function FlowNode({
  x,
  y,
  width,
  height = 20,
  radius = height / 2,
  litAt,
  litTone = "primary",
  children,
}: {
  /** 中心点的横坐标 */
  x: number
  /** 中心点的纵坐标 */
  y: number
  width: number
  /**
   * 节点高度
   * @default 20
   */
  height?: number
  /**
   * 圆角半径，缺省为高度的一半（胶囊），传小值得到方角的框
   */
  radius?: number
  /** 被点亮的时刻（秒），不传则不点亮 */
  litAt?: number
  /**
   * 点亮后的颜色
   * @default "primary"
   */
  litTone?: FlowTone
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
    <g data-slot="flow-node">
      <rect
        {...box}
        strokeWidth={1}
        className="fill-background stroke-foreground/30"
      />
      {litAt === undefined ? null : <Lit box={box} at={litAt} tone={litTone} />}
      {children}
    </g>
  )
}

/** 流程图里的分叉 / 汇合点：旋转 45° 的小方块。 */
function FlowDiamond({
  x,
  y,
  litAt,
  litTone = "primary",
}: {
  /** 中心点的横坐标 */
  x: number
  /** 中心点的纵坐标 */
  y: number
  /** 被点亮的时刻（秒），不传则不点亮 */
  litAt?: number
  /**
   * 点亮后的颜色
   * @default "primary"
   */
  litTone?: FlowTone
}) {
  const box: Box = { x: -4, y: -4, width: 8, height: 8, rx: 1.5 }
  return (
    <g data-slot="flow-diamond" transform={`translate(${x} ${y}) rotate(45)`}>
      <rect
        {...box}
        strokeWidth={1}
        className="fill-background stroke-foreground/30"
      />
      {litAt === undefined ? null : <Lit box={box} at={litAt} tone={litTone} />}
    </g>
  )
}

/** 等宽小标签，默认居中；颜色、字号用 `className` 覆盖。 */
function FlowLabel({
  x,
  y,
  anchor = "middle",
  className,
  children,
}: {
  /** 锚点的横坐标 */
  x: number
  /** 文字垂直中线的纵坐标 */
  y: number
  /**
   * 文字相对 `x` 的对齐方式
   * @default "middle"
   */
  anchor?: "start" | "middle" | "end"
  className?: string
  children: ReactNode
}) {
  return (
    <text
      data-slot="flow-label"
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
 * 已打出的字数由时间推导，不依赖定时器；`x` 是文字起点（左对齐）。
 */
function FlowTypedText({
  text,
  at,
  interval,
  x,
  y,
}: {
  text: string
  /** 开始打第一个字的时刻（秒） */
  at: number
  /** 每个字的间隔（秒） */
  interval: number
  /** 文字起点（左对齐）的横坐标 */
  x: number
  /** 文字垂直中线的纵坐标 */
  y: number
}) {
  const { time, exit, duration } = useFlowClock()
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
    <motion.g data-slot="flow-typed-text" style={{ opacity }}>
      <FlowLabel x={x} y={y} anchor="start">
        {typed.join("")}
      </FlowLabel>
      <motion.g style={{ opacity: caretOpacity }}>
        <rect
          x={caretX + 1}
          y={y - 6}
          width={1}
          height={12}
          className="fill-primary"
        />
      </motion.g>
    </motion.g>
  )
}

/** 不带光点的静态连线，用来画背景关系、备用路径；可选在 `at` 淡入。 */
function FlowEdge({
  route: { d },
  at,
  dashed = false,
}: {
  /** 由 `flowRoute` 生成的路径 */
  route: FlowRoute
  /** 淡入的时刻（秒），不传则一直显示 */
  at?: number
  /**
   * 是否画成虚线，表示可选或备用的路径
   * @default false
   */
  dashed?: boolean
}) {
  const line = (
    <path
      data-slot="flow-edge"
      d={d}
      strokeWidth={1}
      strokeDasharray={dashed ? "3 3" : undefined}
      className="stroke-foreground/20"
    />
  )
  return at === undefined ? line : <FlowReveal at={at}>{line}</FlowReveal>
}

/** 旋转的加载圈，只在 `at` 到 `until` 之间显示。`x`、`y` 是中心点。 */
function FlowSpinner({
  x,
  y,
  at,
  until,
  size = 12,
  tone = "primary",
}: {
  /** 中心点的横坐标 */
  x: number
  /** 中心点的纵坐标 */
  y: number
  /** 开始显示的时刻（秒） */
  at: number
  /** 消失的时刻（秒），不传则停留到本轮淡出 */
  until?: number
  /**
   * 外径（设计尺寸中的像素）
   * @default 12
   */
  size?: number
  /**
   * 圆环颜色
   * @default "primary"
   */
  tone?: FlowTone
}) {
  const { time, exit, duration } = useFlowClock()
  const end = until ?? exit
  const opacity = useTransform(
    time,
    [at, at + 0.15, end, end + 0.2, duration],
    [0, 1, 1, 0, 0],
  )
  const rotate = useTransform(time, (value) => value * 540)
  const radius = size / 2 - 1
  const circumference = 2 * Math.PI * radius
  return (
    <motion.g data-slot="flow-spinner" style={{ opacity }}>
      <motion.g
        style={{ rotate, transformBox: "fill-box", transformOrigin: "center" }}
      >
        <circle
          cx={x}
          cy={y}
          r={radius}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeDasharray={`${circumference * 0.7} ${circumference}`}
          className={toneClasses[tone].stroke}
        />
      </motion.g>
    </motion.g>
  )
}

/** 状态点：到 `at` 时淡入；`pulse` 打开后向外扩散一圈圈涟漪。 */
function FlowStatusDot({
  x,
  y,
  at,
  radius = 2,
  tone = "primary",
  pulse = false,
}: {
  /** 圆心的横坐标 */
  x: number
  /** 圆心的纵坐标 */
  y: number
  /** 淡入的时刻（秒），不传则一直显示 */
  at?: number
  /**
   * 半径（设计尺寸中的像素）
   * @default 2
   */
  radius?: number
  /**
   * 点的颜色
   * @default "primary"
   */
  tone?: FlowTone
  /**
   * 是否向外扩散涟漪，表示服务在运行
   * @default false
   */
  pulse?: boolean
}) {
  const dot = (
    <g data-slot="flow-status-dot">
      <circle cx={x} cy={y} r={radius} className={toneClasses[tone].fill} />
      {pulse ? (
        <Ripple x={x} y={y} radius={radius} at={at ?? 0} tone={tone} />
      ) : null}
    </g>
  )
  return at === undefined ? dot : <FlowReveal at={at}>{dot}</FlowReveal>
}

/** 每 1.6 秒一圈的涟漪，相位由时间推导。 */
function Ripple({
  x,
  y,
  radius,
  at,
  tone,
}: {
  x: number
  y: number
  radius: number
  at: number
  tone: FlowTone
}) {
  const { time } = useFlowClock()
  const phase = useTransform(time, (value) =>
    value < at ? 1 : ((value - at) % 1.6) / 1.6,
  )
  const r = useTransform(phase, [0, 1], [radius, radius * 3.2])
  const opacity = useTransform(phase, [0, 1], [0.5, 0])
  return (
    <motion.circle
      cx={x}
      cy={y}
      r={r}
      strokeWidth={1}
      className={cn("fill-none", toneClasses[tone].stroke)}
      style={{ opacity }}
    />
  )
}

export {
  FlowDiamond,
  FlowEdge,
  FlowLabel,
  FlowNode,
  FlowReveal,
  FlowSpinner,
  FlowStatusDot,
  FlowTypedText,
}
