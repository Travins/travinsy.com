import type { FlowTone } from "@/registry/ui/flow-diagram/tone"

/** 地球色调：与 flow-diagram 共用，内置名或任意 CSS 颜色（可含 `var()`）。 */
type GlobeTone = FlowTone

/** 地球上的一个标记点。 */
type GlobeMarker = {
  /** `[纬度, 经度]`，单位为度 */
  location: [number, number]
  /** 城市或地点名：作为读屏描述，开启标签层时显示为胶囊 */
  label?: string
  /**
   * 标记大小，约 0.02（小）到 0.1（大）
   * @default 0.045
   */
  size?: number
  /** 这个标记的色调，不传则用地球的 `markerTone` */
  tone?: GlobeTone
  /** 单独控制这个标记是否显示标签，不传则跟随地球的 `labels` */
  showLabel?: boolean
}

/** 两点之间的弧线。 */
type GlobeArc = {
  from: [number, number]
  to: [number, number]
  /** 弧线色调，不传则用地球的 `arcTone` */
  tone?: GlobeTone
}

export type { GlobeArc, GlobeMarker, GlobeTone }
