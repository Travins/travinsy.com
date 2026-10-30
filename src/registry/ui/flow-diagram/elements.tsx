"use client"

import { motion, useMotionValueEvent, useTransform } from "motion/react"
import {
  useMemo,
  useState,
  type ComponentType,
  type ReactNode,
  type SVGProps,
} from "react"

import { cn } from "@/lib/utils"

import { FlowLineDraw, FlowLineFlow } from "./beam"
import { FLOW_BEAM_SPEED, flowTextWidth, type FlowRoute } from "./route"
import { useFlowClock } from "./flow-clock"
import {
  flowToneStyle,
  toneClasses,
  type FlowTone,
} from "@/registry/lib/flow-tone"

/** 节点里图标的边长，以及图标与文字之间的间距（设计像素） */
const ICON_SIZE = 12
const ICON_GAP = 4

/** 节点圆角：`pill` 是两头全圆的胶囊，`box` 是小圆角矩形 */
type FlowNodeShape = "pill" | "box"
const BOX_RADIUS = 5

/** 节点里的图标：任何接受 `x`、`y`、`width`、`height` 的 SVG 组件，例如 lucide 图标 */
type FlowIcon = ComponentType<SVGProps<SVGSVGElement>>

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

/** 节点被光点点亮后的状态层：色调描边加淡底色，颜色取外层的 `--flow-tone`。 */
function Lit({ box, at }: { box: Box; at: number }) {
  const { time, exit, duration } = useFlowClock()
  const opacity = useTransform(
    time,
    [at, at + 0.25, exit, duration],
    [0, 1, 1, 0],
  )
  return (
    <motion.g style={{ opacity }}>
      <rect {...box} strokeWidth={1} className={toneClasses.lit} />
    </motion.g>
  )
}

/**
 * 细边框节点。`x`、`y` 是中心点；`litAt` 到达时，边框和底色换成 `tone` 的颜色。
 * 常见的“图标 + 文字”可以直接用 `icon`、`label`、`description`；
 * 更复杂的内容请作为 `children` 传入，用 `FlowLabel` 等原语按绝对坐标摆放。
 */
function FlowNode({
  x,
  y,
  width,
  height = 20,
  shape = "pill",
  radius = shape === "box" ? BOX_RADIUS : height / 2,
  tone,
  litAt,
  icon: Icon,
  label,
  description,
  children,
}: {
  /** 中心点的横坐标 */
  x: number
  /** 中心点的纵坐标 */
  y: number
  width: number
  /**
   * 节点高度，带 `description` 的两行节点建议 30 以上
   * @default 20
   */
  height?: number
  /**
   * 外形：`pill` 两头全圆的胶囊，`box` 小圆角矩形
   * @default "pill"
   */
  shape?: FlowNodeShape
  /**
   * 圆角半径，覆盖 `shape` 的默认值
   * @default shape 为 "pill" 时是 height / 2，为 "box" 时是 5
   */
  radius?: number
  /**
   * 点亮后的色调，同时也是节点内部没有指定色调的状态点、加载圈、光标的颜色；
   * 指定后图标也会染成这个颜色
   * @default 沿用 FlowDiagram 的 tone（"primary"）
   */
  tone?: FlowTone
  /** 被点亮的时刻（秒），不传则不点亮 */
  litAt?: number
  /** 放在文字左侧的图标，例如 lucide 的 `Database` */
  icon?: FlowIcon
  /** 节点里的文字。有图标时图标 + 文字整体居中 */
  label?: string
  /** 文字下方的第二行小字，muted 色 */
  description?: string
  children?: ReactNode
}) {
  const box: Box = {
    x: x - width / 2,
    y: y - height / 2,
    width,
    height,
    rx: radius,
  }
  const labelY = description ? y - 6 : y
  // 图标 + 文字整体居中：先估算文字宽度，再从总宽度的左端开始排
  const labelWidth = label ? flowTextWidth(label) : 0
  const rowWidth = Icon
    ? ICON_SIZE + (label ? ICON_GAP + labelWidth : 0)
    : labelWidth
  const rowLeft = x - rowWidth / 2
  return (
    <g data-slot="flow-node" style={flowToneStyle(tone)}>
      <rect
        {...box}
        strokeWidth={1}
        className="fill-background stroke-foreground/30"
      />
      {litAt === undefined ? null : <Lit box={box} at={litAt} />}
      {Icon ? (
        <Icon
          x={rowLeft}
          y={labelY - ICON_SIZE / 2}
          width={ICON_SIZE}
          height={ICON_SIZE}
          strokeWidth={1.5}
          aria-hidden="true"
          className={
            tone !== undefined ? "text-(--flow-tone)" : "text-muted-foreground"
          }
        />
      ) : null}
      {label ? (
        <FlowLabel
          x={Icon ? rowLeft + ICON_SIZE + ICON_GAP : x}
          y={labelY}
          anchor={Icon ? "start" : "middle"}
        >
          {label}
        </FlowLabel>
      ) : null}
      {description ? (
        <FlowLabel x={x} y={y + 7} className="fill-muted-foreground text-[9px]">
          {description}
        </FlowLabel>
      ) : null}
      {children}
    </g>
  )
}

/** 流程图里的分叉 / 汇合点：旋转 45° 的小方块。 */
function FlowDiamond({
  x,
  y,
  tone,
  litAt,
}: {
  /** 中心点的横坐标 */
  x: number
  /** 中心点的纵坐标 */
  y: number
  /**
   * 点亮后的色调
   * @default 沿用 FlowDiagram 的 tone（"primary"）
   */
  tone?: FlowTone
  /** 被点亮的时刻（秒），不传则不点亮 */
  litAt?: number
}) {
  const box: Box = { x: -4, y: -4, width: 8, height: 8, rx: 1.5 }
  return (
    <g
      data-slot="flow-diamond"
      transform={`translate(${x} ${y}) rotate(45)`}
      style={flowToneStyle(tone)}
    >
      <rect
        {...box}
        strokeWidth={1}
        className="fill-background stroke-foreground/30"
      />
      {litAt === undefined ? null : <Lit box={box} at={litAt} />}
    </g>
  )
}

/** 等宽小标签，默认居中；字号用 `className` 覆盖，颜色用 `tone` 或 `className`。 */
function FlowLabel({
  x,
  y,
  anchor = "middle",
  tone,
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
  /**
   * 文字色调。不传则是前景色；注意 SVG 文字用 `fill-*` 而不是 `text-*` 着色
   */
  tone?: FlowTone
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
      style={flowToneStyle(tone)}
      className={cn(
        "font-mono text-[10px]",
        tone !== undefined ? toneClasses.fill : "fill-foreground",
        className,
      )}
    >
      {children}
    </text>
  )
}

/**
 * 逐字打出的文字，后面跟一个光标。
 * 已打出的字数由时间推导，不依赖定时器；`x` 是文字起点（左对齐）。
 */
function FlowTypedText({
  text,
  at,
  interval,
  x,
  y,
  tone,
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
  /**
   * 光标的色调
   * @default 沿用 FlowDiagram 的 tone（"primary"）
   */
  tone?: FlowTone
}) {
  const { time, exit, duration } = useFlowClock()
  const chars = useMemo(() => Array.from(text), [text])
  const typedCount = (value: number) =>
    Math.max(0, Math.min(chars.length, Math.floor((value - at) / interval) + 1))
  const [count, setCount] = useState(() => typedCount(time.get()))
  useMotionValueEvent(time, "change", (value) => setCount(typedCount(value)))

  const typed = chars.slice(0, count).join("")
  const caretX = x + flowTextWidth(typed)
  const typingEnd = at + chars.length * interval
  // 打字时常亮，打完后闪几下就收起
  const caretOpacity = useTransform(time, (value) => {
    if (value < at || value > typingEnd + 0.9) return 0
    if (value < typingEnd) return 1
    return Math.floor((value - typingEnd) * 3) % 2 === 0 ? 1 : 0
  })
  const opacity = useTransform(time, [exit, duration], [1, 0])

  return (
    <g data-slot="flow-typed-text" style={flowToneStyle(tone)}>
      <motion.g style={{ opacity }}>
        <FlowLabel x={x} y={y} anchor="start">
          {typed}
        </FlowLabel>
        <motion.g style={{ opacity: caretOpacity }}>
          <rect
            x={caretX + 1}
            y={y - 6}
            width={1}
            height={12}
            className={toneClasses.fill}
          />
        </motion.g>
      </motion.g>
    </g>
  )
}

/**
 * 不带光点的连线，用来画背景关系、备用路径。
 * 传入 `at` 后默认从起点沿路径生长出来，到 `exit` 后随循环淡出；不传则一直显示。
 */
function FlowEdge({
  route,
  at,
  reveal = "draw",
  drawDuration = route.length / FLOW_BEAM_SPEED,
  guide = true,
  dashed = false,
  flow = false,
  tone,
}: {
  /** 由 `flowRoute` 生成的路径 */
  route: FlowRoute
  /** 出现的时刻（秒），不传则一直显示 */
  at?: number
  /**
   * 出现方式：`draw` 沿路径生长，`fade` 整条淡入。虚线（`dashed`）无法生长，会自动改为淡入
   * @default "draw"
   */
  reveal?: "draw" | "fade"
  /**
   * 生长用时（秒），缺省按光点的飞行速度由路径长度换算，和光点线的节奏一致
   * @default route.length / FLOW_BEAM_SPEED
   */
  drawDuration?: number
  /**
   * 生长之前是否先留一条很淡的虚线引导，只对生长有效
   * @default true
   */
  guide?: boolean
  /**
   * 是否画成虚线，表示可选或备用的路径
   * @default false
   */
  dashed?: boolean
  /**
   * 线画好之后，线上是否有持续向前移动的虚线纹理，用于常驻的数据流
   * @default false
   */
  flow?: boolean
  /**
   * 连线和流动纹理的色调。不传则是中性的前景色，纹理跟随外层色调
   * @default undefined
   */
  tone?: FlowTone
}) {
  const growing = reveal === "draw" && !dashed
  const tinted = tone !== undefined
  const line = (
    <path
      d={route.d}
      strokeWidth={1}
      strokeDasharray={dashed ? "3 3" : undefined}
      className={tinted ? toneClasses.line : "stroke-foreground/20"}
    />
  )
  const flowFrom = at === undefined ? 0 : at + (growing ? drawDuration : 0.3)
  return (
    <g data-slot="flow-edge" style={flowToneStyle(tone)}>
      {at !== undefined && growing ? (
        <FlowLineDraw
          route={route}
          at={at}
          duration={drawDuration}
          guide={guide}
          tinted={tinted}
        />
      ) : at === undefined ? (
        line
      ) : (
        <FlowReveal at={at}>{line}</FlowReveal>
      )}
      {flow ? <FlowLineFlow route={route} from={flowFrom} /> : null}
    </g>
  )
}

/** 旋转的加载圈，只在 `at` 到 `until` 之间显示。`x`、`y` 是中心点。 */
function FlowSpinner({
  x,
  y,
  at,
  until,
  size = 12,
  tone,
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
   * 圆环色调
   * @default 沿用外层（所在节点或 FlowDiagram）的 tone
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
    <g data-slot="flow-spinner" style={flowToneStyle(tone)}>
      <motion.g style={{ opacity }}>
        <motion.g
          style={{
            rotate,
            transformBox: "fill-box",
            transformOrigin: "center",
          }}
        >
          <circle
            cx={x}
            cy={y}
            r={radius}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeDasharray={`${circumference * 0.7} ${circumference}`}
            className={toneClasses.stroke}
          />
        </motion.g>
      </motion.g>
    </g>
  )
}

/** 状态点：到 `at` 时淡入；`pulse` 打开后向外扩散一圈圈涟漪。 */
function FlowStatusDot({
  x,
  y,
  at,
  radius = 2,
  tone,
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
   * 点的色调，例如成功用 `green`、失败用 `destructive`
   * @default 沿用外层（所在节点或 FlowDiagram）的 tone
   */
  tone?: FlowTone
  /**
   * 是否向外扩散涟漪，表示服务在运行
   * @default false
   */
  pulse?: boolean
}) {
  const dot = (
    <g data-slot="flow-status-dot" style={flowToneStyle(tone)}>
      <circle cx={x} cy={y} r={radius} className={toneClasses.fill} />
      {pulse ? <Ripple x={x} y={y} radius={radius} at={at ?? 0} /> : null}
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
}: {
  x: number
  y: number
  radius: number
  at: number
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
      className={cn("fill-none", toneClasses.stroke)}
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
export type { FlowIcon, FlowNodeShape }
