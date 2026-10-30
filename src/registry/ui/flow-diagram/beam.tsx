"use client"

import { motion, motionValue, useTransform } from "motion/react"
import { useMemo } from "react"

import { useFlowClock } from "./flow-clock"
import { FLOW_BEAM_SPEED, FLOW_LINE_SPEED, type FlowRoute } from "./route"
import {
  flowToneStyle,
  toneClasses,
  type FlowTone,
} from "@/registry/lib/flow-tone"

/** 光点本体与拖尾的长度（像素） */
const HEAD_LENGTH = 8
const TAIL_LENGTH = 26

/** “流动”虚线纹理的短划与间隔长度（像素） */
const FLOW_DASH = 4
const FLOW_GAP = 8
/** 生长完成后，引导虚线退场、流动纹理淡入所用的时间（秒） */
const SETTLE = 0.3

/**
 * 常量也要包成 MotionValue 再放进 `style`：motion 只在 `pathLength` 是动画值时才把
 * `pathLength` / `pathSpacing` / `pathOffset` 换算成 SVG 的 stroke-dasharray，
 * 直接写数字会被当成普通 CSS，虚线不生效，光点会变成一整条实线。
 */
function useConstantValue(value: number) {
  return useMemo(() => motionValue(value), [value])
}

/**
 * 沿路径逐渐画出来的连线。
 * 画出的长度由时间推导（`at` 到 `at + duration` 从 0 到整条），到 `exit` 后随循环淡出；
 * 生长之前可以留一条很淡的虚线当引导，画完后让位给实线。
 */
function FlowLineDraw({
  route: { d },
  at,
  duration,
  guide = true,
  tinted = false,
}: {
  route: FlowRoute
  /** 开始生长的时刻（秒） */
  at: number
  /** 生长用时（秒） */
  duration: number
  /** 生长之前是否先画一条很淡的虚线引导 */
  guide?: boolean
  /** 实线是否染上 `--flow-tone` 的颜色，否则是中性的前景色 */
  tinted?: boolean
}) {
  const { time, exit, duration: cycle } = useFlowClock()
  const arrival = at + duration
  const progress = useTransform(time, [at, arrival], [0, 1])
  const opacity = useTransform(time, [exit, cycle], [1, 0])
  // 引导线在画完后很快退场，循环末尾随实线淡出时再回来，下一轮开头才不会空
  const guideOpacity = useTransform(
    time,
    [arrival, Math.min(arrival + SETTLE, exit), exit, cycle],
    [1, 0, 0, 1],
  )
  return (
    <g data-slot="flow-line">
      {guide ? (
        <motion.path
          d={d}
          strokeWidth={1}
          strokeDasharray="2 3"
          className="stroke-foreground/10"
          style={{ opacity: guideOpacity }}
        />
      ) : null}
      <motion.path
        d={d}
        strokeWidth={1}
        className={tinted ? toneClasses.line : "stroke-foreground/20"}
        style={{ pathLength: progress, opacity }}
      />
    </g>
  )
}

/**
 * 连线上持续向前移动的虚线纹理，像数据在管道里流动。
 * 位移由时间推导，所以和光点一样会在离开视口时暂停、在静帧下停住。
 */
function FlowLineFlow({
  route: { d, length },
  from,
}: {
  route: FlowRoute
  /** 纹理开始淡入的时刻（秒），通常是连线画完的那一刻；颜色取外层的 `--flow-tone` */
  from: number
}) {
  const { time, exit, duration } = useFlowClock()
  const dash = useConstantValue(FLOW_DASH / length)
  const gap = useConstantValue(FLOW_GAP / length)
  const offset = useTransform(
    time,
    (value) => (value * FLOW_LINE_SPEED) / length,
  )
  const opacity = useTransform(
    time,
    [from, Math.min(from + SETTLE, exit), exit, duration],
    [0, 1, 1, 0],
  )
  return (
    <motion.path
      data-slot="flow-line-flow"
      d={d}
      strokeWidth={1.5}
      className={toneClasses.flow}
      style={{
        pathLength: dash,
        pathSpacing: gap,
        pathOffset: offset,
        opacity,
      }}
    />
  )
}

/**
 * 连线 + 沿线流动的光点（带一小段拖尾）。
 * 默认连线跟着光点头部一路生长出来；`flow` 可以在画好之后让线上持续流动。
 */
function FlowBeam({
  route,
  at,
  base = true,
  line = "draw",
  guide = true,
  flow = false,
  tone,
}: {
  /** 由 `flowRoute` 生成的路径 */
  route: FlowRoute
  /** 光点出发的时刻（秒） */
  at: number
  /**
   * 是否同时画出底线。同一条线上的重复脉冲设为 `false`，避免底线叠加变粗
   * @default true
   */
  base?: boolean
  /**
   * 底线的出现方式：`draw` 跟随光点头部逐渐画出，到 `exit` 后淡出；
   * `static` 一开始就整条存在
   * @default "draw"
   */
  line?: "draw" | "static"
  /**
   * 生长之前是否先留一条很淡的虚线引导，只对 `line="draw"` 有效
   * @default true
   */
  guide?: boolean
  /**
   * 连线画好之后，线上是否有持续向前移动的虚线纹理，用于常驻的数据流
   * @default false
   */
  flow?: boolean
  /**
   * 色调，作用于光点、拖尾和流动纹理；明确指定后，生长的底线也会淡淡染上这个颜色。
   * 失败、拒绝之类的分支用 `destructive`，多条并行链路可以各用一种颜色
   * @default 沿用 FlowDiagram 的 tone（"primary"）
   */
  tone?: FlowTone
}) {
  const { d, length } = route
  const { time } = useFlowClock()
  const travel = length / FLOW_BEAM_SPEED
  const end = at + travel + TAIL_LENGTH / FLOW_BEAM_SPEED
  // 光点头部沿路径走过的距离；超出终点的部分让拖尾也走完
  const head = useTransform(time, [at, end], [0, length + TAIL_LENGTH])
  const headOffset = useTransform(
    head,
    (value) => (value - HEAD_LENGTH) / length,
  )
  const tailOffset = useTransform(
    head,
    (value) => (value - TAIL_LENGTH) / length,
  )
  const headOpacity = useTransform(time, (value) =>
    value > at && value < end ? 1 : 0,
  )
  const tailOpacity = useTransform(time, (value) =>
    value > at && value < end ? 0.35 : 0,
  )
  const tailLength = useConstantValue(TAIL_LENGTH / length)
  const headLength = useConstantValue(HEAD_LENGTH / length)
  const spacing = useConstantValue(2)
  const stroke = toneClasses.stroke

  return (
    <g data-slot="flow-beam" style={flowToneStyle(tone)}>
      {base ? (
        line === "draw" ? (
          <FlowLineDraw
            route={route}
            at={at}
            duration={travel}
            guide={guide}
            tinted={tone !== undefined}
          />
        ) : (
          <path
            d={d}
            strokeWidth={1}
            className={
              tone !== undefined ? toneClasses.line : "stroke-foreground/20"
            }
          />
        )
      ) : null}
      {flow ? <FlowLineFlow route={route} from={at + travel} /> : null}
      <motion.path
        d={d}
        strokeWidth={1.5}
        strokeLinecap="round"
        className={stroke}
        style={{
          pathLength: tailLength,
          pathSpacing: spacing,
          pathOffset: tailOffset,
          opacity: tailOpacity,
        }}
      />
      <motion.path
        d={d}
        strokeWidth={2}
        strokeLinecap="round"
        className={stroke}
        style={{
          pathLength: headLength,
          pathSpacing: spacing,
          pathOffset: headOffset,
          opacity: headOpacity,
        }}
      />
    </g>
  )
}

export { FlowBeam, FlowLineDraw, FlowLineFlow }
