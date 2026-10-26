"use client"

import { motion, useTransform } from "motion/react"

import { useClock } from "./diagram"

/** 光点飞行速度（像素/秒）：三幅插画共用，各段耗时由路径长度换算，节奏才一致 */
const BEAM_SPEED = 110
/** 光点本体与拖尾的长度（像素） */
const HEAD_LENGTH = 8
const TAIL_LENGTH = 26

type Point = readonly [number, number]
type Route = { d: string; length: number }

function round(value: number) {
  return Math.round(value * 100) / 100
}

/**
 * 把折线（只含水平/垂直段）变成圆角路径，并返回近似长度。
 * 长度要提前知道：光点的出现和到达时间都靠它换算，不用在浏览器里量。
 */
function route(points: readonly Point[], radius = 6): Route {
  let d = `M${points[0][0]} ${points[0][1]}`
  let length = 0
  for (let index = 1; index < points.length; index += 1) {
    const [px, py] = points[index - 1]
    const [cx, cy] = points[index]
    const next = points[index + 1]
    const incoming = Math.hypot(cx - px, cy - py)
    length += incoming
    if (!next) {
      d += ` L${cx} ${cy}`
      continue
    }
    const [nx, ny] = next
    const outgoing = Math.hypot(nx - cx, ny - cy)
    const corner = Math.min(radius, incoming / 2, outgoing / 2)
    const inX = (cx - px) / incoming
    const inY = (cy - py) / incoming
    const outX = (nx - cx) / outgoing
    const outY = (ny - cy) / outgoing
    d += ` L${round(cx - inX * corner)} ${round(cy - inY * corner)}`
    d += ` Q${cx} ${cy} ${round(cx + outX * corner)} ${round(cy + outY * corner)}`
    // 二次贝塞尔拐角比两条直角边短约 0.4 倍半径
    length -= 0.4 * corner
  }
  return { d, length: round(length) }
}

/** 光点从 `at` 出发后到达终点的时刻，用来点亮目标节点。 */
function landing(at: number, { length }: Route) {
  return at + length / BEAM_SPEED
}

/**
 * 连线 + 沿线流动的光点（主色，带一小段拖尾）。
 * `base={false}` 时只画光点，用于同一条线上的重复脉冲，避免底线叠加变粗。
 */
function Beam({
  route: { d, length },
  at,
  base = true,
}: {
  route: Route
  /** 光点出发的时刻（秒） */
  at: number
  base?: boolean
}) {
  const { time } = useClock()
  const end = at + (length + TAIL_LENGTH) / BEAM_SPEED
  // 光点头部沿路径走过的距离；超出终点的部分让拖尾也走完
  const head = useTransform(time, [at, end], [0, length + TAIL_LENGTH])
  const headOffset = useTransform(head, (value) => (value - HEAD_LENGTH) / length)
  const tailOffset = useTransform(head, (value) => (value - TAIL_LENGTH) / length)
  const headOpacity = useTransform(time, (value) => (value > at && value < end ? 1 : 0))
  const tailOpacity = useTransform(time, (value) =>
    value > at && value < end ? 0.35 : 0,
  )

  return (
    <>
      {base ? (
        <path d={d} strokeWidth={1} className="stroke-foreground/20" />
      ) : null}
      <motion.path
        d={d}
        strokeWidth={1.5}
        strokeLinecap="round"
        className="stroke-primary"
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
        className="stroke-primary"
        style={{
          pathLength: HEAD_LENGTH / length,
          pathSpacing: 2,
          pathOffset: headOffset,
          opacity: headOpacity,
        }}
      />
    </>
  )
}

export { Beam, landing, route }
export type { Route }
