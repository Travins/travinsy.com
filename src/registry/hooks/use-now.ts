"use client"

import * as React from "react"

// 全页面共用一个对齐整秒的定时器：多个时钟同时挂载也只有一个 setTimeout 在跑，
// 并且所有实例的秒数在同一帧跳动。
const listeners = new Set<() => void>()
let timer: number | undefined

function schedule() {
  timer = window.setTimeout(
    () => {
      listeners.forEach((listener) => listener())
      if (listeners.size) schedule()
    },
    1005 - (Date.now() % 1000),
  ) // 多等 5ms，避免定时器提前触发时读到上一秒
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  if (listeners.size === 1) schedule()
  return () => {
    listeners.delete(listener)
    if (!listeners.size) window.clearTimeout(timer)
  }
}

/**
 * 当前时间的毫秒时间戳，按 `step` 对齐（默认每秒）。
 * 服务端渲染与水合期间返回 `null`，水合完成后才给出真实时间，
 * 静态导出的 HTML 因此永远不会带着过期的时间。
 *
 * @param step 对齐粒度（毫秒）；快照不变时组件不会重新渲染，所以只显示分钟的组件传 `60_000` 即可
 */
function useNow(step = 1000): number | null {
  return React.useSyncExternalStore(
    subscribe,
    () => Math.floor(Date.now() / step) * step,
    () => null,
  )
}

export { useNow }
