"use client"

import * as React from "react"
import {
  animate,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type AnimationPlaybackControls,
  type MotionValue,
} from "motion/react"

import { clamp01, rubberBand } from "./utils"

/** 打开 / 关闭过冲的弹簧：`visualDuration` 是回到原位的时间，`bounce` 给它一点回弹。 */
const RECOIL_SPRING = {
  type: "spring",
  visualDuration: 0.4,
  bounce: 0.45,
} as const
/** 轨道在过冲时的最大纵向压缩比例。 */
const SQUASH_RATIO = 0.12

type ElasticSide = "start" | "end"

type UseElasticPullOptions = {
  /** 拖出两端的最大过冲像素，`0` 关闭弹性 */
  elasticity: number
  /** 禁用时立刻收手：移除监听、停止弹簧、过冲归零 */
  disabled?: boolean
  /** 某一侧被拉开时回调，一次手势里每侧只报一次（用来放碰边音效） */
  onEdge?: (side: ElasticSide) => void
}

type ElasticPull = {
  /** 有符号的拉伸像素：负数往左、正数往右 */
  pull: MotionValue<number>
  /** 视觉层的水平位移，和 `scaleX` 配合成「拉住一端」的样子 */
  x: MotionValue<number>
  scaleX: MotionValue<number>
  scaleY: MotionValue<number>
  startIconX: MotionValue<number>
  endIconX: MotionValue<number>
  startIconScale: MotionValue<number>
  endIconScale: MotionValue<number>
  /** 当前拉向哪一端，用于根元素的 `data-overshoot` */
  side: ElasticSide | null
  /** 挂在 `Slider.Control` 上：只量 Control 的矩形，视觉层自己缩放 */
  onPointerDown: (event: React.PointerEvent<HTMLElement>) => void
  /** 键盘在手柄已经位于端点时继续往同方向走，拉一下再弹回来 */
  pulse: (side: ElasticSide) => void
}

/**
 * 橡皮筋过冲：指针拖出轨道后把轨道往那一侧拉长，松手用弹簧收回。
 * 全部走 MotionValue，拖动期间不触发 React 渲染；几何量自始至终只来自 Control 的矩形，
 * 所以缩放视觉层不会影响 Base UI 把指针换算成数值。
 */
function useElasticPull({
  elasticity,
  disabled = false,
  onEdge,
}: UseElasticPullOptions): ElasticPull {
  const reduced = useReducedMotion() ?? false
  const pull = useMotionValue(0)
  // 按下那一刻量到的轨道宽度，只用来把拉伸像素换算成缩放比例
  const width = useMotionValue(1)
  const scaleX = useTransform(
    () => 1 + Math.abs(pull.get()) / Math.max(1, width.get()),
  )
  const scaleY = useTransform(
    () =>
      1 -
      SQUASH_RATIO *
        clamp01(Math.abs(pull.get()) / Math.max(1, elasticity || 1)),
  )
  // 固定以中心为原点，再平移半个拉伸量：视觉上等于拉住一端，换边时不需要切换 transform-origin
  const x = useTransform(pull, (current) => current / 2)
  const startIconX = useTransform(pull, (current) => Math.min(0, current))
  const endIconX = useTransform(pull, (current) => Math.max(0, current))
  const startIconScale = useMotionValue(1)
  const endIconScale = useMotionValue(1)

  const [side, setSide] = React.useState<ElasticSide | null>(null)
  const sideRef = React.useRef<ElasticSide | null>(null)
  // 手势编号：每次按下 / 复位都 +1，弹簧完成时据此判断自己是不是已经被新手势取代
  const gestureRef = React.useRef(0)
  const springRef = React.useRef<AnimationPlaybackControls | null>(null)
  const detachRef = React.useRef<(() => void) | null>(null)
  // 窗口级监听里要读最新属性，用 ref 保存，免得每帧重建监听
  const optionsRef = React.useRef({ elasticity, reduced, onEdge })
  React.useEffect(() => {
    optionsRef.current = { elasticity, reduced, onEdge }
  })

  const setSideSafe = React.useCallback((next: ElasticSide | null) => {
    if (sideRef.current === next) return
    sideRef.current = next
    setSide(next)
  }, [])

  /** 停下正在跑的回弹、过冲归零，并让旧弹簧的完成回调失效。 */
  const reset = React.useCallback(() => {
    gestureRef.current += 1
    springRef.current?.stop()
    springRef.current = null
    pull.set(0)
    setSideSafe(null)
  }, [pull, setSideSafe])

  const recoil = React.useCallback(() => {
    const id = gestureRef.current
    springRef.current?.stop()
    springRef.current = animate(pull, 0, {
      ...RECOIL_SPRING,
      onComplete: () => {
        // 旧手势的弹簧到期时才回来：不许它动新手势的状态
        if (gestureRef.current !== id) return
        springRef.current = null
        setSideSafe(null)
      },
    })
  }, [pull, setSideSafe])

  const nudgeIcon = React.useCallback(
    (target: ElasticSide) => {
      if (reduced) return
      animate(target === "start" ? startIconScale : endIconScale, [1, 1.25, 1], {
        duration: 0.32,
        ease: "easeOut",
      })
    },
    [reduced, startIconScale, endIconScale],
  )

  const onPointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (disabled || event.button !== 0) return
      // 并发指针（另一根手指还按着）时只保留最新这一组：先把上一组的 window 监听解掉，
      // 否则 detachRef 会被覆盖，旧手势的 move/release 再也解不掉
      detachRef.current?.()
      // 新的手势开始：上一段回弹（上一次拖动或键盘脉冲留下的）立刻作废
      reset()
      const state = optionsRef.current
      if (state.reduced || state.elasticity <= 0) return
      // 用按下这一刻的 Control 矩形量过冲；Control 自己不缩放，之后一直有效
      const rect = event.currentTarget.getBoundingClientRect()
      width.set(Math.max(1, rect.width))
      const pointerId = event.pointerId
      const nudged = { start: false, end: false }

      const detach = () => {
        window.removeEventListener("pointermove", move)
        window.removeEventListener("pointerup", release)
        window.removeEventListener("pointercancel", release)
        window.removeEventListener("lostpointercapture", release)
        window.removeEventListener("blur", release)
        if (detachRef.current === detach) detachRef.current = null
      }
      // 松手、被系统取消、指针捕获丢失、窗口失焦都走这里；重复调用是安全的
      const release = (native: Event) => {
        if ("pointerId" in native) {
          const stale = native as PointerEvent
          if (stale.pointerId !== pointerId) return
        }
        detach()
        if (pull.get() === 0) setSideSafe(null)
        else recoil()
      }
      const move = (native: PointerEvent) => {
        if (native.pointerId !== pointerId) return
        const latest = optionsRef.current
        if (latest.reduced || latest.elasticity <= 0) return
        const beyondEnd = native.clientX - rect.right
        const beyondStart = rect.left - native.clientX
        const next = beyondEnd > 0 ? "end" : beyondStart > 0 ? "start" : null
        if (next === null) {
          setSideSafe(null)
          if (pull.get() !== 0) pull.set(0)
          return
        }
        // 拖动时别选中旁边的文字
        native.preventDefault()
        const stretch = rubberBand(
          Math.max(beyondEnd, beyondStart),
          latest.elasticity,
        )
        pull.set(next === "end" ? stretch : -stretch)
        setSideSafe(next)
        if (!nudged[next]) {
          nudged[next] = true
          nudgeIcon(next)
          latest.onEdge?.(next)
        }
      }

      window.addEventListener("pointermove", move, { passive: false })
      window.addEventListener("pointerup", release)
      window.addEventListener("pointercancel", release)
      window.addEventListener("lostpointercapture", release)
      window.addEventListener("blur", release)
      detachRef.current = detach
    },
    [disabled, reset, width, nudgeIcon, pull, recoil, setSideSafe],
  )

  const pulse = React.useCallback(
    (target: ElasticSide) => {
      if (reduced || elasticity <= 0) return
      reset()
      setSideSafe(target)
      nudgeIcon(target)
      pull.set(target === "end" ? elasticity * 0.4 : elasticity * -0.4)
      recoil()
    },
    [
      reduced,
      elasticity,
      reset,
      setSideSafe,
      nudgeIcon,
      pull,
      recoil,
    ],
  )

  // 拖动途中被禁用：立刻收手，别让 window 监听和回弹继续跑
  React.useEffect(() => {
    if (!disabled) return
    reset()
    detachRef.current?.()
  }, [disabled, reset])

  React.useEffect(
    () => () => {
      gestureRef.current += 1
      springRef.current?.stop()
      detachRef.current?.()
    },
    [],
  )

  return {
    pull,
    x,
    scaleX,
    scaleY,
    startIconX,
    endIconX,
    startIconScale,
    endIconScale,
    side,
    onPointerDown,
    pulse,
  }
}

export { useElasticPull }
export type { ElasticPull, ElasticSide, UseElasticPullOptions }
