import {
  RippleTuningContext,
  type RippleReport,
  type RippleTuning,
} from "@/registry/ui/ripple/ripple"
import { toneOptions } from "./swatches"
import { defineTuner } from "./types"

/**
 * 波纹脉冲的调整面板：模式、环数、间距、周期、色调与暂停。
 * 外框高度与设计画布固定，环数和间距变化只改变圆环本身，容器大小不变。
 */

export const rippleTuner = defineTuner<RippleTuning, RippleReport>({
  hint: "调整模式、环数与色调",
  context: RippleTuningContext,
  controls: [
    {
      key: "mode",
      type: "segmented",
      label: "模式 mode",
      options: [
        { value: "pulse", label: "扩散 pulse" },
        { value: "reach", label: "覆盖 reach" },
      ],
    },
    { key: "rings", type: "slider", label: "环数 rings", min: 1, max: 12 },
    {
      key: "ringGap",
      type: "slider",
      label: "环间距 ringGap",
      min: 8,
      max: 120,
    },
    {
      key: "duration",
      type: "slider",
      label: "周期 duration",
      unit: "s",
      min: 1,
      max: 12,
      step: 0.5,
    },
    {
      key: "tone",
      type: "segmented",
      label: "色调 tone",
      span: 2,
      options: toneOptions(),
    },
    { key: "paused", type: "switch", label: "暂停 paused" },
  ],
  defaults: { rings: 4, ringGap: 48, duration: 4, paused: false },
  fromReport: (report) => ({
    mode: report.mode,
    rings: report.rings,
    ringGap: report.ringGap,
    duration: report.duration,
    paused: report.paused,
    tone: report.tone === undefined ? "theme" : report.tone,
  }),
  toTuning: (values) => ({
    mode: values.mode as RippleTuning["mode"],
    rings: values.rings as number | undefined,
    ringGap: values.ringGap as number | undefined,
    duration: values.duration as number | undefined,
    paused: values.paused as boolean | undefined,
    tone:
      values.tone === undefined
        ? undefined
        : values.tone === "theme"
          ? false
          : (values.tone as string),
  }),
})
