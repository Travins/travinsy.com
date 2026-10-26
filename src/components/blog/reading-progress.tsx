"use client"

import { useEffect, useRef } from "react"

/**
 * 阅读进度条：贴在页头底线上的 2px 主色细线，按正文（targetId）的滚动进度从左向右填充。
 *
 * - 主路径是纯 CSS 的滚动驱动动画（blog.css：view-timeline + animation-timeline），不跑 JS；
 * - 浏览器不支持 animation-timeline 时，退回到被动 scroll 监听 + rAF 节流，直接写 transform，
 *   没有任何过渡，因此「减少动态效果」下行为一致（本来就不做平滑）。
 * - 纯装饰：aria-hidden。滚动位置读屏用户已通过浏览器本身得知，让 progressbar 随滚动不停播报反而是干扰。
 */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (CSS.supports("animation-timeline: view()")) return
    const target = document.getElementById(targetId)
    const element = bar.current
    if (!target || !element) return

    let frame = 0
    const update = () => {
      frame = 0
      // 进度条下沿 = 页头底线 = 可视区的有效顶部
      const top = element.getBoundingClientRect().bottom
      const rect = target.getBoundingClientRect()
      // 0%：正文顶边到达页头下沿；100%：正文底边到达视口底部
      const distance = rect.height - (window.innerHeight - top)
      const progress =
        distance <= 0
          ? rect.top <= top
            ? 1
            : 0
          : Math.min(1, Math.max(0, (top - rect.top) / distance))
      element.style.transform = `scaleX(${progress})`
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule, { passive: true })
    const observer = new ResizeObserver(schedule)
    observer.observe(target)
    return () => {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [targetId])

  return (
    <div aria-hidden="true" className="reading-progress">
      <div ref={bar} className="reading-progress-bar" />
    </div>
  )
}
