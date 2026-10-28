import {
  ShuffleGridTuningContext,
  type ShuffleGridReport,
  type ShuffleGridTuning,
  type ShuffleGridVariant,
} from "@/registry/ui/shuffle-grid/shuffle-grid"
import { defineTuner } from "./types"

/**
 * 动态格的调整面板：换位间隔、在场数、点亮数、盘面外观与暂停。
 * 打开时启用固定外框（stableFrame）：切换盘面外观（间距不同）后整块盘面的宽高比不变，容器大小不变。
 * 有分类（`groups`）的示例由分类决定谁在场，「在场数」不起作用。
 */

export const shuffleGridTuner = defineTuner<
  ShuffleGridTuning,
  ShuffleGridReport
>({
  hint: "调整间隔、点亮数与盘面",
  component: "ShuffleGrid",
  context: ShuffleGridTuningContext,
  frame: { stableFrame: true },
  controls: [
    {
      key: "interval",
      type: "slider",
      label: "换位间隔 interval",
      unit: "ms",
      min: 200,
      max: 4000,
      step: 100,
    },
    {
      key: "activeCount",
      type: "slider",
      label: "在场数 activeCount",
      min: 1,
      max: 36,
    },
    {
      key: "litCount",
      type: "slider",
      label: "点亮数 litCount",
      min: 1,
      max: 36,
    },
    {
      key: "variant",
      type: "segmented",
      label: "盘面 variant",
      span: 3,
      options: [
        { value: "lines", label: "线格 lines" },
        { value: "tiles", label: "圆角格 tiles" },
        { value: "pixels", label: "像素块 pixels" },
      ],
    },
    { key: "paused", type: "switch", label: "暂停 paused" },
  ],
  defaults: { interval: 1600, activeCount: 5, litCount: 2, paused: false },
  fromReport: (report) => ({
    interval: report.interval,
    activeCount: report.activeCount,
    litCount: report.litCount,
    variant: report.variant,
    paused: report.paused,
  }),
  toTuning: (values) => ({
    interval: values.interval as number | undefined,
    activeCount: values.activeCount as number | undefined,
    litCount: values.litCount as number | undefined,
    variant: values.variant as ShuffleGridVariant | undefined,
    paused: values.paused as boolean | undefined,
  }),
})
