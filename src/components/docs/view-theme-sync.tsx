"use client"
import { useEffect } from "react"
import {
  COLOR_THEME_STORAGE_KEY,
  DEFAULT_COLOR_THEME,
  isColorTheme,
} from "@/lib/themes"

/**
 * iframe 内的颜色主题同步：初始值由根布局的内联脚本读取 localStorage；
 * 父页面切换主题时，同源的 storage 事件会通知到这里。
 * 亮暗模式由 next-themes 自己监听 storage，无需处理。
 */
export function ViewThemeSync() {
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== COLOR_THEME_STORAGE_KEY) return
      document.documentElement.setAttribute(
        "data-theme",
        isColorTheme(event.newValue) ? event.newValue : DEFAULT_COLOR_THEME,
      )
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])
  return null
}
