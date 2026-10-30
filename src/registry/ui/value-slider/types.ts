import type { Slider as SliderPrimitive } from "@base-ui/react/slider"
import type * as React from "react"

import type { FlowTone } from "@/registry/lib/flow-tone"

type ValueSliderValue = number | readonly number[]
type ValueSliderSize = "sm" | "default" | "lg"
type ValueSliderLabelPlacement = "inside" | "outside"
type ValueSliderVariant = "bar" | "compact" | "slim"

type ValueSliderProps<Value extends ValueSliderValue = number> = Omit<
  SliderPrimitive.Root.Props<Value>,
  | "aria-label"
  | "children"
  | "className"
  | "defaultValue"
  | "disabled"
  | "format"
  | "largeStep"
  | "locale"
  | "max"
  | "min"
  | "minStepsBetweenValues"
  | "name"
  | "onValueChange"
  | "onValueCommitted"
  | "orientation"
  | "render"
  | "step"
  | "style"
  | "thumbAlignment"
  | "value"
> & {
  /** 受控值。传数组即为区间，数组长度决定手柄数量 */
  value?: Value
  /** 非受控时的初始值；不传时取 `min` */
  defaultValue?: Value
  /**
   * 最小值
   * @default 0
   */
  min?: number
  /**
   * 最大值
   * @default 100
   */
  max?: number
  /**
   * 步长，读数的默认小数位也随之变化
   * @default 1
   */
  step?: number
  /**
   * PageUp / PageDown 与 Shift + 方向键的步长
   * @default 10
   */
  largeStep?: number
  /**
   * 区间模式下两个手柄之间至少相隔几个 `step`，也参与磁吸后的合法性判断
   * @default 0
   */
  minStepsBetweenValues?: number
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean
  /** 提交到表单时使用的字段名；不传时不生成表单字段 */
  name?: string
  /** 值变化时回调（拖动、键盘、点击轨道都会触发） */
  onValueChange?: (value: Value) => void
  /** 值提交时回调（松手、键盘操作结束） */
  onValueCommitted?: (value: Value) => void
  className?: string
  style?: React.CSSProperties
  /** 数字格式化选项，交给 `Intl.NumberFormat`；不传时按 `locale` 与 `step` 推导 */
  format?: Intl.NumberFormatOptions
  /**
   * 数字格式化的区域，`format` 与默认读数都用它
   * @default "zh-CN"
   */
  locale?: Intl.LocalesArgument
  /** 读屏名称，优先于 `label`；都不传时手柄名称是「数值」 */
  "aria-label"?: string
  /** 标签；是字符串时同时作为手柄的读屏名称 */
  label?: React.ReactNode
  /**
   * 标签与读数的位置：`inside` 放在轨道内两端，`outside` 放在轨道上方一行
   * @default "inside"
   */
  labelPlacement?: ValueSliderLabelPlacement
  /**
   * 已缓冲到的值（例如视频已加载到第 N 秒），在已选填充下面画一段次级填充；仅单值模式生效
   */
  buffer?: number
  /** 读数与 `aria-valuetext` 的格式化函数，优先于 `format` */
  formatValue?: (value: number) => string
  /**
   * 是否显示读数。区间时显示为 `起点 – 终点`
   * @default true
   */
  showValue?: boolean
  /** 轨道左端外的图标，随左侧过冲平移 */
  startIcon?: React.ReactNode
  /** 轨道右端外的图标，随右侧过冲平移 */
  endIcon?: React.ReactNode
  /**
   * 轨道内的刻度线。数字表示等分段数（画 n - 1 条内部刻度线），数组表示显式刻度值；
   * 同时决定 `snapToTicks` 的吸附目标。建议刻度落在 `step` 上，不在的会对齐到最近的 `step`
   */
  ticks?: number | readonly number[]
  /**
   * 指针松手时（拖动或点击轨道）若与最近刻度的距离不超过范围的 3%，吸到该刻度并触发 `onValueChange`；
   * 键盘逐步移动不吸附
   * @default false
   */
  snapToTicks?: boolean
  /**
   * 拖出轨道两端时的最大过冲像素，`0` 关闭弹性
   * @default 12
   */
  elasticity?: number
  /**
   * 尺寸档，与 `variant` 一起决定轨道高度：
   * `bar` 为 sm 28px / default 32px / lg 36px，`compact` 为 18 / 22 / 24px，`slim` 为 6 / 8 / 10px
   * @default "default"
   */
  size?: ValueSliderSize
  /**
   * 轨道高度档，三档都是同一种方条：`bar` 高轨，标签与读数在轨道里；
   * `compact` 中等高度，文字仍在轨道里、字号收到 xs；
   * `slim` 矮轨，标签与读数移到轨道上方（此时忽略 `labelPlacement`），竖线手柄比轨道高出一截
   * @default "bar"
   */
  variant?: ValueSliderVariant
  /**
   * 色调：填充取 `--flow-tone` 的淡色（`slim` 加深一档），手柄取实色；不传时用前景色
   */
  tone?: FlowTone
  /**
   * 读数可直接输入：点读数（或在手柄上按回车）换成输入框，回车 / 失焦提交，Esc 放弃。
   * 输入值会夹在 `min`–`max` 之间并对齐到 `step`；区间模式下不可输入
   * @default false
   */
  editable?: boolean
  /**
   * 标记为「已改动」：标签与读数改用前景色，根元素带 `data-modified`。
   * 控制面板里用来区分改过的参数与默认值
   * @default false
   */
  modified?: boolean
  /**
   * 拖动时是否有刻度与碰边的音效（尊重本地静音偏好）
   * @default false
   */
  sound?: boolean
}

type ValueSliderTuning = Partial<
  Pick<
    ValueSliderProps,
    | "elasticity"
    | "size"
    | "variant"
    | "ticks"
    | "snapToTicks"
    | "showValue"
    | "sound"
  >
> & {
  /** `false` 表示去掉色调 */
  tone?: FlowTone | false
  /** 回报示例自己的实际取值（未被覆盖前），面板据此显示当前值 */
  onReport?: (report: ValueSliderReport) => void
}

type ValueSliderReport = {
  elasticity: number
  size: ValueSliderSize
  variant: ValueSliderVariant
  tone: FlowTone | undefined
  /** 示例用显式刻度数组时回报 `undefined`，面板显示默认的 0 */
  ticks: number | undefined
  snapToTicks: boolean
  showValue: boolean
  sound: boolean
}

export type {
  ValueSliderLabelPlacement,
  ValueSliderProps,
  ValueSliderReport,
  ValueSliderSize,
  ValueSliderTuning,
  ValueSliderValue,
  ValueSliderVariant,
}
