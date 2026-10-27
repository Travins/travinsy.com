"use client"

import * as React from "react"

type CardStackMode = "auto" | "drag"
type CardStackLabels = {
  previous: string
  next: string
  pause: string
  play: string
  card: string
  carousel: string
  slide: string
}
const DEFAULT_LABELS: CardStackLabels = {
  carousel: "轮播",
  slide: "幻灯片",
  previous: "上一张",
  next: "下一张",
  pause: "暂停轮换",
  play: "继续轮换",
  card: "卡片",
}
const CardStackContext = React.createContext<{
  index: number
  count: number
  mode: CardStackMode
  paused: boolean
  labels: CardStackLabels
  setPaused: React.Dispatch<React.SetStateAction<boolean>>
  go: (index: number) => void
} | null>(null)

function useCardStack() {
  const context = React.useContext(CardStackContext)
  if (!context) throw new Error("CardStackControls 必须放在 CardStack 内")
  return context
}

// Motion 的偏好 hook 只读取初始值；这里订阅变更，切换系统设置后立即生效。
function subscribeReducedMotion(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)")
  media.addEventListener("change", callback)
  return () => media.removeEventListener("change", callback)
}
function reducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}
function serverReducedMotionSnapshot() {
  return true
}
function useCardStackReducedMotion() {
  return React.useSyncExternalStore(
    subscribeReducedMotion,
    reducedMotionSnapshot,
    serverReducedMotionSnapshot,
  )
}

export {
  CardStackContext,
  DEFAULT_LABELS,
  useCardStack,
  useCardStackReducedMotion,
}
export type { CardStackMode, CardStackLabels }
