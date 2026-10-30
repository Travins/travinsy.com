import type * as React from "react"

import type { RegionPickerLabels } from "./config"

/**
 * 省市区选择认的数据结构：任何符合它的树都能用。
 * 组件不绑定具体数据，china-regions 只是一份可选的官方数据。
 */
type RegionOption = {
  /** 全树唯一的代码，也是组件对外的值（行政区划用 6 位国标码） */
  code: string
  /** 显示名称 */
  name: string
  /** 无声调拼音，音节用空格分隔（`hang zhou shi`）；没有时搜索只按名称和代码 */
  pinyin?: string
  /** 下级；没有或为空数组表示末级 */
  children?: RegionOption[]
}

/** 地区数据，或首次需要时才调用的异步加载函数 */
type RegionsSource = RegionOption[] | (() => Promise<RegionOption[]>)

type RegionPickerSize = "sm" | "default" | "lg"

type RegionPickerProps = Omit<
  React.ComponentProps<"button">,
  | "value"
  | "defaultValue"
  | "onChange"
  | "type"
  | "name"
  | "form"
  | "children"
  | "placeholder"
> & {
  /**
   * 地区数据。传数组直接使用（请保持引用稳定）；
   * 传函数则惰性加载：首次打开浮层、或有初始值需要显示路径时才调用，且只调用一次。
   */
  regions: RegionsSource
  /** 已选地区的代码（最末一级）；`null` 表示未选。受控时传入 */
  value?: string | null
  /**
   * 非受控时的初始代码
   * @default null
   */
  defaultValue?: string | null
  /** 选中变化时回调：最末一级代码（清除时为 `null`）与从最顶层到它的完整路径 */
  onValueChange?: (code: string | null, path: RegionOption[]) => void
  /** 最多选到第几级（从 1 数）；到达这一级的节点视为末级，不再展开下级 */
  depth?: number
  /**
   * 是否允许选中非末级节点就确认（如只选到「浙江省」）；
   * 开启后浏览到非顶层时底部出现确认按钮
   * @default false
   */
  allowPartial?: boolean
  /** 随表单提交的字段名，提交的是最末一级的代码，未选时为空串 */
  name?: string
  /** 关联到另一个表单的 id，同 `<input form>` */
  form?: string
  /** 未选时拦住表单提交 */
  required?: boolean
  disabled?: boolean
  /** 未选时触发器显示的提示，默认取 `labels.placeholder` */
  placeholder?: string
  /**
   * 代码在数据里找不到时（地区被撤销、数据版本不同）触发器显示的名称，
   * 通常是调用方保存数据时一并存下的名称；不传则显示「未知地区（代码）」
   */
  fallbackLabel?: string
  /**
   * 触发器高度档位：28 / 32 / 36px
   * @default "default"
   */
  size?: RegionPickerSize
  /**
   * 选择面板的形态：`auto` 在手机与触屏设备上用底部面板、桌面用下拉浮层；
   * `sheet` / `popover` 固定其中一种
   * @default "auto"
   */
  presentation?: "auto" | "sheet" | "popover"
  /**
   * 底部面板挂载到哪个元素里，默认 `document.body`。
   * 传入后面板只盖住这个元素（元素需要 `position: relative` 与 `overflow: hidden`），也不锁定整页滚动；
   * 用于把选择器放进手机外框、预览窗格这类局部区域
   */
  container?: HTMLElement | React.RefObject<HTMLElement | null> | null
  /** 浮层是否打开，受控时传入 */
  open?: boolean
  /**
   * 非受控时浮层初始是否打开
   * @default false
   */
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** 覆盖用户可见文案 */
  labels?: Partial<RegionPickerLabels>
}

export type { RegionOption, RegionPickerProps, RegionPickerSize, RegionsSource }
