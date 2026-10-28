import {
  FlowDiagramTuningContext,
  type FlowBackgroundName,
  type FlowDiagramReport,
  type FlowDiagramTuning,
} from "@/registry/ui/flow-diagram/flow-diagram"
import { toneOptions } from "./swatches"
import { defineTuner } from "./types"

/**
 * 流程动画的调整面板：速度、默认色调、底纹，以及渐隐、循环与暂停。
 * 外框与设计画布大小不随参数变化；色调只改默认色调，节点和光束自己指定的 `tone` 不受影响。
 * 「循环」关掉后只播一遍，停在静帧；再打开即从头重播。
 */

export const flowDiagramTuner = defineTuner<
  FlowDiagramTuning,
  FlowDiagramReport
>({
  hint: "调整速度、色调与底纹",
  component: "FlowDiagram",
  context: FlowDiagramTuningContext,
  examples: {
    // 五张图并排对比五种背景
    "flow-diagram-background-demo": { omit: ["background"] },
    // 每个节点演示一种色调
    "flow-diagram-tones-demo": { omit: ["tone"] },
    // 示例要演示的就是自定义品牌色
    "flow-diagram-brand-demo": { omit: ["tone"] },
    // 示例自带播放、倍速与循环控件
    "flow-diagram-playback-demo": { omit: ["speed", "loop", "paused"] },
  },
  controls: [
    {
      key: "speed",
      type: "slider",
      label: "速度 speed",
      unit: "×",
      min: 0.25,
      max: 4,
      step: 0.05,
    },
    {
      key: "background",
      type: "segmented",
      label: "底纹 background",
      span: 2,
      options: [
        { value: "dots", label: "点阵" },
        { value: "grid", label: "方格" },
        { value: "lines", label: "横线" },
        { value: "hatch", label: "斜纹" },
        { value: "none", label: "无" },
      ],
    },
    {
      key: "tone",
      type: "tone",
      label: "默认色调 tone",
      options: toneOptions().filter((option) => option.value !== "theme"),
    },
    { key: "fade", type: "switch", label: "底纹渐隐 fade" },
    { key: "loop", type: "switch", label: "循环 loop" },
    { key: "paused", type: "switch", label: "暂停 paused" },
  ],
  defaults: { speed: 1, fade: true, loop: true, paused: false },
  fromReport: (report) => ({
    speed: report.speed,
    tone: report.tone,
    // 自定义底纹元素没有名字，不高亮任何选项
    background: report.background ?? "",
    fade: report.fade,
    loop: report.loop,
    paused: report.paused,
  }),
  toTuning: (values) => ({
    speed: values.speed as number | undefined,
    tone: values.tone as string | undefined,
    background: values.background as FlowBackgroundName | undefined,
    fade: values.fade as boolean | undefined,
    loop: values.loop as boolean | undefined,
    paused: values.paused as boolean | undefined,
  }),
})
