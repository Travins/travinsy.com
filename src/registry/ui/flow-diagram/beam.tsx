"use client"

import { motion, useTransform } from "motion/react"

import { useFlowClock } from "./flow-clock"
import { FLOW_BEAM_SPEED, type FlowRoute } from "./route"
import { toneClasses, type FlowTone } from "./tone"

/** 光点本体与拖尾的长度（像素） */
const HEAD_LENGTH = 8
const TAIL_LENGTH = 26

/** 连线 + 沿线流动的光点（带一小段拖尾）。 */
function FlowBeam({
  route: { d, length },
  at,
  base = true,
  tone = "primary",
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
   * 光点颜色，失败、拒绝之类的分支用 `destructive`
   * @default "primary"
   */
  tone?: FlowTone
}) {
  const { time } = useFlowClock()
  const end = at + (length + TAIL_LENGTH) / FLOW_BEAM_SPEED
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
  const stroke = toneClasses[tone].stroke

  return (
    <g data-slot="flow-beam">
      {base ? (
        <path d={d} strokeWidth={1} className="stroke-foreground/20" />
      ) : null}
      <motion.path
        d={d}
        strokeWidth={1.5}
        strokeLinecap="round"
        className={stroke}
        style={{
          pathLength: TAIL_LENGTH / length,
          pathSpacing: 2,
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
          pathLength: HEAD_LENGTH / length,
          pathSpacing: 2,
          pathOffset: headOffset,
          opacity: headOpacity,
        }}
      />
    </g>
  )
}

export { FlowBeam }
