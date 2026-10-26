"use client"

import { useEffect, useState } from "react"

/** 根据访客当地时间问候，首屏使用一致的静态文案以避免水合差异。 */
function Greeting({
  fallback = "你好",
  suffix = "，很高兴在这里遇见你。",
  morning = "早上好",
  noon = "中午好",
  afternoon = "下午好",
  evening = "晚上好",
}: {
  /**
   * 首屏与挂载前显示的静态文案，需保持中性以避免水合差异
   * @default "你好"
   */
  fallback?: string
  /**
   * 问候语之后拼接的文本
   * @default "，很高兴在这里遇见你。"
   */
  suffix?: string
  /**
   * 05:00–10:59 的问候语
   * @default "早上好"
   */
  morning?: string
  /**
   * 11:00–13:59 的问候语
   * @default "中午好"
   */
  noon?: string
  /**
   * 14:00–17:59 的问候语
   * @default "下午好"
   */
  afternoon?: string
  /**
   * 18:00–次日 04:59 的问候语
   * @default "晚上好"
   */
  evening?: string
}) {
  // 只保存小时数：挂载前为 null，用它区分服务端静态文案与客户端时段文案。
  const [hour, setHour] = useState<number | null>(null)
  useEffect(() => {
    const update = () => setHour(new Date().getHours())
    const first = window.setTimeout(update, 0)
    const timer = window.setInterval(update, 60_000)
    return () => {
      window.clearTimeout(first)
      window.clearInterval(timer)
    }
  }, [])
  const greeting =
    hour === null
      ? fallback
      : hour >= 5 && hour < 11
        ? morning
        : hour >= 11 && hour < 14
          ? noon
          : hour >= 14 && hour < 18
            ? afternoon
            : evening
  return (
    <span data-slot="greeting" data-state={hour === null ? "pending" : "ready"}>
      {greeting}
      {suffix}
    </span>
  )
}

export { Greeting }
