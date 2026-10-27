/**
 * 经纬度 → 屏幕坐标。公式与 cobe 内部一致（见 cobe 的 markers 投影），
 * 用来把 HTML 标签贴在地球表面的标记上，并判断标记是否转到了背面。
 */

/** 球体半径占画布半宽的比例（cobe 固定为 0.8）。 */
const GLOBE_RADIUS = 0.8
/** 标记抬离球面的高度，与传给 cobe 的 `markerElevation` 保持一致。 */
const MARKER_ELEVATION = 0.02

type Projected = {
  /** 0–1，画布左上为原点 */
  x: number
  y: number
  /** 面向相机的程度：1 正对，0 在球的边缘，负数在背面 */
  facing: number
}

/** [纬度, 经度]（角度）换成单位球面上的点。 */
function toUnit([lat, lng]: [number, number]): [number, number, number] {
  const phi = (lat * Math.PI) / 180
  const lambda = (lng * Math.PI) / 180 - Math.PI
  const cosLat = Math.cos(phi)
  return [-cosLat * Math.cos(lambda), Math.sin(phi), cosLat * Math.sin(lambda)]
}

function project(
  location: [number, number],
  phi: number,
  theta: number,
  aspect = 1,
): Projected {
  const [ux, uy, uz] = toUnit(location)
  const r = GLOBE_RADIUS + MARKER_ELEVATION
  const x = ux * r
  const y = uy * r
  const z = uz * r
  const cosPhi = Math.cos(phi)
  const sinPhi = Math.sin(phi)
  const cosTheta = Math.cos(theta)
  const sinTheta = Math.sin(theta)
  const screenX = cosPhi * x + sinPhi * z
  const screenY = sinPhi * sinTheta * x + cosTheta * y - cosPhi * sinTheta * z
  const depth = -sinPhi * cosTheta * x + sinTheta * y + cosPhi * cosTheta * z
  return {
    x: (screenX / aspect + 1) / 2,
    y: (-screenY + 1) / 2,
    facing: depth / r,
  }
}

/** 让 `location` 正对相机所需的 phi / theta（弧度）。 */
function anglesFor([lat, lng]: [number, number]) {
  return { phi: ((-90 - lng) * Math.PI) / 180, theta: (lat * Math.PI) / 180 }
}

export { anglesFor, MARKER_ELEVATION, project }
export type { Projected }
