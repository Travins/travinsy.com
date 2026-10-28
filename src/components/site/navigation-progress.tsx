"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

/** 超过这个时长仍没完成的站内跳转才亮起进度线；预取命中时跳转几乎瞬间完成，不会出现 */
const SHOW_AFTER = 200
/** 兜底：链接被其他处理器拦下、页面始终没变时，过一段时间自动熄灭 */
const GIVE_UP_AFTER = 8000

/**
 * 站内跳转进度线：页头底边一条 1px 主题色细线。
 * 静态导出没有服务端等待，只有慢网下预取未命中的跳转才会慢，所以只在点击站内链接 200ms 后仍未完成时显示，
 * 路径变化后熄灭。用捕获阶段监听点击，不干预 Link 自身的预取与跳转。
 */
function NavigationProgress() {
  const pathname = usePathname()
  const line = useRef<HTMLDivElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => {
    clearTimeout(timer.current)
    line.current?.setAttribute("data-pending", "false")
  }, [pathname])
  useEffect(() => {
    function click(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return
      const anchor = (event.target as Element).closest?.("a")
      if (!anchor || anchor.target || anchor.hasAttribute("download")) return
      const url = new URL(anchor.href)
      if (url.origin !== location.origin || url.pathname === location.pathname)
        return
      clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        line.current?.setAttribute("data-pending", "true")
        timer.current = setTimeout(
          () => line.current?.setAttribute("data-pending", "false"),
          GIVE_UP_AFTER,
        )
      }, SHOW_AFTER)
    }
    document.addEventListener("click", click, true)
    return () => {
      document.removeEventListener("click", click, true)
      clearTimeout(timer.current)
    }
  }, [])
  return (
    <div
      ref={line}
      data-slot="navigation-progress"
      data-pending="false"
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-primary opacity-0 transition-opacity duration-150 data-[pending=true]:opacity-100 motion-reduce:transition-none"
    />
  )
}
export { NavigationProgress }
