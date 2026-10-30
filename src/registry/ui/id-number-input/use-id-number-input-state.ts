"use client"

import * as React from "react"

import { useControllableState } from "@/registry/hooks/use-controllable-state"

import type { IdNumberInputProps } from "./types"
import { currentIdCardDate, normalizeIdNumber, sanitizeIdNumber } from "./utils"

// 服务端使用稳定快照；当前日期只在挂载后读取，并在跨日后重新校验。
function subscribeToDate(callback: () => void) {
  const timer = window.setInterval(callback, 60_000)
  return () => window.clearInterval(timer)
}
function serverDate() {
  return 0
}

/** 统一管理原始值、组合输入、光标恢复与所属表单的重置。 */
function useIdNumberInputState({
  kind,
  value: valueProp,
  defaultValue,
  onValueChange,
  form,
  inputRef,
}: Required<Pick<IdNumberInputProps, "kind" | "defaultValue">> &
  Pick<IdNumberInputProps, "value" | "onValueChange" | "form"> & {
    inputRef: React.RefObject<HTMLInputElement | null>
  }) {
  const today = React.useSyncExternalStore(
    subscribeToDate,
    currentIdCardDate,
    serverDate,
  )
  const initialValue = React.useRef(defaultValue)
  const [state, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: normalizeIdNumber(kind, defaultValue),
    onChange: onValueChange,
  })
  const value = normalizeIdNumber(kind, state)
  const [focused, setFocused] = React.useState(false)
  const [touched, setTouched] = React.useState(false)
  const composingRef = React.useRef(false)
  const [draft, setDraft] = React.useState<string | null>(null)
  const [caret, setCaret] = React.useState<{ position: number } | null>(null)
  React.useLayoutEffect(() => {
    const input = inputRef.current
    if (caret && input && document.activeElement === input)
      input.setSelectionRange(caret.position, caret.position)
  }, [caret, inputRef])

  const commit = (raw: string, rawCaret: number) => {
    const next = sanitizeIdNumber(kind, raw, rawCaret)
    setValue(next.value)
    setCaret({ position: next.caret })
  }
  const controlled = valueProp !== undefined
  const resetRef = React.useRef(() => {})
  React.useEffect(() => {
    resetRef.current = () => {
      setValue(normalizeIdNumber(kind, initialValue.current))
      setTouched(false)
      setDraft(null)
      composingRef.current = false
    }
  })
  React.useEffect(() => {
    const element = inputRef.current?.form
    if (!element || controlled) return
    let timer: ReturnType<typeof setTimeout> | undefined
    const reset = (event: Event) => {
      timer = setTimeout(() => {
        if (!event.defaultPrevented) resetRef.current()
      })
    }
    element.addEventListener("reset", reset)
    return () => {
      element.removeEventListener("reset", reset)
      clearTimeout(timer)
    }
  }, [controlled, form, inputRef])

  return {
    today,
    value,
    focused,
    setFocused,
    touched,
    setTouched,
    composingRef,
    draft,
    setDraft,
    setCaret,
    commit,
  }
}

export { useIdNumberInputState }
