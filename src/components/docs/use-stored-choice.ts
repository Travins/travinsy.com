"use client"
import { useCallback, useSyncExternalStore } from "react"

const listeners = new Set<() => void>()

/**
 * 记住用户在 localStorage 里的单选项（包管理器、安装来源等），全站共享。
 * 服务端与首次水合都使用 fallback，水合后再同步为存储值，不会产生水合差异。
 */
export function useStoredChoice<T extends string>(
  key: string,
  values: readonly T[],
  fallback: T,
) {
  const subscribe = useCallback((onChange: () => void) => {
    listeners.add(onChange)
    window.addEventListener("storage", onChange)
    return () => {
      listeners.delete(onChange)
      window.removeEventListener("storage", onChange)
    }
  }, [])
  const getSnapshot = () => {
    try {
      const stored = localStorage.getItem(key) as T | null
      return stored && values.includes(stored) ? stored : fallback
    } catch {
      return fallback
    }
  }
  const value = useSyncExternalStore(subscribe, getSnapshot, () => fallback)
  const setValue = (next: T) => {
    try {
      localStorage.setItem(key, next)
    } catch {
      // 隐私模式下写入失败：仍然通知订阅者，至少本页内生效
    }
    listeners.forEach((listener) => listener())
  }
  return [value, setValue] as const
}
