"use client"

import { useCallback, useSyncExternalStore } from "react"

import {
  COLOR_THEME_STORAGE_KEY,
  COLOR_THEMES,
  type ColorThemeId,
  DEFAULT_COLOR_THEME,
  isColorTheme,
} from "@/lib/themes"

const CHANGE_EVENT = "color-theme-change"

function subscribe(onChange: () => void) {
  // 其他标签页修改时同步到当前页面的 <html>
  const onStorage = (event: StorageEvent) => {
    if (event.key !== COLOR_THEME_STORAGE_KEY) return
    const next = isColorTheme(event.newValue) ? event.newValue : DEFAULT_COLOR_THEME
    document.documentElement.setAttribute("data-theme", next)
    onChange()
  }
  window.addEventListener(CHANGE_EVENT, onChange)
  window.addEventListener("storage", onStorage)
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange)
    window.removeEventListener("storage", onStorage)
  }
}

// 以 <html data-theme> 为准：首帧内联脚本已经写好
function getSnapshot(): ColorThemeId {
  const current = document.documentElement.getAttribute("data-theme")
  return isColorTheme(current) ? current : DEFAULT_COLOR_THEME
}

function getServerSnapshot(): ColorThemeId {
  return DEFAULT_COLOR_THEME
}

function applyColorTheme(id: ColorThemeId) {
  document.documentElement.setAttribute("data-theme", id)
  try {
    localStorage.setItem(COLOR_THEME_STORAGE_KEY, id)
  } catch {
    // 隐私模式等场景下写入失败，忽略即可
  }
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

/** 读取 / 设置当前颜色主题（与亮暗模式无关）。 */
export function useColorTheme(): {
  theme: ColorThemeId
  setTheme: (id: ColorThemeId) => void
  themes: typeof COLOR_THEMES
} {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const setTheme = useCallback((id: ColorThemeId) => applyColorTheme(id), [])
  return { theme, setTheme, themes: COLOR_THEMES }
}
