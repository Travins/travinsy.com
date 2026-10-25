"use client"

import { useEffect, useState } from "react"

/** 根据访客当地时间问候，首屏使用一致的静态文案以避免水合差异。 */
export function Greeting({
  fallback = "你好",
  suffix = "，很高兴在这里遇见你。",
}: {
  /** 首屏与挂载前显示的静态文案，需保持中性以避免水合差异 */
  fallback?: string
  /** 问候语之后拼接的文本，默认带一个逗号 */
  suffix?: string
}) {
  const [greeting, setGreeting] = useState(fallback)
  useEffect(() => {
    const update = () => {
      const hour = new Date().getHours()
      setGreeting(
        hour >= 5 && hour < 11
          ? "早上好"
          : hour >= 11 && hour < 14
            ? "中午好"
            : hour >= 14 && hour < 18
              ? "下午好"
              : "晚上好",
      )
    }
    const first = window.setTimeout(update, 0)
    const timer = window.setInterval(update, 60_000)
    return () => {
      window.clearTimeout(first)
      window.clearInterval(timer)
    }
  }, [])
  return (
    <>
      {greeting}
      {suffix}
    </>
  )
}
