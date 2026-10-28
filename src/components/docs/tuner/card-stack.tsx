import {
  CardStackTuningContext,
  type CardStackTuning,
  type CardStackReport,
} from "@/registry/ui/card-stack/card-stack"
import { defineTuner } from "./types"

export const cardStackTuner = defineTuner<CardStackTuning, CardStackReport>({
  hint: "实时调整示例参数",
  component: "CardStack",
  context: CardStackTuningContext,
  frame: { stableFrame: true },
  controls: [
    {
      key: "mode",
      type: "segmented",
      label: "模式 mode",
      options: [
        { value: "auto", label: "自动" },
        { value: "drag", label: "拖拽" },
      ],
    },
    {
      key: "interval",
      type: "slider",
      label: "轮换间隔 interval",
      min: 1000,
      max: 8000,
      step: 250,
      unit: "ms",
    },
    { key: "depth", type: "slider", label: "层叠深度 depth", min: 1, max: 3 },
    {
      key: "offset",
      type: "slider",
      label: "层间偏移 offset",
      min: 0,
      max: 16,
      unit: "px",
    },
    {
      key: "scale",
      type: "slider",
      label: "逐层缩放 scale",
      min: 0,
      max: 0.06,
      step: 0.005,
    },
    { key: "paused", type: "switch", label: "暂停 paused" },
  ],
  defaults: {
    mode: "auto",
    interval: 4000,
    depth: 3,
    offset: 12,
    scale: 0.04,
    paused: false,
  },
  fromReport: (report) => ({ ...report }),
  toTuning: (values) => ({
    mode: values.mode as CardStackTuning["mode"],
    interval: values.interval as CardStackTuning["interval"],
    depth: values.depth as CardStackTuning["depth"],
    offset: values.offset as CardStackTuning["offset"],
    scale: values.scale as CardStackTuning["scale"],
    paused: values.paused as CardStackTuning["paused"],
  }),
})
