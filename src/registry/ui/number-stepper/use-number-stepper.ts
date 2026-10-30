"use client"

import * as React from "react"

import type { NumberStepperProps } from "./types"

/** 合并一次操作中的快速变更；回滚基准是这批操作开始前的值。 */
function useNumberStepper({
  value: valueProp,
  defaultValue = null,
  onValueChange,
  onValueCommit,
  onCommitError,
}: NumberStepperProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const value = valueProp === undefined ? internalValue : valueProp
  const [pending, setPending] = React.useState(false)
  const [commitError, setCommitError] = React.useState<{
    cause: unknown
  } | null>(null)
  const current = React.useRef(value)
  const batch = React.useRef<{ before: number | null } | null>(null)
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  )
  const generation = React.useRef(0)
  const busy = React.useRef(false)

  React.useEffect(() => {
    // 外部替换值时，旧请求的结果不能覆盖新值。
    if (current.current !== value) {
      clearTimeout(timer.current)
      generation.current += 1
      batch.current = null
      busy.current = false
      setPending(false)
    }
    current.current = value
  }, [value])

  React.useEffect(() => {
    return () => {
      clearTimeout(timer.current)
      generation.current += 1
    }
  }, [])

  function update(next: number | null) {
    current.current = next
    setInternalValue(next)
    onValueChange?.(next)
  }

  function change(next: number | null) {
    if (busy.current) return
    clearTimeout(timer.current)
    if (next === current.current) return
    batch.current ??= { before: current.current }
    setCommitError(null)
    update(next)
  }

  function commit(next: number | null) {
    if (busy.current) return
    clearTimeout(timer.current)
    change(next)
    const transaction = batch.current
    if (!transaction) return
    if (transaction.before === next) {
      batch.current = null
      return
    }
    timer.current = setTimeout(async () => {
      batch.current = null
      const request = ++generation.current
      const fail = (error: unknown) => {
        if (request !== generation.current) return
        update(transaction.before)
        setCommitError({ cause: error })
        onCommitError?.(error)
      }
      try {
        const result = onValueCommit?.(next)
        if (result && typeof result.then === "function") {
          busy.current = true
          setPending(true)
          await result
        }
      } catch (error) {
        fail(error)
      } finally {
        if (request === generation.current) {
          busy.current = false
          setPending(false)
        }
      }
    }, 400)
  }

  function reset() {
    clearTimeout(timer.current)
    generation.current += 1
    batch.current = null
    busy.current = false
    setPending(false)
    setCommitError(null)
    update(defaultValue)
  }

  return { value, pending, commitError, change, commit, reset }
}

export { useNumberStepper }
