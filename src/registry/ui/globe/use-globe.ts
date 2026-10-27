"use client"

import * as React from "react"
import createGlobe, { type Globe as CobeGlobe } from "cobe"
import { useInView, useReducedMotion } from "motion/react"

import { luminance, resolveColor, toneToCss, type GlobeRgb } from "./color"
import { anglesFor, MARKER_ELEVATION, project } from "./projection"
import type { GlobeArc, GlobeMarker, GlobeTone } from "./types"

type UseGlobeOptions = {
  markers: GlobeMarker[]
  arcs: GlobeArc[]
  dotTone: GlobeTone
  markerTone: GlobeTone
  arcTone: GlobeTone
  speed: number
  phi: number
  theta: number
  draggable: boolean
  paused: boolean
  mapSamples: number
  focus?: [number, number] | null
}

// 俯仰角的活动范围，再大地球会翻过去
const MAX_TILT = 0.9
let webglSupport: boolean | undefined

function supportsWebGL() {
  if (webglSupport === undefined) {
    const canvas = document.createElement("canvas")
    webglSupport = !!(canvas.getContext("webgl2") ?? canvas.getContext("webgl"))
  }
  return webglSupport
}

/** 把角度差折到 (-π, π]，聚焦时沿最短方向转过去。 */
function shortestAngle(delta: number) {
  const turn = Math.PI * 2
  return ((((delta + Math.PI) % turn) + turn) % turn) - Math.PI
}

const mix = (a: GlobeRgb, b: GlobeRgb, t: number): GlobeRgb => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
]
const scale = (a: GlobeRgb, k: number): GlobeRgb => [
  a[0] * k,
  a[1] * k,
  a[2] * k,
]

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

/**
 * 地球的渲染循环：创建 cobe 实例、跟随主题取色、自转、拖拽惯性、聚焦缓动，
 * 并把标签层的位置直接写进 DOM（不经过 React，每帧不触发渲染）。
 */
function useGlobe(options: UseGlobeOptions) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const hostRef = React.useRef<HTMLDivElement>(null)
  const labelRefs = React.useRef<(HTMLElement | null)[]>([])
  const [ready, setReady] = React.useState(false)
  const [dragging, setDragging] = React.useState(false)
  const inView = useInView(rootRef, { amount: 0 })
  const reduced = !!useReducedMotion()

  // 回调里要读最新的 props，但又不想因此重建 cobe，所以放进 ref，在 effect 里同步
  const latest = React.useRef({ ...options, inView, reduced })
  const engine = React.useRef({
    globe: null as CobeGlobe | null,
    size: 0,
    phi: options.phi,
    theta: options.theta,
    vPhi: 0,
    vTheta: 0,
    dragging: false,
    pointerX: 0,
    pointerY: 0,
    pointerTime: 0,
    frame: 0,
    last: 0,
    requestFrame: () => {},
    draw: () => {},
    applyAppearance: () => {},
  })

  React.useEffect(() => {
    latest.current = { ...options, inView, reduced }
  })

  React.useEffect(() => {
    const root = rootRef.current
    const host = hostRef.current
    if (!root || !host || !supportsWebGL()) return
    const state = engine.current
    const canvas = document.createElement("canvas")
    canvas.style.cssText =
      "display:block;width:100%;height:100%;opacity:0;transition:opacity .6s"
    host.append(canvas)
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    state.size = host.clientWidth || 1
    const globe = createGlobe(canvas, {
      width: state.size,
      height: state.size,
      devicePixelRatio: dpr,
      phi: state.phi,
      theta: state.theta,
      mapSamples: latest.current.mapSamples,
      mapBrightness: 6,
      baseColor: [0.5, 0.5, 0.5],
      markerColor: [1, 0.5, 0],
      glowColor: [1, 1, 1],
      diffuse: 1.2,
      dark: 0,
      markerElevation: MARKER_ELEVATION,
    })
    state.globe = globe

    const draw = () => {
      globe.update({ phi: state.phi, theta: state.theta })
      const { markers } = latest.current
      markers.forEach((marker, index) => {
        const el = labelRefs.current[index]
        if (!el) return
        const p = project(marker.location, state.phi, state.theta)
        el.style.transform = `translate3d(${p.x * state.size}px, ${p.y * state.size}px, 0)`
        el.style.opacity = String(clamp((p.facing - 0.08) / 0.3, 0, 1))
      })
    }

    const applyAppearance = () => {
      const o = latest.current
      const dot = resolveColor(root, toneToCss(o.dotTone))
      const bg = resolveColor(root, "var(--background)")
      const dark = luminance(bg) < 0.45
      // cobe 的着色：亮色模式下 baseColor 是球面底色，陆地点阵是它压暗后的样子；
      // 暗色模式下 baseColor 是点阵的亮度，球面底色是它的 10%。
      // 所以亮色取「背景向点阵色靠一点」做底色，暗色直接取点阵色。
      globe.update({
        baseColor: dark ? dot : mix(bg, dot, 0.16),
        glowColor: dark ? scale(dot, 0.35) : bg,
        mapBrightness: dark ? 6 : 1.8,
        diffuse: dark ? 1.2 : 0.9,
        markerColor: resolveColor(root, toneToCss(o.markerTone)),
        arcColor: resolveColor(root, toneToCss(o.arcTone)),
        dark: dark ? 1 : 0,
        markers: o.markers.map((marker) => ({
          location: marker.location,
          size: marker.size ?? 0.045,
          color: resolveColor(root, toneToCss(marker.tone ?? o.markerTone)),
        })),
        arcs: o.arcs.map((arc) => ({
          from: arc.from,
          to: arc.to,
          color: resolveColor(root, toneToCss(arc.tone ?? o.arcTone)),
        })),
        mapSamples: o.mapSamples,
      })
      draw()
    }

    const frame = (now: number) => {
      state.frame = 0
      const o = latest.current
      const dt = Math.min((now - state.last) / 1000, 0.05)
      state.last = now
      let busy = false
      if (!state.dragging) {
        const target = o.focus ? anglesFor(o.focus) : null
        if (target) {
          const ease = 1 - Math.exp(-dt * 4)
          const delta = shortestAngle(target.phi - state.phi)
          state.phi += delta * ease
          state.theta += (target.theta - state.theta) * ease
          state.vPhi = 0
          busy = Math.abs(delta) > 0.002
        } else {
          const rotate = o.inView && !o.paused && !o.reduced
          state.phi += ((rotate ? o.speed : 0) + state.vPhi) * dt
          state.vPhi *= Math.exp(-dt * 2.2)
          if (Math.abs(state.vPhi) < 0.002) state.vPhi = 0
          if (!o.reduced) {
            state.theta += (o.theta - state.theta) * (1 - Math.exp(-dt * 3))
            state.theta = clamp(state.theta, -MAX_TILT, MAX_TILT)
          }
          busy =
            rotate ||
            state.vPhi !== 0 ||
            (!o.reduced && Math.abs(state.theta - o.theta) > 0.002)
        }
      }
      draw()
      if (busy && o.inView) state.frame = requestAnimationFrame(frame)
    }
    state.requestFrame = () => {
      if (state.frame) return
      state.last = performance.now()
      state.frame = requestAnimationFrame(frame)
    }
    state.draw = draw
    state.applyAppearance = applyAppearance

    const resize = new ResizeObserver(() => {
      const size = host.clientWidth
      if (!size || size === state.size) return
      state.size = size
      globe.update({ width: size, height: size })
      draw()
    })
    resize.observe(host)

    // 亮暗模式、颜色主题都是改 <html> 的 class / data-theme，重新取色即可
    const theme = new MutationObserver(applyAppearance)
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "style"],
    })

    applyAppearance()
    canvas.style.opacity = "1"
    setReady(true)
    state.requestFrame()

    return () => {
      cancelAnimationFrame(state.frame)
      state.frame = 0
      resize.disconnect()
      theme.disconnect()
      globe.destroy()
      state.globe = null
      state.draw = () => {}
      state.requestFrame = () => {}
      state.applyAppearance = () => {}
      host.replaceChildren()
      setReady(false)
    }
  }, [])

  // 标记、色调、采样数变化：重新取色并重画
  const markersKey = JSON.stringify([options.markers, options.arcs])
  React.useEffect(() => {
    engine.current.applyAppearance()
    engine.current.requestFrame()
  }, [
    markersKey,
    options.dotTone,
    options.markerTone,
    options.arcTone,
    options.mapSamples,
  ])

  // 暂停、进入视口、聚焦目标变化：重新启动渲染循环
  React.useEffect(() => {
    engine.current.requestFrame()
  }, [
    inView,
    reduced,
    options.paused,
    options.focus,
    options.speed,
    options.theta,
  ])

  const { draggable } = options
  const handlers = React.useMemo(() => {
    if (!draggable) return {}
    const state = engine.current
    const radius = () => Math.max(1, state.size * 0.4)
    return {
      onPointerDown(event: React.PointerEvent<HTMLElement>) {
        if (event.pointerType === "mouse" && event.button !== 0) return
        event.currentTarget.setPointerCapture(event.pointerId)
        state.dragging = true
        state.vPhi = 0
        state.pointerX = event.clientX
        state.pointerY = event.clientY
        state.pointerTime = event.timeStamp
        setDragging(true)
      },
      onPointerMove(event: React.PointerEvent<HTMLElement>) {
        if (!state.dragging) return
        const dx = event.clientX - state.pointerX
        const dy = event.clientY - state.pointerY
        const dt = Math.max(1, event.timeStamp - state.pointerTime) / 1000
        state.pointerX = event.clientX
        state.pointerY = event.clientY
        state.pointerTime = event.timeStamp
        state.phi += dx / radius()
        // 触屏上纵向留给页面滚动，只有鼠标 / 手写笔才改俯仰角
        if (event.pointerType !== "touch")
          state.theta = clamp(state.theta + dy / radius(), -MAX_TILT, MAX_TILT)
        // 速度做指数平滑，松手时的惯性不会被最后一次抖动带偏
        state.vPhi = state.vPhi * 0.6 + (dx / radius() / dt) * 0.4
        state.draw()
      },
      onPointerUp(event: React.PointerEvent<HTMLElement>) {
        if (!state.dragging) return
        state.dragging = false
        if (event.currentTarget.hasPointerCapture(event.pointerId))
          event.currentTarget.releasePointerCapture(event.pointerId)
        if (latest.current.reduced) state.vPhi = 0
        state.vPhi = clamp(state.vPhi, -6, 6)
        setDragging(false)
        state.requestFrame()
      },
      onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
        const step = { ArrowLeft: -1, ArrowRight: 1 }[event.key]
        if (!step) return
        event.preventDefault()
        // 键盘按一下给一个速度，之后沿用拖拽的惯性衰减，reduced-motion 下直接转一小步
        if (latest.current.reduced) state.phi += step * 0.2
        else state.vPhi = clamp(state.vPhi + step * 1.6, -6, 6)
        state.requestFrame()
        state.draw()
      },
    }
  }, [draggable])

  return { rootRef, hostRef, labelRefs, ready, dragging, handlers }
}

export { useGlobe }
export type { UseGlobeOptions }
