import {
  ValueSliderTuningContext,
  type ValueSliderReport,
  type ValueSliderSize,
  type ValueSliderTuning,
} from "@/registry/ui/value-slider/value-slider"
import { toneOptions } from "./swatches"
import { defineTuner } from "./types"

/**
 * 数值滑块的调整面板：过冲、尺寸、刻度、色调与三个开关。
 * 示例把每条滑块放在固定高度的插槽里，所以 `size` 换档时画框高度不变。
 * 音效开关只打开组件自己的播放，是否真的出声仍受站点静音偏好（`useValueSliderMuted`）控制。
 */

const SIZES: { value: ValueSliderSize; label: string }[] = [
  { value: "sm", label: "sm" },
  { value: "default", label: "default" },
  { value: "lg", label: "lg" },
]

export const valueSliderTuner = defineTuner<
  ValueSliderTuning,
  ValueSliderReport
>({
  hint: "调整过冲强度、尺寸、色调与刻度",
  context: ValueSliderTuningContext,
  controls: [
    {
      key: "elasticity",
      type: "slider",
      label: "过冲 elasticity",
      min: 0,
      max: 32,
      unit: "px",
    },
    { key: "size", type: "segmented", label: "尺寸 size", options: SIZES },
    { key: "ticks", type: "slider", label: "刻度 ticks", min: 0, max: 10 },
    {
      key: "tone",
      type: "segmented",
      label: "色调 tone",
      span: 3,
      options: toneOptions(),
    },
    { key: "snapToTicks", type: "switch", label: "磁吸 snapToTicks" },
    { key: "showValue", type: "switch", label: "读数 showValue" },
    { key: "sound", type: "switch", label: "音效 sound" },
  ],
  defaults: {
    elasticity: 12,
    size: "default",
    ticks: 0,
    snapToTicks: false,
    showValue: true,
    sound: false,
  },
  fromReport: (report) => ({
    ...report,
    // 示例用显式刻度数组时没有「段数」可报（ticks 为 undefined），面板回落到 defaults 的 0
    ticks: report.ticks,
    // 示例没传 tone（用前景色）时，面板显示为「主题」那个不上色的选项
    tone: report.tone === undefined ? "theme" : report.tone,
  }),
  toTuning: (values) => ({
    elasticity: values.elasticity as number | undefined,
    size: values.size as ValueSliderSize | undefined,
    // 0 表示不画刻度：组件的 resolveTicks 对小于 2 的段数返回空数组，也顺带关掉磁吸目标
    ticks: values.ticks as number | undefined,
    snapToTicks: values.snapToTicks as boolean | undefined,
    showValue: values.showValue as boolean | undefined,
    sound: values.sound as boolean | undefined,
    tone:
      values.tone === undefined
        ? undefined
        : values.tone === "theme"
          ? false
          : (values.tone as string),
  }),
})
