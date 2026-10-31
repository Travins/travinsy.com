import type * as React from "react"

type BarSelectOption = {
  value: string
  label: React.ReactNode
  textValue?: string
  group?: string
  count?: number
  icon?: React.ReactNode
  disabled?: boolean
}
type BarSelectLabels = {
  clear: string
  search: string
  empty: string
  selected: (count: number) => string
  remove: (label: string) => string
  done: string
}
type Common = Omit<React.ComponentProps<"div">, "defaultValue" | "onChange"> & {
  /** 可选项 */
  options: BarSelectOption[]
  /** 可见标签；省略时必须提供 aria-label */
  label?: React.ReactNode
  /** 空值占位 */
  placeholder?: string
  /** 搜索开关；默认超过 8 项开启 */
  searchable?: boolean
  /** 显示清除 @default true */
  clearable?: boolean
  /** 高度档 @default "default" */
  size?: "sm" | "default" | "lg"
  error?: React.ReactNode
  description?: React.ReactNode
  name?: string
  form?: string
  disabled?: boolean
  labels?: Partial<BarSelectLabels>
  /** 弹层（含触屏底部面板）的额外类名，例如在紧凑工具栏里统一缩小字号 */
  contentClassName?: string
}
type BarSelectProps = Common &
  (
    | {
        multiple?: false
        value?: string | null
        defaultValue?: string | null
        onValueChange?: (value: string | null) => void
      }
    | {
        multiple: true
        value?: string[]
        defaultValue?: string[]
        onValueChange?: (value: string[]) => void
        display?: "summary" | "first-plus" | "chips"
      }
  )
export type { BarSelectOption, BarSelectLabels, BarSelectProps }
