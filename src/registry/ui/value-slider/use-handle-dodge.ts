"use client"

import * as React from "react"

/** 服务端渲染时没有布局，用 useEffect 代替 useLayoutEffect，避免 React 警告。 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect

/** 手柄让位时给文字两边留的余量（像素）。 */
const PADDING = 16
/** 还没量到轨道宽度时，按这个比例判断「手柄压在端点附近」。 */
const FIRST_FRAME_RATIO = 15

type HandleDodge = {
  /** 挂在轨道上 */
  trackRef: React.RefObject<HTMLDivElement | null>
  /** 挂在轨道内的标签上 */
  labelRef: React.RefObject<HTMLSpanElement | null>
  /** 挂在轨道内的读数上 */
  valueRef: React.RefObject<HTMLSpanElement | null>
  /** 手柄在 `percent` 处时要不要让开文字 */
  isNear: (percent: number) => boolean
}

/**
 * 手柄让开轨道两端的标签与读数：量出文字宽度换算成百分比阈值。
 * 首帧（还没量到宽度）先按「靠近端点」处理，量完再按真实阈值，
 * 这样静态 HTML 与首屏也不会把手柄压在文字上。
 */
function useHandleDodge(enabled: boolean): HandleDodge {
  const trackRef = React.useRef<HTMLDivElement>(null)
  const labelRef = React.useRef<HTMLSpanElement>(null)
  const valueRef = React.useRef<HTMLSpanElement>(null)
  const [metrics, setMetrics] = React.useState({ track: 0, label: 0, value: 0 })

  useIsomorphicLayoutEffect(() => {
    if (!enabled) return
    const track = trackRef.current
    if (!track) return
    const measure = () =>
      setMetrics((previous) => {
        const next = {
          track: track.clientWidth,
          label: labelRef.current?.offsetWidth ?? 0,
          value: valueRef.current?.offsetWidth ?? 0,
        }
        return previous.track === next.track &&
          previous.label === next.label &&
          previous.value === next.value
          ? previous
          : next
      })
    // 先同步量一次（在浏览器绘制之前就能拿到真实宽度），再由 ResizeObserver 跟进
    measure()
    const observer = new ResizeObserver(measure)
    for (const element of [track, labelRef.current, valueRef.current])
      if (element) observer.observe(element)
    return () => observer.disconnect()
  }, [enabled])

  const ratio = (width: number) =>
    metrics.track > 0 ? ((width + PADDING) / metrics.track) * 100 : 0
  const startLimit = ratio(metrics.label)
  const endLimit = ratio(metrics.value)

  const isNear = (percent: number) => {
    if (!enabled) return false
    if (metrics.track === 0)
      return percent < FIRST_FRAME_RATIO || percent > 100 - FIRST_FRAME_RATIO
    return (
      (startLimit > 0 && percent <= startLimit) ||
      (endLimit > 0 && percent >= 100 - endLimit)
    )
  }

  return { trackRef, labelRef, valueRef, isNear }
}

export { useHandleDodge }
export type { HandleDodge }
