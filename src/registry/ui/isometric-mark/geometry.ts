/**
 * 等轴测挤出的纯几何计算：只依赖数学，不碰 React，方便单测与复用。
 *
 * 坐标约定：平面 logo 的坐标 (x, y)，y 向下；挤出方向为 z（向上）。
 * 投影：X = (x - y)·cos30°，Y = (x + y)·sin30° - z。
 * 在这个投影下，观察者位于 (+x, +y, +z) 一侧，朝向 (1, 1) 的墙面可见。
 */

/** 平面坐标点 `[x, y]` */
type IsometricPoint = readonly [number, number]

/** 一个平面形状：一圈外轮廓加若干个孔，孔会被挤成通孔。 */
type IsometricShape = {
  outer: readonly IsometricPoint[]
  holes?: readonly (readonly IsometricPoint[])[]
}

/** 墙面底边在屏幕上的两个端点（z = 0），顶边由当前高度决定。 */
type IsometricWall = { x0: number; y0: number; x1: number; y1: number }

type IsometricModel = {
  viewBox: { x: number; y: number; width: number; height: number }
  /** 线宽、斜纹、虚线等“一个像素”对应的 viewBox 长度，随图形尺寸等比缩放 */
  unit: number
  /** 实际使用的挤出高度（props 未传时为自动值） */
  depth: number
  /** 顶面路径（z = depth），外轮廓与孔都在其中，需配合 evenodd */
  top: string
  /** 可见侧墙，按从远到近排好序 */
  walls: IsometricWall[]
  /** 背景辅助线路径（isometric 在 z = 0；front 在正面所在的平面） */
  guides: string
  /** 挤出方向（屏幕坐标的单位向量）：顶面 / 正面相对底面的偏移方向 */
  extrude: [number, number]
}

const COS30 = Math.cos(Math.PI / 6)
const SIN30 = 0.5
const EPSILON = 1e-6
/** 自动挤出高度占图形平面尺寸的比例 */
const AUTO_DEPTH_RATIO = 0.12

const fmt = (n: number) => String(Math.round(n * 100) / 100)

/**
 * 视角：`isometric` 把平面放倒在地上，按等轴测投影沿 z 挤出；
 * `front` 把平面当作一块板：先向后倒下 `tilt` 度，再水平转 `turn` 度，正交投影。
 * 板上的图形只被整体压扁、错切，斜线与竖线的关系保持，适合要保留原样的标志。
 */
type IsometricView = "isometric" | "front"

type FrontAngles = { tilt: number; turn: number }

let VIEW: IsometricView = "isometric"
let FRONT = { cosT: 1, sinT: 0, cosR: 1, sinR: 0 }

/** front 视角下沿观察方向的“深度”，越大越靠近观察者 */
function frontDepth(x: number, y: number, z = 0) {
  const d = y * FRONT.sinT + z * FRONT.cosT
  return x * FRONT.sinR + d * FRONT.cosR
}

function project(x: number, y: number, z = 0): [number, number] {
  if (VIEW === "front") {
    // 板绕水平轴向后倒：板面朝上翻，厚度方向（z，朝向观察者）在屏幕上往上走
    const sy = y * FRONT.cosT - z * FRONT.sinT
    const d = y * FRONT.sinT + z * FRONT.cosT
    // 再绕竖直轴转：x 与深度混合
    return [x * FRONT.cosR - d * FRONT.sinR, sy]
  }
  return [(x - y) * COS30, (x + y) * SIN30 - z]
}

/** 去掉首尾重复的闭合点，统一成不含重复端点的环。 */
function cleanRing(ring: readonly IsometricPoint[]): IsometricPoint[] {
  const points = [...ring]
  const first = points[0]
  const last = points[points.length - 1]
  if (points.length > 1 && first[0] === last[0] && first[1] === last[1]) {
    points.pop()
  }
  return points
}

function signedArea(ring: readonly IsometricPoint[]) {
  let sum = 0
  for (let i = 0; i < ring.length; i++) {
    const [x0, y0] = ring[i]
    const [x1, y1] = ring[(i + 1) % ring.length]
    sum += x0 * y1 - x1 * y0
  }
  return sum / 2
}

/** 外轮廓取正面积、孔取负面积，这样所有环的“实体外侧”法线公式一致。 */
function orient(ring: IsometricPoint[], positive: boolean) {
  return signedArea(ring) > 0 === positive ? ring : [...ring].reverse()
}

function ringPath(ring: readonly IsometricPoint[], z: number) {
  return (
    ring
      .map(([x, y], i) => {
        const [px, py] = project(x, y, z)
        return `${i === 0 ? "M" : "L"}${fmt(px)} ${fmt(py)}`
      })
      .join("") + "Z"
  )
}

type Segment = {
  /** 平面坐标，用于排序 */
  px: number
  py: number
  qx: number
  qy: number
}

/** 排序键：沿观察方向的“深度”，越大越靠近观察者。 */
const depthOf = (s: Segment) => (s.px + s.py + s.qx + s.qy) / 4

/**
 * 判断两面墙的前后关系：-1 表示 a 在 b 后面（先画 a），1 相反，0 表示互不遮挡。
 * 墙在屏幕上只有 X = x - y 方向的范围，范围不重叠就不会互相遮挡；
 * 重叠区间内两线段不相交，因此取区间中点比较 x + y 即可。
 */
function compareSegments(a: Segment, b: Segment) {
  const ua0 = a.px - a.py
  const ua1 = a.qx - a.qy
  const ub0 = b.px - b.py
  const ub1 = b.qx - b.qy
  const lo = Math.max(Math.min(ua0, ua1), Math.min(ub0, ub1))
  const hi = Math.min(Math.max(ua0, ua1), Math.max(ub0, ub1))
  if (hi - lo < EPSILON) return 0

  const u = (lo + hi) / 2
  const depthAt = (s: Segment, u0: number, u1: number) => {
    const t = (u - u0) / (u1 - u0)
    return s.px + s.py + t * (s.qx + s.qy - s.px - s.py)
  }
  const diff = depthAt(a, ua0, ua1) - depthAt(b, ub0, ub1)
  if (Math.abs(diff) < EPSILON) return 0
  return diff < 0 ? -1 : 1
}

/**
 * 画家算法的顺序：先按“谁挡住谁”做拓扑排序，凹多边形也能排对；
 * 理论上不会出现环，真遇到时退回按深度最小者优先，保证一定有结果。
 * 顺序只取决于平面形状，与挤出高度无关，所以按下动画时不用重排。
 */
function sortBackToFront(segments: Segment[]) {
  const n = segments.length
  const after: number[][] = Array.from({ length: n }, () => [])
  const blockers = new Array<number>(n).fill(0)

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const order = compareSegments(segments[i], segments[j])
      if (order < 0) {
        after[i].push(j)
        blockers[j]++
      } else if (order > 0) {
        after[j].push(i)
        blockers[i]++
      }
    }
  }

  const done = new Array<boolean>(n).fill(false)
  const sorted: Segment[] = []
  for (let k = 0; k < n; k++) {
    let pick = -1
    for (let i = 0; i < n; i++) {
      if (done[i] || blockers[i] > 0) continue
      if (pick < 0 || depthOf(segments[i]) < depthOf(segments[pick])) pick = i
    }
    if (pick < 0) {
      for (let i = 0; i < n; i++) {
        if (done[i]) continue
        if (pick < 0 || depthOf(segments[i]) < depthOf(segments[pick])) pick = i
      }
    }
    done[pick] = true
    sorted.push(segments[pick])
    for (const next of after[pick]) blockers[next]--
  }
  return sorted
}

function buildIsometricModel(
  shapes: readonly IsometricShape[],
  depthOption?: number,
  guideMode: "box" | "edges" = "box",
  view: IsometricView = "isometric",
  angles: FrontAngles = { tilt: 45, turn: -20 },
): IsometricModel {
  VIEW = view
  const t = (angles.tilt * Math.PI) / 180
  const r = (angles.turn * Math.PI) / 180
  FRONT = {
    cosT: Math.cos(t),
    sinT: Math.sin(t),
    cosR: Math.cos(r),
    sinR: Math.sin(r),
  }
  const rings: { ring: IsometricPoint[]; hole: boolean }[] = []
  for (const shape of shapes) {
    rings.push({ ring: orient(cleanRing(shape.outer), true), hole: false })
    for (const hole of shape.holes ?? []) {
      rings.push({ ring: orient(cleanRing(hole), false), hole: true })
    }
  }

  // 平面包围盒，用于自动高度与辅助线
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const { ring } of rings) {
    for (const [x, y] of ring) {
      minX = Math.min(minX, x)
      minY = Math.min(minY, y)
      maxX = Math.max(maxX, x)
      maxY = Math.max(maxY, y)
    }
  }
  if (!rings.length) {
    minX = minY = maxX = maxY = 0
  }
  const planSize = Math.max(maxX - minX, maxY - minY, 1)
  const depth = Math.max(depthOption ?? planSize * AUTO_DEPTH_RATIO, 0)

  // 背面剔除：法线 (ey, -ex) 与观察方向 (1, 1) 同侧才可见；
  // 法线与观察方向垂直的墙在屏幕上是一条竖线，面积为零，也不画。
  const segments: Segment[] = []
  for (const { ring } of rings) {
    for (let i = 0; i < ring.length; i++) {
      const [px, py] = ring[i]
      const [qx, qy] = ring[(i + 1) % ring.length]
      if (qy - py - (qx - px) > EPSILON) segments.push({ px, py, qx, qy })
    }
  }
  let walls: IsometricWall[]
  if (view === "front") {
    // 投影是线性的：正面 = 底面整体平移 extrude * depth。
    // 外轮廓为正面积、投影不翻转方向，所以屏幕里边的外法线仍是 (dy, -dx)；
    // 法线与挤出方向相反的边，侧面朝向观察者，才看得见。按真实深度从远到近排序。
    const [ex, ey] = project(0, 0, 1)
    const visible: {
      x0: number
      y0: number
      x1: number
      y1: number
      key: number
    }[] = []
    for (const { ring } of rings) {
      for (let i = 0; i < ring.length; i++) {
        const [px, py] = ring[i]
        const [qx, qy] = ring[(i + 1) % ring.length]
        const [x0, y0] = project(px, py)
        const [x1, y1] = project(qx, qy)
        const nx = y1 - y0
        const ny = -(x1 - x0)
        if (nx * ex + ny * ey < -EPSILON) {
          const key = frontDepth((px + qx) / 2, (py + qy) / 2)
          visible.push({ x0, y0, x1, y1, key })
        }
      }
    }
    walls = visible
      .sort((a, b) => a.key - b.key)
      .map(({ x0, y0, x1, y1 }) => ({ x0, y0, x1, y1 }))
  } else {
    walls = sortBackToFront(segments).map((s) => {
      const [x0, y0] = project(s.px, s.py)
      const [x1, y1] = project(s.qx, s.qy)
      return { x0, y0, x1, y1 }
    })
  }

  // 投影后的包围盒：顶面在 z = depth（最高），底边在 z = 0（最低）
  let bx0 = Infinity
  let by0 = Infinity
  let bx1 = -Infinity
  let by1 = -Infinity
  for (const { ring } of rings) {
    for (const [x, y] of ring) {
      const [px, py] = project(x, y)
      const [tx, ty] = project(x, y, depth)
      bx0 = Math.min(bx0, px, tx)
      bx1 = Math.max(bx1, px, tx)
      by0 = Math.min(by0, py, ty)
      by1 = Math.max(by1, py, ty)
    }
  }
  if (!rings.length) {
    bx0 = by0 = bx1 = by1 = 0
  }
  const size = Math.max(bx1 - bx0, by1 - by0, 1)
  const margin = size * 0.02

  // 辅助线：
  // - "box"：包围盒四条边沿两条等轴测轴延长（横平竖直的图形最合适）；
  // - "edges"：沿图形自己的主方向——按边长统计各方向，取最长的两个，每个方向画两条外侧切线并延长。
  //   斜向的图形（如一组斜杠）辅助线会贴着它的长边与齐平的端点。
  const reach = planSize * 1.2
  const guideZ = view === "front" ? depth : 0
  const line = (x0: number, y0: number, x1: number, y1: number) => {
    const [ax, ay] = project(x0, y0, guideZ)
    const [bx, by] = project(x1, y1, guideZ)
    return `M${fmt(ax)} ${fmt(ay)}L${fmt(bx)} ${fmt(by)}`
  }
  const weights = new Map<number, { ux: number; uy: number; length: number }>()
  for (const { ring } of rings) {
    for (let i = 0; i < ring.length; i++) {
      const [px, py] = ring[i]
      const [qx, qy] = ring[(i + 1) % ring.length]
      const length = Math.hypot(qx - px, qy - py)
      if (length < EPSILON) continue
      // 方向取 [0°, 180°)，按 0.5° 分桶，避免浮点误差把同一方向拆开
      let angle = (Math.atan2(qy - py, qx - px) * 180) / Math.PI
      angle = ((angle % 180) + 180) % 180
      const key = Math.round(angle * 2) % 360
      const entry = weights.get(key)
      if (entry) entry.length += length
      else {
        const r = (key / 2) * (Math.PI / 180)
        weights.set(key, { ux: Math.cos(r), uy: Math.sin(r), length })
      }
    }
  }
  const directions =
    guideMode === "edges"
      ? [...weights.values()].sort((a, b) => b.length - a.length).slice(0, 2)
      : [
          { ux: 1, uy: 0, length: 0 },
          { ux: 0, uy: 1, length: 0 },
        ]
  const points = rings.flatMap(({ ring }) => ring)
  const guides = directions
    .flatMap(({ ux, uy }) => {
      const nx = -uy
      const ny = ux
      let lo = Infinity
      let hi = -Infinity
      let a0 = Infinity
      let a1 = -Infinity
      for (const [x, y] of points) {
        const d = x * nx + y * ny
        const t = x * ux + y * uy
        lo = Math.min(lo, d)
        hi = Math.max(hi, d)
        a0 = Math.min(a0, t)
        a1 = Math.max(a1, t)
      }
      return [lo, hi].map((d) => {
        const t0 = a0 - reach
        const t1 = a1 + reach
        return line(
          d * nx + t0 * ux,
          d * ny + t0 * uy,
          d * nx + t1 * ux,
          d * ny + t1 * uy,
        )
      })
    })
    .join("")

  return {
    viewBox: {
      x: bx0 - margin,
      y: by0 - margin,
      width: bx1 - bx0 + margin * 2,
      height: by1 - by0 + margin * 2,
    },
    unit: size / 500,
    depth,
    top: rings.map(({ ring }) => ringPath(ring, depth)).join(""),
    walls,
    guides,
    extrude: view === "front" ? project(0, 0, 1) : [0, -1],
  }
}

/** 高度为 h 时一面墙的路径：底边固定在 z = 0，顶边抬到 z = h。 */
function wallPath(
  { x0, y0, x1, y1 }: IsometricWall,
  h: number,
  [ex, ey]: readonly [number, number] = [0, -1],
) {
  return `M${fmt(x0 + ex * h)} ${fmt(y0 + ey * h)}L${fmt(x1 + ex * h)} ${fmt(y1 + ey * h)}L${fmt(x1)} ${fmt(y1)}L${fmt(x0)} ${fmt(y0)}Z`
}

/**
 * 投影前把平面形状绕包围盒中心旋转 `degrees` 度（y 向下坐标系里顺时针为正）。
 * 建议取 90 的整数倍：这样图形的横竖边始终沿等轴测斜轴，仍是一块平放的板；
 * 其他角度（如 -45°）会让顶面看起来像一堵立着的墙。
 */
function rotateShapes(
  shapes: readonly IsometricShape[],
  degrees: number,
): IsometricShape[] {
  if (!degrees) return shapes.map((s) => ({ ...s }))
  const all = shapes.flatMap((s) => [...s.outer, ...(s.holes ?? []).flat()])
  const xs = all.map(([x]) => x)
  const ys = all.map(([, y]) => y)
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2
  const cy = (Math.min(...ys) + Math.max(...ys)) / 2
  const r = (degrees * Math.PI) / 180
  const cos = Math.cos(r)
  const sin = Math.sin(r)
  const turn = (ring: readonly IsometricPoint[]): IsometricPoint[] =>
    ring.map(([x, y]) => [
      cx + (x - cx) * cos - (y - cy) * sin,
      cy + (x - cx) * sin + (y - cy) * cos,
    ])
  return shapes.map((s) => ({
    outer: turn(s.outer),
    holes: s.holes?.map(turn),
  }))
}

export { buildIsometricModel, rotateShapes, wallPath }
export type {
  IsometricModel,
  IsometricPoint,
  IsometricShape,
  FrontAngles,
  IsometricView,
  IsometricWall,
}
