import type { Context, ReactNode } from "react"

/**
 * 调整面板的声明式描述。
 * 每个可调组件在 `tuner/<name>.tsx` 里声明一份 TunerConfig：有哪些控件、怎么把面板的值变成
 * 组件导出的覆盖项（Tuning）、怎么把示例回报的实际取值（Report）变成面板的初始显示。
 */

export type TunerValue = number | string | boolean
/** 面板的值：键是控件的 `key`，没出现的键表示“没改动，沿用示例自己的值”。 */
export type TunerValues = Partial<Record<string, TunerValue>>

type ControlBase = {
  key: string
  label: string
  /** 在三列网格里占几列，默认 1。开关不受此影响，统一排在最后一行。 */
  span?: 1 | 2 | 3
}

export type SliderControl = ControlBase & {
  type: "slider"
  min: number
  max: number
  /** 默认 1 */
  step?: number
  unit?: string
}

export type SegmentedOption = {
  value: string
  label: string
  /** 选项前的小样（材质方块、色点等） */
  swatch?: ReactNode
}

export type SegmentedControl = ControlBase & {
  type: "segmented"
  options: SegmentedOption[]
}

export type SwitchControl = ControlBase & { type: "switch" }

export type TunerControl = SliderControl | SegmentedControl | SwitchControl

export type TunerConfig<
  Tuning extends { onReport?: (report: Report) => void },
  Report,
> = {
  /** 开关按钮的悬停提示 */
  hint: string
  controls: TunerControl[]
  /** 示例还没回报时的显示值，以及示例不回报的项的默认值 */
  defaults: TunerValues
  /** 组件导出的覆盖 Context，Provider 由框架挂载 */
  context: Context<Tuning>
  /** 面板打开期间始终生效的覆盖项（如固定画框） */
  frame?: Partial<Tuning>
  /** 示例回报的实际取值 → 各控件的显示值 */
  fromReport: (report: Report) => TunerValues
  /** 面板里改动过的值 → 覆盖项；值缺失的键返回 undefined（框架会剔除） */
  toTuning: (values: TunerValues) => Partial<Tuning>
}

/** 按组件名登记时擦掉泛型 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyTunerConfig = TunerConfig<any, any>

export function defineTuner<
  Tuning extends { onReport?: (report: Report) => void },
  Report,
>(config: TunerConfig<Tuning, Report>): AnyTunerConfig {
  return config as unknown as AnyTunerConfig
}
