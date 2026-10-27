import {
  MarqueeTuningContext,
  type MarqueeTuning,
  type MarqueeReport,
} from "@/registry/ui/marquee/marquee"
import { defineTuner } from "./types"

export const marqueeTuner = defineTuner<MarqueeTuning, MarqueeReport>({
  hint: "实时调整示例参数",
  context: MarqueeTuningContext,
  controls: [
    {
      key: "speed",
      type: "slider",
      label: "速度 speed",
      min: 10,
      max: 120,
      unit: "px/s",
    },
    {
      key: "gap",
      type: "slider",
      label: "间距 gap",
      min: 0,
      max: 64,
      unit: "px",
    },
    {
      key: "rotate",
      type: "slider",
      label: "旋转 rotate",
      min: -15,
      max: 15,
      unit: "°",
    },
    { key: "reverse", type: "switch", label: "反向 reverse" },
    { key: "fade", type: "switch", label: "两端渐隐 fade" },
    { key: "pauseOnHover", type: "switch", label: "悬停暂停 pauseOnHover" },
    { key: "paused", type: "switch", label: "暂停 paused" },
  ],
  defaults: {
    speed: 48,
    gap: 32,
    rotate: 0,
    reverse: false,
    fade: true,
    pauseOnHover: true,
    paused: false,
  },
  fromReport: (report) => ({ ...report }),
  toTuning: (values) => ({
    speed: values.speed as MarqueeTuning["speed"],
    gap: values.gap as MarqueeTuning["gap"],
    rotate: values.rotate as MarqueeTuning["rotate"],
    reverse: values.reverse as MarqueeTuning["reverse"],
    fade: values.fade as MarqueeTuning["fade"],
    pauseOnHover: values.pauseOnHover as MarqueeTuning["pauseOnHover"],
    paused: values.paused as MarqueeTuning["paused"],
  }),
})
