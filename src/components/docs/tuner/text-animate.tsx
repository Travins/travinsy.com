import {
  TextAnimateTuningContext,
  type TextAnimateTuning,
  type TextAnimateReport,
} from "@/registry/ui/text-animate/text-animate"
import { defineTuner } from "./types"
import { toneOptions } from "./swatches"

export const textAnimateTuner = defineTuner<
  TextAnimateTuning,
  TextAnimateReport
>({
  hint: "实时调整示例参数",
  context: TextAnimateTuningContext,
  examples: {
    // 四种动效各自的色调与参数不同；示例自带暂停按钮
    "text-animate-demo": { omit: ["tone", "by", "duration", "paused"] },
    // 两处轮换一处带色调、节奏不同；示例自带暂停按钮
    "text-animate-flip-demo": { omit: ["tone", "interval", "paused"] },
    // 三行分别演示三种字符集
    "text-animate-scramble-demo": { omit: ["charset"] },
    // 几处高亮各用一种色调
    "text-animate-highlight-demo": { omit: ["tone"] },
    // 只有逐词显现一处指定了 by
    "text-animate-mixed-demo": { omit: ["by"] },
  },
  controls: [
    {
      key: "interval",
      type: "slider",
      label: "轮换间隔 interval",
      min: 800,
      max: 6000,
      step: 100,
      unit: "ms",
    },
    {
      key: "by",
      type: "segmented",
      label: "显现单位 by",
      options: [
        { value: "char", label: "逐字" },
        { value: "word", label: "逐词" },
      ],
    },
    {
      key: "stagger",
      type: "slider",
      label: "错峰 stagger",
      min: 0,
      max: 150,
      step: 5,
      unit: "ms",
    },
    {
      key: "duration",
      type: "slider",
      label: "解码时长 duration",
      min: 100,
      max: 3000,
      step: 100,
      unit: "ms",
    },
    {
      key: "charset",
      type: "segmented",
      label: "解码字符 charset",
      span: 2,
      options: [
        { value: "latin", label: "字母" },
        { value: "digits", label: "数字" },
        { value: "symbols", label: "符号" },
        { value: "katakana", label: "片假名" },
        { value: "chinese", label: "中文" },
      ],
    },
    {
      key: "tone",
      type: "tone",
      label: "高亮色调 tone",
      options: toneOptions().filter((option) => option.value !== "theme"),
    },
    { key: "paused", type: "switch", label: "暂停轮换 paused" },
  ],
  defaults: {
    interval: 2600,
    by: "char",
    stagger: 35,
    duration: 1000,
    charset: "latin",
    tone: "primary",
    paused: false,
  },
  fromReport: (report) => ({ ...report }),
  toTuning: (values) => ({
    interval: values.interval as TextAnimateTuning["interval"],
    by: values.by as TextAnimateTuning["by"],
    stagger: values.stagger as TextAnimateTuning["stagger"],
    duration: values.duration as TextAnimateTuning["duration"],
    charset: values.charset as TextAnimateTuning["charset"],
    tone: values.tone as TextAnimateTuning["tone"],
    paused: values.paused as TextAnimateTuning["paused"],
  }),
})
