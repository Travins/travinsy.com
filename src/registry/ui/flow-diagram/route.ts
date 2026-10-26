// 纯函数，不依赖 React：服务端组件也可以直接调用

/** 光点飞行速度（像素/秒）：各段耗时由路径长度换算，同一张图里节奏才一致 */
const FLOW_BEAM_SPEED = 110
type FlowPoint = readonly [number, number]
type FlowRoute = { d: string; length: number }

function round(value: number) {
  return Math.round(value * 100) / 100
}

/**
 * 把折线变成圆角路径，并返回近似长度。
 * 长度要提前知道：光点的出现和到达时间都靠它换算，不用在浏览器里量。
 * 建议在组件外调用，每次渲染重新计算没有意义。
 */
function flowRoute(points: readonly FlowPoint[], radius = 6): FlowRoute {
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
function flowArrival(at: number, { length }: FlowRoute) {
  return at + length / FLOW_BEAM_SPEED
}

export { FLOW_BEAM_SPEED, flowArrival, flowRoute }
export type { FlowPoint, FlowRoute }
