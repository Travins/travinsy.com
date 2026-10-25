"use client"

import * as React from "react"

type UseControllableStateParams<T> = {
  /** 受控值；传入后组件不再维护内部状态 */
  prop?: T
  /** 非受控时的初始值 */
  defaultProp: T
  /** 值变化时回调（受控与非受控都会触发） */
  onChange?: (value: T) => void
}

/**
 * 同时支持受控与非受控的状态 hook。
 * 约定见 component-conventions 技能第 4 节：open/defaultOpen/onOpenChange 等成对 props 都用它实现。
 */
function useControllableState<T>({
  prop,
  defaultProp,
  onChange,
}: UseControllableStateParams<T>) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultProp)
  const isControlled = prop !== undefined
  const value = isControlled ? prop : uncontrolled

  // 用 ref 保存最新的回调和值，保证 setValue 引用稳定
  const onChangeRef = React.useRef(onChange)
  const valueRef = React.useRef(value)
  React.useEffect(() => {
    onChangeRef.current = onChange
    valueRef.current = value
  })

  const setValue = React.useCallback(
    (next: React.SetStateAction<T>) => {
      const resolved =
        typeof next === "function"
          ? (next as (prev: T) => T)(valueRef.current)
          : next
      if (Object.is(resolved, valueRef.current)) return
      valueRef.current = resolved
      if (!isControlled) setUncontrolled(resolved)
      onChangeRef.current?.(resolved)
    },
    [isControlled],
  )

  return [value, setValue] as const
}

export { useControllableState }
