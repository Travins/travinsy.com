"use client"

import * as React from "react"
import type { AnyTunerConfig, TunerValues } from "./types"

/**
 * 通用调整面板的状态：开关、改动过的值、示例回报的初始值，以及要交给 Provider 的覆盖项。
 * 没有 config（该组件不支持调整）时返回关闭状态，覆盖项为空。
 */
export function useTuner(config?: AnyTunerConfig) {
  const [open, setOpen] = React.useState(false)
  const [values, setValues] = React.useState<TunerValues>({})
  const [base, setBase] = React.useState<TunerValues | null>(null)
  // 一个示例里可能有多个组件，只记第一个回报的值
  const onReport = React.useCallback(
    (report: unknown) =>
      setBase((prev) => prev ?? config?.fromReport(report) ?? null),
    [config],
  )
  const setOpenAndReset = React.useCallback((next: boolean) => {
    setOpen(next)
    if (!next) setBase(null)
  }, [])

  const tuning: Record<string, unknown> =
    open && config
      ? { ...config.frame, onReport, ...config.toTuning(values) }
      : {}
  // 没设置的项不覆盖，示例保留自己的值
  for (const key of Object.keys(tuning)) {
    if (tuning[key] === undefined) delete tuning[key]
  }
  return { open, setOpen: setOpenAndReset, values, setValues, base, tuning }
}
