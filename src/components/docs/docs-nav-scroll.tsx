"use client"

import * as React from "react"

/**
 * 侧栏条目的滚动容器。侧栏随页面一起渲染，切换页面会重新挂载、滚动归零；
 * 这里把滚动位置按分区存进 sessionStorage，挂载时在绘制前恢复，
 * 当前条目仍不在可视区时再把它滚到附近（首次进入、从别处跳进来都能看到当前项）。
 */
export function DocsNavScroll({
  section,
  children,
}: {
  section: string
  children: React.ReactNode
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const key = `docs-nav-scroll:${section}`

  React.useLayoutEffect(() => {
    const el = ref.current
    // 手机抽屉里的同一份导航不需要记忆位置，容器不可滚动时直接跳过
    if (!el || el.scrollHeight <= el.clientHeight) return
    const saved = Number(sessionStorage.getItem(key))
    if (saved > 0) el.scrollTop = saved
    const active = el.querySelector<HTMLElement>('[aria-current="page"]')
    if (active) {
      const box = el.getBoundingClientRect()
      const item = active.getBoundingClientRect()
      if (item.top < box.top || item.bottom > box.bottom)
        el.scrollTop += item.top - box.top - box.height / 3
    }
  }, [key])

  return (
    <div
      ref={ref}
      className="docs-nav-scroll"
      onScroll={(event) =>
        sessionStorage.setItem(key, String(event.currentTarget.scrollTop))
      }
    >
      {children}
    </div>
  )
}
